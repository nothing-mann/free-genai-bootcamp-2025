import pytest
from datetime import datetime, UTC
from app.utils.responses import success_response, error_response, pagination_meta

class TestSuccessResponse:
    def test_basic_response(self, app):
        """Test basic success response structure"""
        with app.app_context():
            response, status = success_response(data={"test": "data"})
            assert status == 200
            assert response.json['success'] is True
            assert response.json['data']['test'] == "data"
            assert isinstance(response.json['timestamp'], str)
            assert response.json['timestamp'].endswith('Z')

    def test_response_with_meta(self, app):
        """Test success response with metadata"""
        with app.app_context():
            meta = {"total": 100}
            response, status = success_response(data={"test": "data"}, meta=meta)
            assert response.json['meta'] == meta

class TestErrorResponse:
    def test_basic_error(self, app):
        """Test basic error response structure"""
        with app.app_context():
            response, status = error_response("Test error", status_code=400)
            assert status == 400
            assert response.json['success'] is False
            assert response.json['message'] == "Test error"
            assert isinstance(response.json['timestamp'], str)

    def test_error_with_code(self, app):
        """Test error response with error code"""
        with app.app_context():
            response, status = error_response(
                message="Invalid input",
                error_code="VALIDATION_ERROR",
                status_code=400
            )
            assert response.json['error_code'] == "VALIDATION_ERROR"

class TestPaginationMeta:
    def test_pagination_format(self):
        """Test pagination metadata format"""
        class MockPagination:
            page = 1
            per_page = 10
            pages = 5
            total = 45
            has_next = True
            has_prev = False

        meta = pagination_meta(MockPagination())
        pagination = meta['pagination']
        
        assert pagination['page'] == 1
        assert pagination['per_page'] == 10
        assert pagination['total_pages'] == 5
        assert pagination['total_items'] == 45
        assert pagination['has_next'] is True
        assert pagination['has_previous'] is False

    def test_empty_pagination(self):
        """Test pagination metadata with no results"""
        class MockPagination:
            page = 1
            per_page = 10
            pages = 0
            total = 0
            has_next = False
            has_prev = False

        meta = pagination_meta(MockPagination())
        pagination = meta['pagination']
        
        assert pagination['total_items'] == 0
        assert pagination['total_pages'] == 0
        assert pagination['has_next'] is False
        assert pagination['has_previous'] is False

    def test_last_page_pagination(self):
        """Test pagination metadata on last page"""
        class MockPagination:
            page = 5
            per_page = 10
            pages = 5
            total = 45
            has_next = False
            has_prev = True

        meta = pagination_meta(MockPagination())
        pagination = meta['pagination']
        
        assert pagination['page'] == 5
        assert pagination['has_next'] is False
        assert pagination['has_previous'] is True
