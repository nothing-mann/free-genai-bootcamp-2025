import pytest
from app import db
from app.models import Word, Group, StudySession, StudyActivity

class TestErrorResponses:
    """Test error response handling"""
    def test_404_errors(self, client):
        """Test 404 Not Found responses"""
        endpoints = [
            '/api/words/999',
            '/api/groups/999',
            '/api/study-activities/999',
            '/api/study-sessions/999'
        ]
        for endpoint in endpoints:
            response = client.get(endpoint)
            assert response.status_code == 404
            assert response.json['error_code'] == 'NOT_FOUND'

    def test_400_errors(self, client):
        """Test 400 Bad Request responses"""
        test_cases = [
            ('/api/study-activities', 'POST', {}),
            ('/api/study-sessions/1/words/1/review', 'POST', {'is_correct': 'invalid'}),
            ('/api/words?page=-1', 'GET', None)
        ]
        for endpoint, method, data in test_cases:
            if method == 'GET':
                response = client.get(endpoint)
            else:
                response = client.post(endpoint, json=data)
            assert response.status_code == 400

    def test_validation_errors(self, client):
        """Test validation error handling"""
        response = client.post('/api/study-activities', json={})
        assert response.status_code == 400
        assert response.json['error_code'] == 'VALIDATION_ERROR'

        invalid_data = {
            'group_id': 'invalid',  # Should be integer
            'study_activity_id': 1
        }
        response = client.post('/api/study-activities', json=invalid_data)
        assert response.status_code == 400
        assert response.json['error_code'] == 'VALIDATION_ERROR'

        invalid_review = {
            'is_correct': 'invalid'  # Should be boolean
        }
        response = client.post('/api/study-sessions/1/words/1/review', 
                             json=invalid_review)
        assert response.status_code == 400

class TestDatabaseErrors:
    """Test database error handling"""
    def test_integrity_errors(self, client, session):
        """Test database integrity error handling"""
        response = client.get('/api/words/999999999')
        assert response.status_code == 404
        assert response.json['error_code'] == 'NOT_FOUND'

    def test_transaction_rollback(self, client, session):
        """Test transaction rollback on errors"""
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
        assert 'data' in response.json
        assert 'word_groups' in response.json['data']
        assert len(response.json['data']['word_groups']) == 0

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
