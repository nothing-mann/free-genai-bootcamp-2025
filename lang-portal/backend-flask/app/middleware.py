from functools import wraps
from flask import request, jsonify
from pydantic import ValidationError
from app.schemas import PaginationParams
from app.utils.responses import error_response

def validate_pagination(max_per_page=50):
    """Validates and standardizes pagination parameters"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                page = request.args.get('page', 1, type=int)
                per_page = request.args.get('per_page', 20, type=int)
                
                if page < 1:
                    return error_response(
                        message="Page number must be positive",
                        error_code="VALIDATION_ERROR",
                        status_code=400
                    )
                
                if per_page < 1 or per_page > max_per_page:
                    return error_response(
                        message=f"Items per page must be between 1 and {max_per_page}",
                        error_code="VALIDATION_ERROR",
                        status_code=400
                    )
                
                return f(*args, page=page, per_page=per_page, **kwargs)
            except (ValueError, TypeError):
                return error_response(
                    message="Invalid pagination parameters",
                    error_code="VALIDATION_ERROR",
                    status_code=400
                )
        return decorated_function
    return decorator

def validate_json_body(schema_class):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                data = request.get_json()
                validated_data = schema_class(**data)
                return f(*args, **kwargs, data=validated_data)
            except ValidationError as e:
                return jsonify({"error": str(e)}), 400
            except Exception as e:
                return jsonify({"error": "Invalid JSON format"}), 400
        return decorated_function
    return decorator
