from app import db
import json

class Word(db.Model):
    __tablename__ = 'words'
    
    id = db.Column(db.Integer, primary_key=True)
    nepali_word = db.Column(db.String(255), nullable=False)
    romanized_nepali_word = db.Column(db.String(255), nullable=False)
    english_word = db.Column(db.String(255), nullable=False)
    _part_of_speech = db.Column('part_of_speech', db.String(255), nullable=False)
    
    # No need to define the relationship here as it's defined in the Group model
    
    @property
    def part_of_speech(self):
        return json.loads(self._part_of_speech)
        
    @part_of_speech.setter
    def part_of_speech(self, value):
        self._part_of_speech = json.dumps(value)
