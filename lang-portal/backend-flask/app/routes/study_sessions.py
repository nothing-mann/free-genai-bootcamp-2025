import logging
from flask import jsonify, Blueprint

from app.models import StudySession
from app.extensions import db

bp = Blueprint('study_sessions', __name__)
logger = logging.getLogger(__name__)

@bp.route('/api/study-sessions', methods=['GET'])
def list_study_sessions():
    try:
        study_sessions = StudySession.query.order_by(StudySession.created_at.desc()).all()
        return jsonify({
            'data': {
                'study_sessions': [session.to_dict() for session in study_sessions]
            }
        }), 200
    except Exception as e:
        logger.error(f"Error in list_study_sessions: {str(e)}", exc_info=True)
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500
