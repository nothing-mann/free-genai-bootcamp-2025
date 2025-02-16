from functools import wraps
from flask import request, jsonify
from pydantic import ValidationError
from app.schemas import PaginationParams

def validate_pagination():
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                pagination = PaginationParams(
                    page=request.args.get('page', 1, type=int),
                    per_page=request.args.get('per_page', 20, type=int)
                )
                return f(*args, **kwargs, pagination=pagination)
            except ValidationError as e:
                return jsonify({"error": str(e)}), 400
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
