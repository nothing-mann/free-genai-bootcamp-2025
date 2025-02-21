import os
import json
import sqlite3
from datetime import datetime, UTC, timedelta
from invoke import task
from app import create_app
from app.models.base import db
from app.models import Word, Group, StudyActivity, StudySession, WordReviewItem

DB_PATH = "words.db"

@task
def init_db(ctx):
    """Initialize the database"""
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
    conn = sqlite3.connect(DB_PATH)
    conn.close()
    print(f"Created empty database at {DB_PATH}")

@task
def migrate(ctx):
    """Run database migrations"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    migrations_dir = "db/migrations"
    for filename in sorted(os.listdir(migrations_dir)):
        if filename.endswith('.sql'):
            with open(os.path.join(migrations_dir, filename)) as f:
                print(f"Running migration: {filename}")
                cursor.executescript(f.read())
    
    conn.commit()
    conn.close()

@task
def seed_db(c):
    """Seed database with sample data"""
    app = create_app()
    with app.app_context():
        try:
            print("Starting database seeding...")
            
            # Create study activities
            activities = [
                StudyActivity(
                    name="Flashcards",
                    description="Practice with flashcards",
                    instructions="Flip cards to learn words",
                    thumbnail="flashcards.jpg"
                ),
                StudyActivity(
                    name="Word Match",
                    description="Match words with their meanings",
                    instructions="Connect matching pairs",
                    thumbnail="matching.jpg"
                )
            ]
            
            # Create groups
            groups = [
                Group(
                    name="Basic Phrases",
                    description="Essential everyday phrases"
                ),
                Group(
                    name="Numbers",
                    description="Counting and numbers"
                )
            ]
            
            # Create words with properly formatted part_of_speech
            words = [
                Word(
                    nepali_word="नमस्ते",
                    romanized_nepali_word="namaste",
                    english_word="hello",
                    part_of_speech=json.dumps(['greeting'])  # Convert list to JSON string
                ),
                Word(
                    nepali_word="धन्यवाद",
                    romanized_nepali_word="dhanyavaad",
                    english_word="thank you",
                    part_of_speech=json.dumps(['phrase'])    # Convert list to JSON string
                )
            ]
            
            # Add initial items
            for item in [*activities, *groups, *words]:
                db.session.add(item)
            db.session.flush()
            
            # Create relationships
            groups[0].words.extend(words)
            
            # Create study session
            now = datetime.now(UTC)
            session = StudySession(
                group_id=groups[0].id,
                study_activity_id=activities[0].id,
                started_at=now - timedelta(hours=1),
                ended_at=now
            )
            db.session.add(session)
            db.session.flush()
            
            # Create word reviews
            for word in words:
                review = WordReviewItem(
                    word_id=word.id,
                    session_id=session.id,
                    group_id=groups[0].id,
                    is_correct=True,
                    created_at=now
                )
                db.session.add(review)
            
            db.session.commit()
            print("Database seeded successfully!")
            
        except Exception as e:
            db.session.rollback()
            print(f"Error seeding database: {str(e)}")
            raise

@task
def install(c):
    """Install Python dependencies"""
    c.run("pip install -r requirements.txt")

@task
def run(c, port=8080):
    """Run the Flask development server"""
    c.run(f"flask run --port {port}")

@task
def test(c):
    """Run tests"""
    c.run("pytest tests/ -v")

@task
def coverage(c):
    """Run tests with coverage report"""
    c.run("pytest tests/ -v --cov=app --cov-report=term-missing")

@task
def clean(c):
    """Remove Python cache files"""
    c.run("find . -type d -name __pycache__ -exec rm -r {} +")
    c.run("find . -type f -name '*.pyc' -delete")

@task
def reset_db(c):
    """Reset the database - drops and recreates all tables"""
    from app import create_app
    from app.extensions import db
    
    app = create_app()
    
    with app.app_context():
        try:
            print("Dropping all tables...")
            db.drop_all()
            print("Creating all tables...")
            db.create_all()
            print("Database reset completed successfully!")
        except Exception as e:
            print(f"Error resetting database: {str(e)}")
            raise

@task
def lint(c):
    """Check code style"""
    c.run("flake8 app tests")
