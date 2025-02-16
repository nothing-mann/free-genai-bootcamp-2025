from app import db

# Define the association table first
words_groups = db.Table('words_groups',
    db.Column('word_id', db.Integer, db.ForeignKey('words.id'), primary_key=True),
    db.Column('group_id', db.Integer, db.ForeignKey('groups.id'), primary_key=True)
)

class Group(db.Model):
    __tablename__ = 'groups'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    
    # Define the relationship using the association table
    words = db.relationship('Word', 
                          secondary=words_groups,
                          lazy='dynamic',
                          backref=db.backref('groups', lazy='dynamic'))
    
    study_sessions = db.relationship('StudySession', backref='group', lazy=True)
    
    @property
    def statistics(self):
        from app.models.study import WordReviewItem
        correct = WordReviewItem.query.filter_by(group_id=self.id, is_correct=True).count()
        wrong = WordReviewItem.query.filter_by(group_id=self.id, is_correct=False).count()
        return {
            "correct_count": correct,
            "wrong_count": wrong,
            "total_count": correct + wrong
        }
    
    @property
    def total_words(self):
        return self.words.count()
