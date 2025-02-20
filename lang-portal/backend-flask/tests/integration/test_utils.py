import pytest
from flask import current_app
from app.utils.responses import success_response, error_response

def test_response_formatting(app):
    """Test response formatting with app context"""
    with app.app_context():
        response, status = success_response(data={"test": "data"})
        assert status == 200
        assert response.json['success'] is True
        assert 'timestamp' in response.json

def test_error_formatting(app):
    """Test error formatting with app context"""
    with app.app_context():
        response, status = error_response(
            message="Test error",
            error_code="TEST_ERROR",
            status_code=400
        )
        assert status == 400
        assert response.json['error_code'] == "TEST_ERROR"
