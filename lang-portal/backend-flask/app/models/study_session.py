from datetime import datetime
from app.extensions import db
from app.models.base import BaseModel

class StudySession(BaseModel):
    __tablename__ = 'study_sessions'

    group_id = db.Column(db.Integer, db.ForeignKey('groups.id'), nullable=True)
    study_activity_id = db.Column(db.Integer, db.ForeignKey('study_activities.id'), nullable=True)
    started_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    ended_at = db.Column(db.DateTime)

    # Relationships
    group = db.relationship('Group', backref='study_sessions')
    activity = db.relationship('StudyActivity', backref='study_sessions')
    word_reviews = db.relationship('WordReviewItem', backref='session')

    def to_dict(self):
        return {
            'id': self.id,
            'group_id': self.group_id,
            'study_activity_id': self.study_activity_id,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'ended_at': self.ended_at.isoformat() if self.ended_at else None,
            'group_name': self.group.name if self.group else None,
            'activity_name': self.activity.name if self.activity else None
        }
