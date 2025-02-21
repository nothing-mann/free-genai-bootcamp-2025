from datetime import datetime
from app.models.base import BaseModel, db

class WordReviewItem(BaseModel):
    __tablename__ = 'word_review_items'

    word_id = db.Column(db.Integer, db.ForeignKey('words.id'), nullable=False)
    session_id = db.Column(db.Integer, db.ForeignKey('study_sessions.id'), nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey('groups.id'), nullable=False)
    is_correct = db.Column(db.Boolean, nullable=False)

    # Relationships
    word = db.relationship('Word', backref='reviews')
    group = db.relationship('Group', backref='word_reviews')

    def to_dict(self):
        return {
            'id': self.id,
            'word_id': self.word_id,
            'session_id': self.session_id,
            'group_id': self.group_id,
            'is_correct': self.is_correct,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
