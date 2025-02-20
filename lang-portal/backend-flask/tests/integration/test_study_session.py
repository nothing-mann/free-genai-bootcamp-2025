import pytest

def test_get_study_session(client, session, sample_study_session):
    """Test getting study session details"""
    response = client.get(f'/api/study-sessions/{sample_study_session.id}')
    assert response.status_code == 200
    data = response.json['data']
    assert data['id'] == sample_study_session.id
    assert data['group_id'] == sample_study_session.group_id
    assert data['study_activity_id'] == sample_study_session.study_activity_id

def test_study_session_list(client, sample_study_session):
    """Test listing study sessions"""
    response = client.get('/api/study-sessions')
    assert response.status_code == 200
    assert 'study_sessions' in response.json['data']
    assert len(response.json['data']['study_sessions']) > 0
