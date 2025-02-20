from sqlalchemy import func
from app.models import Word, WordReviewItem, StudySession

def get_study_progress():
    """Calculate study progress statistics"""
    total_studied = WordReviewItem.query.with_entities(func.count(func.distinct(WordReviewItem.word_id))).scalar() or 0
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
    
    return {
        "total_reviews": total_reviews,
        "average_score": round((correct_reviews / total_reviews * 100) if total_reviews > 0 else 0, 2),
        "words_learned": WordReviewItem.query.distinct(WordReviewItem.word_id).count(),
        "study_sessions_completed": StudySession.query.filter(StudySession.ended_at.isnot(None)).count(),
        "streak": calculate_streak()
    }

def calculate_streak():
    """Calculate current learning streak"""
    return 0  # Placeholder
