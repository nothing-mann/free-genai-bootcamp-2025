from flask import Blueprint, jsonify, request, abort
from app.models.word import Word
from app.models.group import Group
from app.models.study_activity import StudyActivity 
from app.models.study_session import StudySession 
from app.models.word_review import WordReviewItem
from app.middleware import validate_pagination, validate_json_body
from app.schemas import StudyActivityCreate, WordReviewCreate
from app import db
from datetime import datetime, UTC
from app.utils.responses import success_response, error_response, pagination_meta
from app.utils.statistics import get_study_progress, get_dashboard_statistics

bp = Blueprint('api', __name__, url_prefix='/api')


@bp.route('/', methods=['GET'])
def index():
    return jsonify({
        "message": "Nepali Language Learning API",
        "version": "1.0",
        "status": "operational"
    })

@bp.route('/dashboard', methods=['GET'])
def dashboard():
    """Get dashboard overview"""
    try:
        data = {
            'total_words': Word.query.count(),
            'total_groups': Group.query.count(),
            'total_study_sessions': StudySession.query.count()
        }
        return success_response(data=data)
    except Exception as e:
        return error_response(
            message="Failed to fetch dashboard data",
            error_code="DASHBOARD_ERROR",
            status_code=404
        )

@bp.route('/words', methods=['GET'])
@validate_pagination()
def get_words(page=1, per_page=20):
    try:
        pagination = Word.query.paginate(page=page, per_page=per_page)
        data = {
            "words": [{
                "id": w.id,
                "nepali_word": w.nepali_word,
                "romanized_nepali_word": w.romanized_nepali_word,
                "english_word": w.english_word,
                "part_of_speech": w.part_of_speech
            } for w in pagination.items]
        }
        return success_response(data=data, meta=pagination_meta(pagination))
    except Exception as e:
        return error_response(
            message="Failed to fetch words",
            error_code="NOT_FOUND",
            status_code=404
        )

@bp.route('/dashboard/statistics', methods=['GET'])
def dashboard_statistics():
    """Get dashboard statistics"""
    try:
        reviews = WordReviewItem.query
        total_reviews = reviews.count()
        correct_reviews = reviews.filter_by(is_correct=True).count()
        
        data = {
            'words_learned': db.session.query(WordReviewItem.word_id).group_by(WordReviewItem.word_id).count(),
            'average_score': (correct_reviews / total_reviews * 100) if total_reviews > 0 else 0,
            'total_reviews': total_reviews,
            'study_sessions_completed': StudySession.query.filter(StudySession.ended_at.isnot(None)).count()
        }
        return success_response(data=data)
    except Exception as e:
        return error_response(
            message="Failed to fetch statistics",
            error_code="STATISTICS_ERROR",
            status_code=404
        )

@bp.route('/study-sessions/<int:session_id>/words/<int:word_id>/review', methods=['POST'])
def review_word(session_id, word_id):
    try:
        data = request.get_json()
        if not data or 'is_correct' not in data:
            abort(400, description="Missing is_correct field")
            
        if not isinstance(data['is_correct'], bool):
            abort(400, description="is_correct must be a boolean")
            
        session = StudySession.query.get_or_404(session_id)
        
        review = WordReviewItem(
            word_id=word_id,
            session_id=session_id,
            group_id=session.group_id,
            is_correct=data['is_correct']
        )
        
        db.session.add(review)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "Word review item reviewed successfully",
            "id": review.id,
            "word_id": review.word_id,
            "session_id": review.session_id,
            "group_id": review.group_id,
            "is_correct": review.is_correct,
            "created_at": review.created_at.isoformat() + "Z"
        })
    except ValueError as e:
        return error_response(str(e), status_code=400, error_code="VALIDATION_ERROR")

@bp.route('/dashboard/last-session', methods=['GET'])
def last_session():
    """Get last study session"""
    try:
        last_session = StudySession.query.order_by(StudySession.started_at.desc()).first()
        if not last_session:
            return success_response(data={'id': None, 'score': None})
        
        reviews = WordReviewItem.query.filter_by(session_id=last_session.id)
        total = reviews.count()
        correct = reviews.filter_by(is_correct=True).count()
        score = (correct / total * 100) if total > 0 else 0
        
        return success_response(data={
            'id': last_session.id,
            'score': round(score, 2),
            'started_at': last_session.started_at.isoformat() + "Z",
            'ended_at': last_session.ended_at.isoformat() + "Z" if last_session.ended_at else None
        })
    except Exception as e:
        return error_response(
            message="Failed to fetch last session",
            error_code="SESSION_ERROR",
            status_code=404
        )

