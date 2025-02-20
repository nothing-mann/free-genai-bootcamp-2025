from .base import BaseModel, db
from sqlalchemy import func
from app.models.study import WordReviewItem

words_groups = db.Table('words_groups',
    db.Column('word_id', db.Integer, db.ForeignKey('words.id'), primary_key=True),
    db.Column('group_id', db.Integer, db.ForeignKey('groups.id'), primary_key=True)
)

class Group(BaseModel):
    __tablename__ = 'groups'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    words = db.relationship(
        'Word',
        secondary='words_groups',
        lazy='dynamic',
        backref=db.backref('groups', lazy='dynamic')
    )

    @property
    def total_words(self):
        return self.words.count()

    @property
    def word_list(self):
        """For tests that need a list"""
        return self.words.all()

    @property
    def statistics(self):
        """Get group statistics with proper error handling"""
        try:
            return {
                "total_words": self.total_words,
                "total_reviews": WordReviewItem.query.filter_by(group_id=self.id).count(),
                "correct_reviews": WordReviewItem.query.filter_by(group_id=self.id, is_correct=True).count()
            }
        except Exception:
            return {
                "total_words": 0,
                "total_reviews": 0,
                "correct_reviews": 0
            }
