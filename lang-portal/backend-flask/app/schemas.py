from pydantic import BaseModel, Field, field_validator, ConfigDict
from typing import List

class WordBase(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid",
        from_attributes=True
    )
    
    nepali_word: str = Field(..., min_length=1)
    romanized_nepali_word: str = Field(..., min_length=1)
    english_word: str = Field(..., min_length=1)
    part_of_speech: List[str]
    
    @field_validator('part_of_speech')
    def validate_part_of_speech(cls, v):
        valid_types = ['noun', 'verb', 'adjective', 'adverb', 'pronoun', 
                      'greeting', 'expression', 'phrase', 'question', 'response', 'number']
        for pos in v:
            if pos not in valid_types:
                raise ValueError(f'Invalid part of speech: {pos}')
        return v

class StudyActivityCreate(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        from_attributes=True,
        extra="forbid"
    )
    
    group_id: int = Field(..., gt=0)
    study_activity_id: int = Field(..., gt=0)

class WordReviewCreate(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid",
        strict=True,
        from_attributes=True
    )
    
    is_correct: bool = Field(...)

class PaginationParams(BaseModel):
    model_config = ConfigDict(
        str_strip_whitespace=True,
        from_attributes=True,
        extra="forbid"
    )
    
    page: int = Field(1, gt=0)
    per_page: int = Field(20, gt=0, le=100)