from flask import Blueprint
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from werkzeug.exceptions import NotFound, BadRequest
from pydantic import ValidationError
from .responses import error_response

error_handlers = Blueprint('error_handlers', __name__)

@error_handlers.app_errorhandler(NotFound)
def handle_404(error):
    return error_response(
        message="Resource not found",
        status_code=404,
        error_code="NOT_FOUND"
    )

@error_handlers.app_errorhandler(BadRequest)
def handle_400(error):
    """Handle 400 Bad Request errors"""
    return error_response(
        message=str(error.description),
        status_code=400,
        error_code="BAD_REQUEST"
    )

@error_handlers.app_errorhandler(SQLAlchemyError)
def handle_database_error(error):
    """Handle database errors"""
    return error_response(
        message="Database error occurred",
        status_code=500,
        error_code="DATABASE_ERROR"
    )

@error_handlers.app_errorhandler(IntegrityError)
def handle_integrity_error(error):
    return error_response(
        message="Data integrity error",
        status_code=400,
        error_code="INTEGRITY_ERROR"
    )

@error_handlers.app_errorhandler(Exception)
def handle_generic_error(error):
    return error_response(
        message="An unexpected error occurred",
        status_code=500,
        error_code="INTERNAL_SERVER_ERROR"
    )

@error_handlers.app_errorhandler(ValidationError)
def handle_validation_error(error):
    """Handle validation errors"""
    return error_response(
        message=str(error),
        status_code=400,
        error_code="VALIDATION_ERROR"
    )
