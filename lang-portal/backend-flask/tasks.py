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
    """Seed database with sample data from seed files"""
    app = create_app()
    with app.app_context():
        try:
            print("Starting database seeding...")
            
            # Load seed data from JSON files
            seeds_dir = "db/seeds"
            
            with open(os.path.join(seeds_dir, 'activities.json')) as f:
                activities_data = json.load(f)
            with open(os.path.join(seeds_dir, 'groups.json')) as f:
                groups_data = json.load(f)
            with open(os.path.join(seeds_dir, 'words.json')) as f:
                words_data = json.load(f)
            
            # Create study activities
            activities = [StudyActivity(**data) for data in activities_data]
            
            # Create groups
            groups = [Group(**data) for data in groups_data]
            
            # Create words
            words = [Word(**data) for data in words_data]
            
            # Add initial items
            for item in [*activities, *groups, *words]:
                db.session.add(item)
            db.session.flush()
            
            # Create relationships from words_groups.json
            with open(os.path.join(seeds_dir, 'words_groups.json')) as f:
                words_groups_data = json.load(f)
                
            for relation in words_groups_data:
                word = next(w for w in words if w.nepali_word == relation['nepali_word'])
                group = next(g for g in groups if g.name == relation['group_name'])
                group.words.append(word)
            
            # Create study sessions from sessions.json
            with open(os.path.join(seeds_dir, 'sessions.json')) as f:
                sessions_data = json.load(f)
            
            for session_data in sessions_data:
                group = next(g for g in groups if g.name == session_data['group_name'])
                activity = next(a for a in activities if a.name == session_data['activity_name'])
                
                session = StudySession(
                    group_id=group.id,
                    study_activity_id=activity.id,
                    started_at=datetime.fromisoformat(session_data['started_at']),
                    ended_at=datetime.fromisoformat(session_data['ended_at'])
                )
                db.session.add(session)
                db.session.flush()
                
                # Create word reviews
                for review_data in session_data['reviews']:
                    word = next(w for w in words if w.nepali_word == review_data['nepali_word'])
                    review = WordReviewItem(
                        word_id=word.id,
                        session_id=session.id,
                        group_id=group.id,
                        is_correct=review_data['is_correct'],
                        created_at=datetime.fromisoformat(review_data['created_at'])
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
