import pytest
from datetime import datetime, UTC, timedelta
from app.models import Word, Group, StudyActivity, StudySession, WordReviewItem
from app import db

class TestWordModel:
    """Test Word model functionalities"""
    
    def test_word_creation(self):
        """Test basic word creation"""
        word = Word(
            nepali_word="नमस्ते",
            romanized_nepali_word="namaste",
            english_word="hello",
            part_of_speech=["greeting"]
        )
        assert word.nepali_word == "नमस्ते"
        assert word.created_at is not None

    def test_word_validation(self):
        """Test word validation rules"""
        with pytest.raises(ValueError):
            Word(
                nepali_word="",  # Empty word should raise error
                romanized_nepali_word="test",
                english_word="test",
                part_of_speech=["noun"]
            )

    def test_word_timestamps(self):
        """Test word timestamp behavior"""
        word = Word(
            nepali_word="नमस्ते",
            romanized_nepali_word="namaste",
            english_word="hello",
            part_of_speech=["greeting"]
        )
        assert word.created_at <= datetime.now(UTC)
        assert word.updated_at is None

class TestGroupModel:
    """Test Group model functionalities"""
    
    def test_group_creation(self, app):
        """Test group creation and properties"""
        with app.app_context():
            group = Group(name="Basic Words", description="Fundamental words")
            db.session.add(group)
            db.session.commit()
            
            assert group.name == "Basic Words"
            assert group.total_words == 0
            
    def test_group_word_relationship(self, app):
        """Test group-word relationships"""
        with app.app_context():
            group = Group(name="Test Group", description="Test")
            word = Word(
                nepali_word="test",
                romanized_nepali_word="test",
                english_word="test",
                part_of_speech=["noun"]
            )
            group.words.append(word)
            db.session.add(group)
            db.session.commit()
            
            assert group.total_words == 1
            assert group.word_list[0].nepali_word == "test"
            
    def test_group_statistics(self, app):
        """Test group statistics calculation"""
        with app.app_context():
            group = Group(name="Test Group", description="Test")
            db.session.add(group)
            db.session.commit()
            
            stats = group.statistics
            assert "total_words" in stats
            assert "total_reviews" in stats
            assert "correct_reviews" in stats

class TestStudyActivityModel:
    """Test StudyActivity model functionalities"""
    
    def test_study_activity_creation(self):
        """Test study activity creation and validation"""
        activity = StudyActivity(
            name="Flashcards",
            description="Practice with flashcards",
            instructions="Flip cards to learn",
            thumbnail="flashcards.jpg"
        )
        assert activity.name == "Flashcards"
        assert activity.created_at is not None

    def test_study_activity_validation(self):
        """Test study activity validation"""
        with pytest.raises(ValueError):
            StudyActivity(
                name="",  # Empty name should raise error
                description="test",
                instructions="test"
            )

class TestStudySessionModel:
    """Test StudySession model functionalities"""
    
    def test_study_session_lifecycle(self):
        """Test study session lifecycle"""
        session = StudySession(
            group_id=1,
            study_activity_id=1,
            started_at=datetime.now(UTC)
        )
        assert session.ended_at is None
        
        # End session
        session.ended_at = datetime.now(UTC)
        assert session.ended_at is not None
        assert session.ended_at > session.started_at

    def test_session_duration(self):
        """Test session duration calculation"""
        start_time = datetime.now(UTC)
        session = StudySession(
            group_id=1,
            study_activity_id=1,
            started_at=start_time
        )
        session.ended_at = start_time + timedelta(minutes=30)
        
        assert session.duration.total_seconds() == 1800  # 30 minutes

class TestWordReviewModel:
    """Test WordReview model functionalities"""
    
    def test_word_review_creation(self):
        """Test word review creation"""
        review = WordReviewItem(
            word_id=1,
            session_id=1,
            group_id=1,
            is_correct=True
        )
        assert review.is_correct is True
        assert review.created_at is not None

    def test_word_review_statistics(self):
        """Test word review statistics calculation"""
        reviews = [
            WordReviewItem(word_id=1, session_id=1, group_id=1, is_correct=True),
            WordReviewItem(word_id=1, session_id=1, group_id=1, is_correct=False),
            WordReviewItem(word_id=1, session_id=1, group_id=1, is_correct=True)
        ]
        
        correct_count = sum(1 for r in reviews if r.is_correct)
        assert correct_count == 2
        assert len(reviews) == 3

class TestModelRelationships:
    """Test relationships between models"""
    
    def test_model_relationships(self):
        """Test relationships between models"""
        # Create test data
        group = Group(name="Test Group", description="Test")
        word = Word(
            nepali_word="test",
            romanized_nepali_word="test",
            english_word="test",
            part_of_speech=["noun"]
        )
        activity = StudyActivity(
            name="Test Activity",
            description="Test",
            instructions="Test"
        )
        
        # Create session
        session = StudySession(
            group_id=1,
            study_activity_id=1,
            started_at=datetime.now(UTC)
        )
        
        # Create review
        review = WordReviewItem(
            word_id=word.id,
            session_id=session.id,
            group_id=group.id,
            is_correct=True
        )
        
        # Test relationships
        assert review.session_id == session.id
        assert review.word_id == word.id
        assert review.group_id == group.id
