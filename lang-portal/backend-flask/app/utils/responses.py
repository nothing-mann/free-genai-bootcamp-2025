from flask import jsonify
from typing import Any, Dict, Optional
from datetime import datetime, UTC

def success_response(
    data: Any = None,
    message: str = "Success",
    status_code: int = 200,
    meta: Optional[Dict] = None
) -> tuple:
    """
    Creates a standardized success response
    """
    response = {
        "success": True,
        "message": message,
        "timestamp": datetime.now(UTC).isoformat() + "Z"
    }
    
    if data is not None:
        response["data"] = data
    
    if meta is not None:
        response["meta"] = meta
        
    return jsonify(response), status_code

def error_response(
    message: str = "An error occurred",
    status_code: int = 500,
    error_code: Optional[str] = None,
    errors: Optional[list] = None
) -> tuple:
    """
    Creates a standardized error response
    """
    response = {
        "success": False,
        "message": message,
        "timestamp": datetime.now(UTC).isoformat() + "Z"
    }
    
    if error_code:
        response["error_code"] = error_code
        
    if errors:
        response["errors"] = errors
        
    return jsonify(response), status_code

def pagination_meta(pagination) -> Dict:
    """
    Creates standardized pagination metadata
    """
    return {
        "pagination": {
            "page": pagination.page,
            "per_page": pagination.per_page,
            "total_pages": pagination.pages,
            "total_items": pagination.total,
            "has_next": pagination.has_next,
            "has_previous": pagination.has_prev
        }
    }
