from flask import Blueprint, jsonify, request
from app.models.word import Word
from app.models.group import Group
from app.models.study import StudyActivity, StudySession, WordReviewItem
from app.middleware import validate_pagination, validate_json_body
from app.schemas import StudyActivityCreate, WordReviewCreate
from app import db
from datetime import datetime

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
    return jsonify({
        "message": "Welcome to the dashboard!",
        "total_words": Word.query.count(),
        "total_groups": Group.query.count(),
        "total_study_sessions": StudySession.query.count()
    })

@bp.route('/words', methods=['GET'])
def get_words():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    pagination = Word.query.paginate(page=page, per_page=per_page)
    words = pagination.items
    
    return jsonify({
        "words": [{"id": w.id, 
                   "nepali_word": w.nepali_word,
                   "romanized_nepali_word": w.romanized_nepali_word,
                   "english_word": w.english_word,
                   "part_of_speech": w.part_of_speech} for w in words],
        "pagination": {
            "page": pagination.page,
            "per_page": pagination.per_page,
            "total_pages": pagination.pages,
            "has_next": pagination.has_next,
            "has_previous": pagination.has_prev
        }
    })

@bp.route('/dashboard/statistics', methods=['GET'])
def dashboard_statistics():
    total_words = Word.query.count()
    words_learned = WordReviewItem.query.distinct(WordReviewItem.word_id).count()
    sessions_completed = StudySession.query.filter(StudySession.ended_at.isnot(None)).count()
    
    # Calculate average score
    correct_reviews = WordReviewItem.query.filter_by(is_correct=True).count()
    total_reviews = WordReviewItem.query.count()
    avg_score = (correct_reviews / total_reviews * 100) if total_reviews > 0 else 0
    
    return jsonify({
        "words_learned": words_learned,
        "study_sessions_completed": sessions_completed,
        "average_score": round(avg_score, 2),
        "streak": 10  # TODO: Implement streak calculation
    })

@bp.route('/groups', methods=['GET'])
def get_groups():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    pagination = Group.query.paginate(page=page, per_page=per_page)
    groups = pagination.items
    
    return jsonify({
        "word_groups": [{
            "id": g.id,
            "name": g.name,
            "description": g.description,
            "total_words": g.total_words  # Using the new property
        } for g in groups],
        "pagination": {
            "page": pagination.page,
            "per_page": pagination.per_page,
            "total_pages": pagination.pages,
            "has_next": pagination.has_next,
            "has_previous": pagination.has_prev
        }
    })

@bp.route('/study-sessions/<int:session_id>/words/<int:word_id>/review', methods=['POST'])
def review_word(session_id, word_id):
    data = request.get_json()
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

@bp.route('/dashboard/last-session', methods=['GET'])
def last_session():
    last_session = StudySession.query.order_by(StudySession.started_at.desc()).first()
    if not last_session:
        return jsonify({"message": "No sessions found"}), 404
    
    correct_count = WordReviewItem.query.filter_by(
        session_id=last_session.id, 
        is_correct=True
    ).count()
    total_count = WordReviewItem.query.filter_by(session_id=last_session.id).count()
    score = (correct_count / total_count * 100) if total_count > 0 else 0
    
    return jsonify({
        "id": last_session.id,
        "group_id": last_session.group_id,
        "started_at": last_session.started_at.isoformat() + "Z",
        "ended_at": last_session.ended_at.isoformat() + "Z" if last_session.ended_at else None,
        "score": round(score, 2)
    })

@bp.route('/dashboard/study-progress', methods=['GET'])
def study_progress():
    total_available = Word.query.count()
    total_studied = WordReviewItem.query.distinct(WordReviewItem.word_id).count()
    
    return jsonify({
        "total_words_studied": total_studied,
        "total_available_words": total_available
    })

@bp.route('/study-activities', methods=['GET'])
def get_study_activities():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    pagination = StudyActivity.query.paginate(page=page, per_page=per_page)
    activities = pagination.items
    
    return jsonify({
        "study_activities": [{
            "id": a.id,
            "name": a.name,
            "description": a.description,
            "instructions": a.instructions,
            "thumbnail": a.thumbnail
        } for a in activities],
        "pagination": {
            "page": pagination.page,
            "per_page": pagination.per_page,
            "total_pages": pagination.pages,
            "has_next": pagination.has_next,
            "has_previous": pagination.has_prev
        }
    })

@bp.route('/study-activities/<int:id>', methods=['GET'])
def get_study_activity(id):
    activity = StudyActivity.query.get_or_404(id)
    return jsonify({
        "id": activity.id,
        "name": activity.name,
        "description": activity.description,
        "instructions": activity.instructions,
        "thumbnail": activity.thumbnail
    })

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
    data = request.get_json()
    session = StudySession(
        group_id=data['group_id'],
        study_activity_id=data['study_activity_id'],
        started_at=datetime.utcnow()
    )
    db.session.add(session)
    db.session.commit()
    
    return jsonify({
        "id": session.id,
        "message": "Study activity created successfully.",
        "group_id": session.group_id,
        "study_activity_id": session.study_activity_id
    })

