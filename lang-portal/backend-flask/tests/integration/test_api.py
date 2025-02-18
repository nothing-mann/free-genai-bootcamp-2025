import pytest
from flask import url_for

def test_dashboard(client, session, sample_words, sample_groups, sample_study_session):
    """Test dashboard endpoint"""
    response = client.get('/api/dashboard')
    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] is True
    assert data['data']['total_words'] == len(sample_words)
    assert data['data']['total_groups'] == len(sample_groups)
    assert data['data']['total_study_sessions'] == 1

def test_word_listing(client, session, sample_words):
    """Test word listing endpoint"""
    response = client.get('/api/words')
    assert response.status_code == 200
    data = response.get_json()
    assert len(data['data']['words']) == len(sample_words)
    assert data['meta']['pagination']['total_items'] == len(sample_words)

def test_group_listing(client, session, sample_groups):
    """Test group listing endpoint"""
    response = client.get('/api/groups')
    assert response.status_code == 200
    data = response.get_json()
    assert 'word_groups' in data
    assert len(data['word_groups']) == len(sample_groups)

def test_study_session_creation(client, session, sample_groups, sample_activities):
    """Test study session creation"""
    payload = {
        'group_id': sample_groups[0].id,
        'study_activity_id': sample_activities[0].id
    }
    response = client.post('/api/study-activities', json=payload)
    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] is True
    assert 'id' in data['data']

def test_word_review(client, session, sample_study_session, sample_words):
    """Test word review submission"""
    payload = {'is_correct': True}
    url = f'/api/study-sessions/{sample_study_session.id}/words/{sample_words[0].id}/review'
    
    response = client.post(url, json=payload)
    assert response.status_code == 200
    data = response.get_json()
    assert data['success'] is True
    assert 'id' in data
    assert data['is_correct'] is True