@bp.route('/dashboard/study-progress', methods=['GET'])
def study_progress():
    """Get study progress"""
    try:
        data = {
            'progress': {
                'total_words_studied': db.session.query(WordReviewItem.word_id).group_by(WordReviewItem.word_id).count(),
                'total_sessions': StudySession.query.count(),
                'total_activities': StudyActivity.query.count()
            }
        }
        return success_response(data=data)
    except Exception as e:
        return error_response(
            message="Failed to fetch study progress",
            error_code="PROGRESS_ERROR",
            status_code=404
        )

@bp.route('/study-activities', methods=['GET'])
@validate_pagination()
def get_study_activities(page=1, per_page=20):
    try:
        pagination = StudyActivity.query.paginate(page=page, per_page=per_page)
        return success_response(
            data={
                "study_activities": [{
                    "id": a.id,
                    "name": a.name,
                    "description": a.description,
                    "instructions": a.instructions,
                    "thumbnail": a.thumbnail
                } for a in pagination.items]
            },
            meta=pagination_meta(pagination)
        )
    except Exception as e:
        return error_response(
            message="Failed to fetch activities",
            error_code="NOT_FOUND",
            status_code=404
        )

@bp.route('/study-activities/<int:id>', methods=['GET'])
def get_study_activity(id):
    """Get details of a specific study activity"""
    try:
        activity = db.session.get(StudyActivity, id)
        
        return success_response(
            data={
                "id": activity.id,
                "name": activity.name,
                "description": activity.description,
                "instructions": activity.instructions,
                "thumbnail": activity.thumbnail
            }
        )
    except Exception as e:
        return error_response(
            message="Failed to fetch study activity",
            error_code="NOT_FOUND",
            status_code=404
        )

@bp.route('/study-activities/<int:id>/study-sessions', methods=['GET'])
def get_activity_sessions(id):
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    pagination = StudySession.query.filter_by(study_activity_id=id).paginate(
        page=page, per_page=per_page
    )
    
    return jsonify({
        "study_sessions": [format_study_session(session) for session in pagination.items],
        "pagination": {
            "page": pagination.page,
            "per_page": pagination.per_page,
            "total_pages": pagination.pages,
            "has_next": pagination.has_next,
            "has_previous": pagination.has_prev
        }
    })

@bp.route('/study-activities', methods=['POST'])
def create_study_session():
    try:
        data = request.get_json()
        if not data or 'group_id' not in data or 'study_activity_id' not in data:
            return error_response(
                message="Missing required fields",
                error_code="VALIDATION_ERROR",
                status_code=400
            )
        
        try:
            group_id = int(data['group_id'])
            study_activity_id = int(data['study_activity_id'])
        except (ValueError, TypeError):
            return error_response(
                message="Invalid data types for group_id or study_activity_id",
                error_code="VALIDATION_ERROR",
                status_code=400
            )
        
        # Verify the group and activity exist
        group = db.session.get(Group, group_id)
        activity = db.session.get(StudyActivity, study_activity_id)
        
        if not group or not activity:
            return error_response(
                message="Group or activity not found",
                error_code="NOT_FOUND",
                status_code=404
            )
        
        # Create the study session
        session = StudySession(
            group_id=group_id,
            study_activity_id=study_activity_id,
            started_at=datetime.now(UTC)
        )
        db.session.add(session)
        db.session.commit()
        
        # Get all words from the group
        group_words = [{
            'id': w.id,
            'nepali_word': w.nepali_word,
            'english_word': w.english_word,
            'romanized_nepali_word': w.romanized_nepali_word
        } for w in group.words]
        
        return jsonify({
            "success": True,
            "message": "Study session created successfully",
            "id": session.id,
            "group_id": session.group_id,
            "study_activity_id": session.study_activity_id,
            "words": group_words
        })
    except Exception as e:
        db.session.rollback()
        return error_response(
            message="Failed to create study session",
            error_code="VALIDATION_ERROR",
            status_code=400
        )



@bp.route('/words/<int:id>', methods=['GET'])
def get_word(id):
    try:
        word = db.session.get(Word, id)
        if not word:
            return error_response(
                message=f"Word with id {id} not found",
                error_code="NOT_FOUND",
                status_code=404
            )
            
        return success_response(data={
            "id": word.id,
            "nepali_word": word.nepali_word,
            "romanized_nepali_word": word.romanized_nepali_word,
            "english_word": word.english_word,
            "part_of_speech": word.part_of_speech,
            "word_groups": [{
                "id": g.id,
                "name": g.name,
                "description": g.description,
                "total_words": g.words.count()
            } for g in word.groups]
        })
    except Exception as e:
        return error_response(
            message=f"Error retrieving word: {str(e)}",
            error_code="NOT_FOUND",
            status_code=404
        )

