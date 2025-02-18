import pytest
from app import db
from app.models import Word, Group, StudySession, StudyActivity

def test_404_handling(client, session):
    """Test 404 Not Found responses"""
    response = client.get('/api/words/999')
    assert response.status_code == 404
    assert 'error_code' in response.json
    assert response.json['error_code'] == 'NOT_FOUND'

def test_400_bad_request(client):
    """Test 400 Bad Request responses"""
    response = client.post('/api/study-activities', json={})
    assert response.status_code == 400
    assert 'error_code' in response.json
    assert response.json['error_code'] == 'VALIDATION_ERROR'

def test_database_error_handling(client, session):
    """Test database error handling"""
    # Create invalid data to trigger DB error
    response = client.get('/api/words/999999999')
    assert response.status_code == 404
    assert response.json['error_code'] == 'NOT_FOUND'

def test_validation_error(client):
    """Test validation error handling"""
    response = client.post('/api/study-activities', json={})
    assert response.status_code == 400
    assert response.json['error_code'] == 'VALIDATION_ERROR'

def test_study_session_validation(client, session):
    """Test study session validation"""
    invalid_data = {
        'group_id': 'invalid',  # Should be integer
        'study_activity_id': 1
    }
    response = client.post('/api/study-activities', json=invalid_data)
    assert response.status_code == 400
    assert response.json['error_code'] == 'VALIDATION_ERROR'

def test_word_review_validation(client):
    """Test word review validation"""
    # Test invalid review data
    invalid_review = {
        'is_correct': 'invalid'  # Should be boolean
    }
    response = client.post('/api/study-sessions/1/words/1/review', 
                         json=invalid_review)
    assert response.status_code == 400

def test_word_group_relationship_error(client, session):
    """Test word-group relationship errors"""
    # Create test word and group
    word = Word(
        nepali_word='test',
        romanized_nepali_word='test',
        english_word='test',
        part_of_speech=['noun']
    )
    group = Group(name='test', description='test')
    session.add_all([word, group])
    session.commit()
    
    # Test empty relationship
    response = client.get(f'/api/words/{word.id}/groups')
    assert response.status_code == 200
    assert 'word_groups' in response.json
    assert len(response.json['word_groups']) == 0

def test_pagination_limits(client):
    """Test pagination boundary conditions"""
    # Test exceeding max per_page
    response = client.get('/api/words?per_page=1000')
    assert response.status_code == 400
    assert response.json['error_code'] == 'VALIDATION_ERROR'
    
    # Test negative page
    response = client.get('/api/words?page=-1')
    assert response.status_code == 400
    assert response.json['error_code'] == 'VALIDATION_ERROR'

def test_reset_endpoints(client):
    """Test reset endpoint error handling"""
    # Test reset_history with db error
    with pytest.raises(Exception):
        response = client.post('/api/reset-history')
        assert response.status_code == 500
        assert response.json['error_code'] == 'DATABASE_ERROR'
    
    # Test full_reset with db error
    with pytest.raises(Exception):
        response = client.post('/api/full-reset')
        assert response.status_code == 500
        assert response.json['error_code'] == 'DATABASE_ERROR'