@bp.route('/words/<int:id>', methods=['GET'])
def get_word(id):
    word = Word.query.get_or_404(id)
    return jsonify({
        "id": word.id,
        "nepali_word": word.nepali_word,
        "romanized_nepali_word": word.romanized_nepali_word,
        "english_word": word.english_word,
        "part_of_speech": word.part_of_speech,
        "word_groups": [{
            "id": g.id,
            "name": g.name,
            "description": g.description,
            "total_words": len(g.words)
        } for g in word.groups]
    })

@bp.route('/words/<int:id>/groups', methods=['GET'])
def get_word_groups(id):
    word = Word.query.get_or_404(id)
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    pagination = word.groups.paginate(page=page, per_page=per_page)
    
    return jsonify({
        "word_groups": [{
            "id": g.id,
            "name": g.name,
            "description": g.description,
            "total_words": len(g.words)
        } for g in pagination.items],
        "pagination": {
            "page": pagination.page,
            "per_page": pagination.per_page,
            "total_pages": pagination.pages,
            "has_next": pagination.has_next,
            "has_previous": pagination.has_prev
        }
    })

@bp.route('/groups/<int:id>', methods=['GET'])
def get_group(id):
    group = Group.query.get_or_404(id)
    return jsonify({
        "id": group.id,
        "name": group.name,
        "description": group.description,
        "statistics": group.statistics
    })

@bp.route('/groups/<int:id>/words', methods=['GET'])
def get_group_words(id):
    group = Group.query.get_or_404(id)
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    pagination = group.words.paginate(page=page, per_page=per_page)
    
    return jsonify({
        "words": [{
            "id": w.id,
            "nepali_word": w.nepali_word,
            "romanized_nepali_word": w.romanized_nepali_word,
            "english_word": w.english_word
        } for w in pagination.items],
        "pagination": {
            "page": pagination.page,
            "per_page": pagination.per_page,
            "total_pages": pagination.pages,
            "has_next": pagination.has_next,
            "has_previous": pagination.has_prev
        }
    })

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
        }), 500

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
        }), 500

@bp.route('/study-sessions', methods=['GET'])
@validate_pagination()
def get_study_sessions(pagination):
    pagination = StudySession.query.paginate(
        page=pagination.page, 
        per_page=pagination.per_page
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

@bp.route('/study-sessions/<int:id>', methods=['GET'])
def get_study_session(id):
    session = StudySession.query.get_or_404(id)
    return jsonify(format_study_session(session))

@bp.route('/study-sessions/<int:id>/words', methods=['GET'])
@validate_pagination()
def get_session_words(id, pagination):
    session = StudySession.query.get_or_404(id)
    
    # Get all word IDs reviewed in this session
    reviewed_word_ids = db.session.query(WordReviewItem.word_id)\
        .filter_by(session_id=id)\
        .distinct()
    
    # Get words with pagination
    pagination = Word.query\
        .filter(Word.id.in_(reviewed_word_ids))\
        .paginate(page=pagination.page, per_page=pagination.per_page)
    
    return jsonify({
        "words": [{
            "id": w.id,
            "nepali_word": w.nepali_word,
            "romanized_nepali_word": w.romanized_nepali_word,
            "english_word": w.english_word
        } for w in pagination.items],
        "pagination": {
            "page": pagination.page,
            "per_page": pagination.per_page,
            "total_pages": pagination.pages,
            "has_next": pagination.has_next,
            "has_previous": pagination.has_prev
        }
    })

@bp.route('/groups/<int:id>/study-sessions', methods=['GET'])
@validate_pagination()
def get_group_study_sessions(id, pagination):
    group = Group.query.get_or_404(id)
    
    pagination = StudySession.query\
        .filter_by(group_id=id)\
        .paginate(page=pagination.page, per_page=pagination.per_page)
    
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

@bp.route('/study-sessions/<int:id>/end', methods=['POST'])
def end_study_session(id):
    session = StudySession.query.get_or_404(id)
    
    if session.ended_at is not None:
        return jsonify({
            "error": "Session already ended"
        }), 400
        
    session.ended_at = datetime.utcnow()
    db.session.commit()
    
    return jsonify(format_study_session(session))

# Helper function for formatting study sessions
def format_study_session(session):
    correct_count = WordReviewItem.query.filter_by(
        session_id=session.id, 
        is_correct=True
    ).count()
    wrong_count = WordReviewItem.query.filter_by(
        session_id=session.id, 
        is_correct=False
    ).count()
    
    return {
        "id": session.id,
        "activity_name": session.activity.name,
        "group_name": session.group.name,
        "started_at": session.started_at.isoformat() + "Z",
        "ended_at": session.ended_at.isoformat() + "Z" if session.ended_at else None,
        "number_of_review_items": correct_count + wrong_count,
        "number_of_correct_review_items": correct_count,
        "number_of_wrong_review_items": wrong_count
    }
