from app.models.base import BaseModel, db
from sqlalchemy import func
from app.models.word_review import WordReviewItem
from datetime import datetime, UTC

# Define the association table
words_groups = db.Table('words_groups',
    db.Column('word_id', db.Integer, db.ForeignKey('words.id'), primary_key=True),
    db.Column('group_id', db.Integer, db.ForeignKey('groups.id'), primary_key=True)
)

class Group(BaseModel):
    __tablename__ = 'groups'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=lambda: datetime.now(UTC))
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=lambda: datetime.now(UTC))
    
    # Define the many-to-many relationship with back_populates
    words = db.relationship('Word', 
                          secondary=words_groups,
                          back_populates='groups',
                          lazy='dynamic')

    @property
    def total_words(self):
        return self.words.count()

    @property
    def word_list(self):
        """For tests that need a list"""
        return self.words.all()

    @property
    def statistics(self):
        """Calculate group statistics"""
        correct_reviews = db.session.query(func.count(WordReviewItem.id))\
            .filter(WordReviewItem.group_id == self.id)\
            .filter(WordReviewItem.is_correct == True)\
            .scalar()

        wrong_reviews = db.session.query(func.count(WordReviewItem.id))\
            .filter(WordReviewItem.group_id == self.id)\
            .filter(WordReviewItem.is_correct == False)\
            .scalar()

        total_reviews = db.session.query(func.count(WordReviewItem.id))\
            .filter(WordReviewItem.group_id == self.id)\
            .scalar()

        return {
            "correct_count": correct_reviews or 0,
            "wrong_count": wrong_reviews or 0,
            "total_count": total_reviews or 0
        }

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'total_words': self.total_words
        }
