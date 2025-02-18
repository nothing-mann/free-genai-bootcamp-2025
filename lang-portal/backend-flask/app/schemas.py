from pydantic import BaseModel, field_validator
from typing import List, Optional
from datetime import datetime

class WordBase(BaseModel):
    nepali_word: str
    romanized_nepali_word: str
    english_word: str
    part_of_speech: List[str]

    @field_validator('nepali_word')
    def validate_nepali_word(cls, v):
        if not v.strip():
            raise ValueError('Nepali word cannot be empty')
        return v

    @field_validator('part_of_speech')
    def validate_part_of_speech(cls, v):
        valid_types = ['noun', 'verb', 'adjective', 'adverb', 'pronoun', 
                      'greeting', 'expression', 'phrase', 'question', 'response', 'number']
        for pos in v:
            if pos not in valid_types:
                raise ValueError(f'Invalid part of speech: {pos}')
        return v

class StudyActivityCreate(BaseModel):
    group_id: int
    study_activity_id: int

class WordReviewCreate(BaseModel):
    is_correct: bool

    @field_validator('is_correct')
    def validate_is_correct(cls, v):
        if not isinstance(v, bool):
            raise ValueError('is_correct must be a boolean value')
        return v

class PaginationParams(BaseModel):
    page: int = 1
    per_page: int = 20

    @field_validator('page')
    def validate_page(cls, v):
        if v < 1:
            raise ValueError('Page number must be greater than 0')
        return v

    @field_validator('per_page')
    def validate_per_page(cls, v):
        if v < 1 or v > 100:
            raise ValueError('Items per page must be between 1 and 100')
        return v
