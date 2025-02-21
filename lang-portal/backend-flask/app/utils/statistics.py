from sqlalchemy import func
from app.models import Word, WordReviewItem, StudySession
from app import db

def get_study_progress():
    """Calculate study progress statistics"""
    total_studied = db.session.query(WordReviewItem.word_id).group_by(WordReviewItem.word_id).count()
    total_words = Word.query.count()
    
    return {
        "progress": {
            "total_words_studied": total_studied,
            "total_available_words": total_words,
            "completion_percentage": round((total_studied / total_words * 100) if total_words > 0 else 0, 2)
        }
    }

def get_dashboard_statistics():
    """Get dashboard statistics"""
    total_reviews = WordReviewItem.query.count()
    correct_reviews = WordReviewItem.query.filter_by(is_correct=True).count()
    words_learned = db.session.query(WordReviewItem.word_id).group_by(WordReviewItem.word_id).count()
    
    return {
        "total_reviews": total_reviews,
        "average_score": round((correct_reviews / total_reviews * 100) if total_reviews > 0 else 0, 2),
        "words_learned": words_learned,
        "study_sessions_completed": StudySession.query.filter(StudySession.ended_at.isnot(None)).count(),
        "streak": calculate_streak()
    }

def calculate_streak():
    """Calculate current learning streak"""
    return 0  # Placeholder
