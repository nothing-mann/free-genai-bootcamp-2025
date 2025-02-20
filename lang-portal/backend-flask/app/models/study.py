from .base import BaseModel, db
from datetime import datetime, UTC

class StudyActivity(BaseModel):
    __tablename__ = 'study_activities'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    instructions = db.Column(db.Text, nullable=False)
    thumbnail = db.Column(db.String(255), nullable=False)
    sessions = db.relationship('StudySession', backref='activity', lazy=True)
    
    def __init__(self, **kwargs):
        if not kwargs.get('name'):
            raise ValueError('Activity name cannot be empty')
        super().__init__(**kwargs)

class StudySession(BaseModel):
    __tablename__ = 'study_sessions'
    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer, db.ForeignKey('groups.id'), nullable=False)
    study_activity_id = db.Column(db.Integer, db.ForeignKey('study_activities.id'), nullable=False)
    started_at = db.Column(db.DateTime(timezone=True), nullable=False, default=lambda: datetime.now(UTC))
    ended_at = db.Column(db.DateTime(timezone=True))
    reviews = db.relationship('WordReviewItem', backref='session', lazy=True)

    @property
    def duration(self):
        if not self.ended_at:
            return None
        return self.ended_at - self.started_at

class WordReviewItem(BaseModel):
    __tablename__ = 'word_review_items'
    id = db.Column(db.Integer, primary_key=True)
    word_id = db.Column(db.Integer, db.ForeignKey('words.id'), nullable=False)
    session_id = db.Column(db.Integer, db.ForeignKey('study_sessions.id'), nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey('groups.id'), nullable=False)
    is_correct = db.Column(db.Boolean, nullable=False)
