import pytest
from flask import current_app
from app.utils.responses import success_response, error_response, pagination_meta
from app.utils.statistics import get_study_progress, get_dashboard_statistics

def test_response_formatting_integration(app):
    """Test response formatting with app context"""
    with app.app_context():
        response, status = success_response(data={"test": "data"})
        assert status == 200
        assert response.json['success'] is True
        assert response.json['data']['test'] == "data"
        assert 'timestamp' in response.json

def test_error_formatting_integration(app):
    """Test error formatting with app context"""
    with app.app_context():
        response, status = error_response(
            message="Test error",
            error_code="TEST_ERROR",
            status_code=400
        )
        assert status == 400
        assert response.json['error_code'] == "TEST_ERROR"
        assert not response.json['success']

def test_pagination_integration(app, client, sample_words):
    """Test pagination with actual database queries"""
    with app.app_context():
        response = client.get('/api/words?page=1&per_page=2')
        assert response.status_code == 200
        assert 'meta' in response.json
        assert response.json['meta']['pagination']['per_page'] == 2

def test_statistics_integration(app, client, sample_word_reviews):
    """Test statistics with actual data"""
    with app.app_context():
        stats = get_dashboard_statistics()
        assert 'words_learned' in stats
        assert 'average_score' in stats
        assert isinstance(stats['words_learned'], int)