@bp.route('/words/<int:id>/groups', methods=['GET'])
@validate_pagination()
def get_word_groups(id, page=1, per_page=20):
    """Get groups associated with a word"""
    try:
        word = db.session.get(Word, id)
        if not word:
            return error_response(
                message=f"Word with id {id} not found",
                error_code="NOT_FOUND",
                status_code=404
            )
        
        pagination = word.groups.paginate(page=page, per_page=per_page)
        
        return success_response(
            data={
                "word_groups": [{
                    "id": g.id,
                    "name": g.name,
                    "description": g.description,
                    "total_words": g.words.count()
                } for g in pagination.items]
            },
            meta=pagination_meta(pagination)
        )
    except Exception as e:
        return error_response(
            message=f"Error retrieving word groups: {str(e)}",
            error_code="NOT_FOUND",
            status_code=404
        )





@bp.route('/reset-history', methods=['POST'])
def reset_history():
    try:
        WordReviewItem.query.delete()
        StudySession.query.delete()
        db.session.commit()
        return jsonify({
            "success": True,
            "message": "History reset successfully"
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "message": str(e)
        }), 404

@bp.route('/full-reset', methods=['POST'])
def full_reset():
    try:
        WordReviewItem.query.delete()
        StudySession.query.delete()
        Word.query.delete()
        Group.query.delete()
        db.session.commit()
        return jsonify({
            "success": True,
            "message": "Full reset successfully"
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "message": str(e)
        }), 404

@bp.route('/study-sessions', methods=['GET'])
@validate_pagination()
def get_study_sessions(page=1, per_page=20):
    """Get paginated list of study sessions"""
    try:
        pagination = StudySession.query.paginate(page=page, per_page=per_page)
        
        data = {
            "study_sessions": [{
                "id": s.id,
                "group_id": s.group_id,
                "study_activity_id": s.study_activity_id,
                "started_at": s.started_at.isoformat() + "Z",
                "ended_at": s.ended_at.isoformat() + "Z" if s.ended_at else None,
                "group_name": s.group.name if s.group else None,
                "activity_name": s.activity.name if s.activity else None
            } for s in pagination.items]
        }
        
        return success_response(data=data, meta=pagination_meta(pagination))
    except Exception as e:
        db.session.rollback()
        return error_response(
            message="Failed to fetch study sessions",
            error_code="NOT_FOUND",
            status_code=404
        )

@bp.route('/study-sessions/<int:id>', methods=['GET'])
def get_study_session(id):
    """Get single study session details"""
    try:
        session_obj = db.session.get(StudySession, id)
        data = {
            "id": session_obj.id,
            "group_id": session_obj.group_id,
            "study_activity_id": session_obj.study_activity_id,
            "started_at": session_obj.started_at.isoformat() + "Z",
            "ended_at": session_obj.ended_at.isoformat() + "Z" if session_obj.ended_at else None,
            "group_name": session_obj.group.name if session_obj.group else None,
            "activity_name": session_obj.activity.name if session_obj.activity else None
        }
        return success_response(data=data)
    except Exception as e:
        db.session.rollback()
        return error_response(
            message="Failed to fetch study session",
            error_code="NOT_FOUND",
            status_code=404
        )

@bp.route('/study-sessions/<int:id>/words', methods=['GET'])
@validate_pagination()
def get_session_words(id, page=1, per_page=20):  # Fixed parameter names
    try:
        session = StudySession.query.get_or_404(id)
        reviewed_word_ids = db.session.query(WordReviewItem.word_id)\
            .filter_by(session_id=id)\
            .distinct()
        
        pagination = Word.query\
            .filter(Word.id.in_(reviewed_word_ids))\
            .paginate(page=page, per_page=per_page)
        
        return success_response(
            data={
                "words": [{
                    "id": w.id,
                    "nepali_word": w.nepali_word,
                    "romanized_nepali_word": w.romanized_nepali_word,
                    "english_word": w.english_word
                } for w in pagination.items]
            },
            meta=pagination_meta(pagination)
        )
    except Exception as e:
        return error_response(
            message="Failed to fetch session words",
            error_code="NOT_FOUND",
            status_code=404
        )

