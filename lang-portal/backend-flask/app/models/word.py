from .base import BaseModel, db
import json

class Word(BaseModel):
    __tablename__ = 'words'
    
    id = db.Column(db.Integer, primary_key=True)
    nepali_word = db.Column(db.String(255), nullable=False)
    romanized_nepali_word = db.Column(db.String(255), nullable=False)
    english_word = db.Column(db.String(255), nullable=False)
    _part_of_speech = db.Column('part_of_speech', db.Text, nullable=False)

    @property
    def part_of_speech(self):
        if isinstance(self._part_of_speech, list):
            return self._part_of_speech
        return json.loads(self._part_of_speech)
        
    @part_of_speech.setter
    def part_of_speech(self, value):
        if isinstance(value, str):
            self._part_of_speech = value
        else:
            self._part_of_speech = json.dumps(value)

    def __init__(self, **kwargs):
        if not kwargs.get('nepali_word'):
            raise ValueError('Nepali word cannot be empty')
        if not kwargs.get('part_of_speech'):
            raise ValueError('Part of speech is required')
        super().__init__(**kwargs)
