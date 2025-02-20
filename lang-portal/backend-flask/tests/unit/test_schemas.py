import pytest
from pydantic import ValidationError
from app.schemas import WordBase, StudyActivityCreate, WordReviewCreate, PaginationParams

class TestWordSchema:
    """Test Word schema validation"""
    def test_valid_word(self):
        data = {
            "nepali_word": "नमस्ते",
            "romanized_nepali_word": "namaste",
            "english_word": "hello",
            "part_of_speech": ["greeting"]
        }
        word = WordBase.model_validate(data)
        assert word.nepali_word == "नमस्ते"

    def test_invalid_word(self):
        with pytest.raises(ValidationError):
            WordBase.model_validate({
                "nepali_word": "",
                "romanized_nepali_word": "test",
                "english_word": "test",
                "part_of_speech": ["invalid"]
            })

class TestStudyActivitySchema:
    """Test StudyActivity schema validation"""
    def test_valid_activity(self):
        data = {
            "group_id": 1,
            "study_activity_id": 1
        }
        activity = StudyActivityCreate.model_validate(data)
        assert activity.group_id == 1

    def test_invalid_activity(self):
        with pytest.raises(ValidationError):
            StudyActivityCreate.model_validate({
                "group_id": -1,
                "study_activity_id": 0
            })

class TestWordReviewSchema:
    """Test WordReview schema validation"""
    def test_valid_review(self):
        data = {"is_correct": True}
        review = WordReviewCreate.model_validate(data)
        assert review.is_correct is True

    def test_invalid_review(self):
        with pytest.raises(ValidationError):
            WordReviewCreate.model_validate({"is_correct": "yes"})

class TestPaginationSchema:
    """Test Pagination schema validation"""
    def test_valid_pagination(self):
        data = {"page": 1, "per_page": 20}
        params = PaginationParams.model_validate(data)
        assert params.page == 1
        assert params.per_page == 20

    def test_invalid_pagination(self):
        with pytest.raises(ValidationError):
            PaginationParams.model_validate({
                "page": 0,
                "per_page": 1000
            })
