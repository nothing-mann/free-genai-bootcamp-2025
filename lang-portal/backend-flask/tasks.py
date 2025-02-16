import os
import json
import sqlite3
from invoke import task
from app import create_app, db
from app.models import Word, Group, StudyActivity, StudySession

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
def seed_db(ctx):
    """Seed the database with initial data"""
    app = create_app()
    
    with app.app_context():
        try:
            print(f"Starting database seeding...")
            print(f"Looking for seed files in: {app.config['SEEDS_DIR']}")
            
            # First seed study activities
            study_activities_file = os.path.join(app.config['SEEDS_DIR'], 'study_activities.json')
            if os.path.exists(study_activities_file):
                with open(study_activities_file) as f:
                    print(f"Processing study activities...")
                    activities_data = json.load(f)
                    for activity in activities_data['activities']:
                        study_activity = StudyActivity(
                            name=activity['name'],
                            description=activity['description'],
                            instructions=activity['instructions'],
                            thumbnail=activity['thumbnail']
                        )
                        db.session.add(study_activity)
                    db.session.commit()
                    print("Study activities seeded successfully")

            # Then seed words and groups
            for filename in sorted(os.listdir(app.config['SEEDS_DIR'])):
                if not filename.endswith('.json') or filename == 'study_activities.json':
                    continue
                    
                with open(os.path.join(app.config['SEEDS_DIR'], filename)) as f:
                    print(f"\nProcessing seed file: {filename}")
                    data = json.load(f)
                    
                    # Create group
                    group = Group(
                        name=data['group_name'],
                        description=data['group_description']
                    )
                    db.session.add(group)
                    db.session.flush()  # Get the group ID
                    
                    # Process words
                    for word_data in data['words']:
                        word = Word(
                            nepali_word=word_data['nepali'],
                            romanized_nepali_word=word_data['romanized_nepali'],
                            english_word=word_data['english'],
                            part_of_speech=word_data['part_of_speech']
                        )
                        db.session.add(word)
                        group.words.append(word)
                    
                    db.session.commit()
                    print(f"Processed {len(data['words'])} words for group: {group.name}")
            
            # Print summary
            word_count = Word.query.count()
            group_count = Group.query.count()
            activity_count = StudyActivity.query.count()
            
            print(f"\nSeeding Summary:")
            print(f"- Words created: {word_count}")
            print(f"- Groups created: {group_count}")
            print(f"- Activities created: {activity_count}")
            
            print("\nDatabase seeding completed successfully!")
            
        except Exception as e:
            db.session.rollback()
            print(f"Error seeding database: {str(e)}")
            raise
