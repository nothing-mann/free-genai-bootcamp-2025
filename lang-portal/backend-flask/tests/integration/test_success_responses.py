import pytest
from datetime import datetime
from app import db
from app.models import Word, Group, StudyActivity, StudySession, WordReviewItem

@pytest.fixture
def sample_data(session):
    """Create sample data for testing"""
    word = Word(
        nepali_word='नमस्ते',
        romanized_nepali_word='namaste',
        english_word='hello',
        part_of_speech=['greeting']
    )
    group = Group(name='Greetings', description='Basic greetings')
    activity = StudyActivity(
        name='Test Activity',
        description='Test Description',
        instructions='Test Instructions',
        thumbnail='test.jpg'
    )
    
    session.add_all([word, group, activity])
    session.commit()
    
    # Create a study session and review
    session_obj = StudySession(
        group_id=group.id,
        study_activity_id=activity.id,
        started_at=datetime.utcnow()
    )
    session.add(session_obj)
    session.commit()
    
    review = WordReviewItem(
        word_id=word.id,
        session_id=session_obj.id,
        group_id=group.id,
        is_correct=True
    )
    session.add(review)
    session.commit()
    
    return {
        'word': word, 
        'group': group, 
        'activity': activity,
        'session': session_obj,
        'review': review
    }

@pytest.fixture
def setup_statistics(session, sample_data):
    """Setup data for statistics testing"""
    session_obj = sample_data['session']
    word = sample_data['word']
    group = sample_data['group']
    
    # Create a review
    review = WordReviewItem(
        word_id=word.id,
        session_id=session_obj.id,
        group_id=group.id,
        is_correct=True
    )
    session.add(review)
    session.commit()
    
    return sample_data

def test_successful_responses(client, session, sample_words, sample_groups):
    """Test successful response structure"""
    response = client.get('/api/dashboard')
    assert response.status_code == 200
    data = response.get_json()
    assert 'success' in data
    assert data['success'] is True

def test_study_session_responses(client, session, sample_groups, sample_activities):
    """Test study session related responses"""
    payload = {
        'group_id': sample_groups[0].id,
        'study_activity_id': sample_activities[0].id
    }
    response = client.post('/api/study-activities', json=payload)
    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] is True

def test_statistics_responses(client, session, setup_statistics):
    """Test statistics endpoint responses"""
    # Test statistics endpoint
    response = client.get('/api/dashboard/statistics')
    assert response.status_code == 200
    data = response.get_json()
    
    # Check response structure
    assert 'success' in data
    assert 'message' in data
    assert 'timestamp' in data
    assert 'data' in data
    
    # Check statistics data types
    stats_data = data['data']
    assert isinstance(stats_data['words_learned'], int)
    assert isinstance(stats_data['study_sessions_completed'], int)
    assert isinstance(stats_data['average_score'], (int, float))
    assert isinstance(stats_data['total_reviews'], int)

    # Test study progress endpoint
    response = client.get('/api/dashboard/study-progress')
    assert response.status_code == 200
    data = response.get_json()
    
    # Verify response structure
    assert 'success' in data
    assert 'message' in data
    assert 'timestamp' in data
    assert 'data' in data
    assert 'progress' in data['data']
    
    # Verify progress data
    progress = data['data']['progress']
    assert 'total_words_studied' in progress
    assert 'total_sessions' in progress
    assert 'total_activities' in progress
    
    # Verify data types
    assert isinstance(progress['total_words_studied'], int)
    assert isinstance(progress['total_sessions'], int)
    assert isinstance(progress['total_activities'], int)
