from app.models.base import BaseModel, db
from sqlalchemy import func
from app.models.word_review import WordReviewItem

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
        return {
            "total_words": self.words.count(),
            "correct_count": self.word_reviews.filter_by(is_correct=True).count(),
            "wrong_count": self.word_reviews.filter_by(is_correct=False).count(),
            "total_count": self.word_reviews.count()
        }
