from datetime import datetime, UTC
from app import db  # Import db from your Flask application instance
from sqlalchemy import func

# ...existing code...

class Word(db.Model):
    # ...existing code...
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not kwargs.get('nepali_word'):
            raise ValueError("Nepali word cannot be empty")
        if not kwargs.get('romanized_nepali_word'):
            raise ValueError("Romanized Nepali word cannot be empty")
        if not kwargs.get('english_word'):
            raise ValueError("English word cannot be empty")

class StudyActivity(db.Model):
    __tablename__ = 'study_activities'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    instructions = db.Column(db.Text, nullable=False)
    thumbnail = db.Column(db.String(255))
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=lambda: datetime.now(UTC))
    updated_at = db.Column(db.DateTime(timezone=True))

    def __init__(self, name, description, instructions, thumbnail=None):
        if not name:
            raise ValueError("Name cannot be empty")
        self.name = name
        self.description = description
        self.instructions = instructions
        self.thumbnail = thumbnail
        self.created_at = datetime.now(UTC)
        self.updated_at = None

class StudySession(db.Model):
    # ...existing code...
    
    @property
    def duration(self):
        """Calculate session duration"""
        if self.ended_at and self.started_at:
            return self.ended_at - self.started_at
        return None

class Group(db.Model):
    __tablename__ = 'groups'
    # ...existing code...

    # Update the relationship to use dynamic loading
    words = db.relationship('Word', secondary='words_groups', lazy='dynamic',
                          backref=db.backref('groups', lazy='dynamic'))
    word_reviews = db.relationship('WordReviewItem', lazy='dynamic')
    
    @property
    def statistics(self):
        """Calculate group statistics using the proper relationship query"""
        return {
            "total_words": self.words.count(),
            "correct_count": self.word_reviews.filter_by(is_correct=True).count(),
            "wrong_count": self.word_reviews.filter_by(is_correct=False).count(),
            "total_count": self.word_reviews.count()
        }
