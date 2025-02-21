import json
from app.models.base import BaseModel, db

class Word(BaseModel):
    __tablename__ = 'words'

    id = db.Column(db.Integer, primary_key=True)
    nepali_word = db.Column(db.String(100), nullable=False)
    romanized_nepali_word = db.Column(db.String(100), nullable=False)
    english_word = db.Column(db.String(100), nullable=False)
    part_of_speech = db.Column(db.String(255), nullable=False)

    # Define the many-to-many relationship with back_populates
    groups = db.relationship('Group', 
                           secondary='words_groups',
                           back_populates='words',
                           lazy='dynamic')

    @property
    def part_of_speech_list(self):
        """Get part_of_speech as a list"""
        return json.loads(self.part_of_speech) if self.part_of_speech else []

    @part_of_speech_list.setter
    def part_of_speech_list(self, value):
        """Set part_of_speech from a list"""
        self.part_of_speech = json.dumps(value) if value else '[]'

    def __init__(self, **kwargs):
        if 'part_of_speech' in kwargs and isinstance(kwargs['part_of_speech'], list):
            kwargs['part_of_speech'] = json.dumps(kwargs['part_of_speech'])
        super().__init__(**kwargs)

    def to_dict(self):
        return {
            'id': self.id,
            'nepali_word': self.nepali_word,
            'romanized_nepali_word': self.romanized_nepali_word,
            'english_word': self.english_word,
            'part_of_speech': self.part_of_speech_list,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
