import os
import sys
import pytest
from datetime import datetime, UTC
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session, Session

# Add the project root directory to Python path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, project_root)

from app import create_app, db
from app.models import Word, Group, StudyActivity, StudySession, WordReviewItem
from config import Config
from tests.fixtures.test_data import SAMPLE_WORDS, SAMPLE_GROUPS, SAMPLE_ACTIVITIES

class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    WTF_CSRF_ENABLED = False

@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    app = create_app(TestConfig)
    return app

@pytest.fixture(scope='function')
def session(app):
    """Create a new database session for each test."""
    with app.app_context():
        # Create tables
        db.create_all()
        
        # Create a new session
        session = db.session.registry()
        
        yield session
        
        # Cleanup
        session.close()
        db.drop_all()

@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()

@pytest.fixture
def sample_words(session):
    """Create sample words."""
    words = []
    for word_data in SAMPLE_WORDS:
        word = Word(
            nepali_word=word_data["nepali_word"],
            romanized_nepali_word=word_data["romanized_nepali_word"],
            english_word=word_data["english_word"],
            part_of_speech=word_data["part_of_speech"]
        )
        session.add(word)
        words.append(word)
    session.commit()
    return words

@pytest.fixture
def sample_groups(session):
    """Create sample groups."""
    groups = []
    for group_data in SAMPLE_GROUPS:
        group = Group(
            name=group_data["name"],
            description=group_data["description"]
        )
        session.add(group)
        groups.append(group)
    session.commit()
    return groups

@pytest.fixture
def sample_activities(session):
    """Create sample study activities."""
    activities = []
    for activity_data in SAMPLE_ACTIVITIES:
        activity = StudyActivity(
            name=activity_data["name"],
            description=activity_data["description"],
            instructions=activity_data["instructions"],
            thumbnail=activity_data["thumbnail"]
        )
        session.add(activity)
        activities.append(activity)
    session.commit()
    return activities

@pytest.fixture
def sample_study_session(session, sample_groups, sample_activities):
    """Create a sample study session."""
    session_obj = StudySession(
        group_id=sample_groups[0].id,
        study_activity_id=sample_activities[0].id,
        started_at=datetime.now(UTC)
    )
    session.add(session_obj)
    session.commit()
    return session_obj

@pytest.fixture
def sample_word_reviews(session, sample_words, sample_study_session, sample_groups):
    """Create sample word reviews."""
    reviews = []
    for word in sample_words:
        review = WordReviewItem(
            word_id=word.id,
            session_id=sample_study_session.id,
            group_id=sample_groups[0].id,
            is_correct=True
        )
        session.add(review)
        reviews.append(review)
    session.commit()
    return reviews