@bp.route('/groups/<int:id>/study-sessions', methods=['GET'])
@validate_pagination()
def get_group_study_sessions(id, page=1, per_page=20):  # Fixed parameter names
    try:
        group = db.session.get(Group, id)
        
        pagination = StudySession.query\
            .filter_by(group_id=id)\
            .paginate(page=page, per_page=per_page)
        
        return success_response(
            data={
                "study_sessions": [format_study_session(session) for session in pagination.items]
            },
            meta=pagination_meta(pagination)
        )
    except Exception as e:
        return error_response(
            message="Failed to fetch group study sessions",
            error_code="NOT_FOUND",
            status_code=404
        )

@bp.route('/study-sessions/<int:id>/end', methods=['POST'])
def end_study_session(id):
    try:
        session = db.session.get(StudySession, id)
        
        if session.ended_at is not None:
            return error_response(
                message="Session already ended",
                error_code="INVALID_STATE",
                status_code=400
            )
            
        session.ended_at = datetime.now(UTC)
        db.session.commit()
        
        return success_response(data=format_study_session(session))
    except Exception as e:
        db.session.rollback()
        return error_response(
            message="Failed to end session",
            error_code="UPDATE_ERROR",
            status_code=404
        )

# Helper function for formatting study sessions
def format_study_session(session):
    """Format study session data with review counts"""
    # Use distinct count to avoid duplicates
    correct_count = WordReviewItem.query.filter_by(
        session_id=session.id, 
        is_correct=True
    ).count()
    
    wrong_count = WordReviewItem.query.filter_by(
        session_id=session.id, 
        is_correct=False
    ).count()
    
    total_count = WordReviewItem.query.filter_by(
        session_id=session.id
    ).count()
    
    return {
        "id": session.id,
        "activity_name": session.activity.name,
        "group_name": session.group.name,
        "started_at": session.started_at.isoformat() + "Z",
        "ended_at": session.ended_at.isoformat() + "Z" if session.ended_at else None,
        "number_of_review_items": total_count,
        "number_of_correct_review_items": correct_count,
        "number_of_wrong_review_items": wrong_count
    }

def calculate_average_score():
    """Calculate average score across all reviews"""
    correct_reviews = WordReviewItem.query.filter_by(is_correct=True).count()
    total_reviews = WordReviewItem.query.count()
    return round((correct_reviews / total_reviews * 100) if total_reviews > 0 else 0, 2)

def calculate_streak():
    """Calculate current learning streak"""
    # For now, return a placeholder value
    return 0

@bp.route('/groups', methods=['GET'])
@validate_pagination()
def get_groups(page=1, per_page=20):
    """Get paginated list of word groups"""
    try:
        pagination = Group.query.paginate(page=page, per_page=per_page)
        
        return success_response(
            data={
                "word_groups": [{
                    "id": g.id,
                    "name": g.name,
                    "description": g.description,
                    "total_words": g.total_words
                } for g in pagination.items]
            },
            meta=pagination_meta(pagination)
        )
    except Exception as e:
        return error_response(
            message="Failed to fetch groups",
            error_code="NOT_FOUND",
            status_code=404
        )

@bp.route('/groups/<int:id>', methods=['GET'])
def get_group(id):
    """Get details of a specific group"""
    try:
        group = db.session.get(Group, id)
        
        return success_response(
            data={
                "id": group.id,
                "name": group.name,
                "description": group.description,
                "statistics": {
                    "correct_count": WordReviewItem.query.filter_by(group_id=id, is_correct=True).count(),
                    "wrong_count": WordReviewItem.query.filter_by(group_id=id, is_correct=False).count(),
                    "total_count": WordReviewItem.query.filter_by(group_id=id).count()
                }
            }
        )
    except Exception as e:
        return error_response(
            message="Failed to fetch group",
            error_code="NOT_FOUND",
            status_code=404
        )

@bp.route('/groups/<int:id>/words', methods=['GET'])
@validate_pagination()
def get_group_words(id, page=1, per_page=20):
    """Get paginated list of words in a group"""
    try:
        group = db.session.get(Group, id)
        pagination = group.words.paginate(page=page, per_page=per_page)
        
        return success_response(
            data={
                "words": [{
                    "id": w.id,
                    "nepali_word": w.nepali_word,
                    "romanized_nepali_word": w.romanized_nepali_word,
                    "english_word": w.english_word
                } for w in pagination.items]
            },
            meta=pagination_meta(pagination)
        )
    except Exception as e:
        return error_response(
            message="Failed to fetch group words",
            error_code="NOT_FOUND",
            status_code=404
        )
