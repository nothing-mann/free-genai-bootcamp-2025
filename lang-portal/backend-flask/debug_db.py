import os
from app import create_app, db
from app.models import Word, Group, StudyActivity
from config import Config

def check_database_status():
    """Debug database connectivity and content"""
    app = create_app()
    
    with app.app_context():
        print("\n=== Database Configuration ===")
        print(f"Database Path: {Config.DATABASE_PATH}")
        print(f"Database URI: {Config.SQLALCHEMY_DATABASE_URI}")
        print(f"Database exists: {os.path.exists(Config.DATABASE_PATH)}")
        if os.path.exists(Config.DATABASE_PATH):
            print(f"Database size: {os.path.getsize(Config.DATABASE_PATH)} bytes")
            print(f"Database permissions: {oct(os.stat(Config.DATABASE_PATH).st_mode)[-3:]}")
        
        print("\n=== Directory Structure ===")
        print(f"Base Directory: {Config.BASE_DIR}")
        print(f"Migrations Directory exists: {os.path.exists(Config.MIGRATIONS_DIR)}")
        print(f"Seeds Directory exists: {os.path.exists(Config.SEEDS_DIR)}")
        
        print("\n=== Database Content ===")
        try:
            words_count = Word.query.count()
            groups_count = Group.query.count()
            activities_count = StudyActivity.query.count()
            
            print(f"Words in database: {words_count}")
            print(f"Groups in database: {groups_count}")
            print(f"Activities in database: {activities_count}")
            
            if words_count > 0:
                print("\nSample Words:")
                for word in Word.query.limit(3).all():
                    print(f"- {word.nepali_word} ({word.english_word})")
            
            if groups_count > 0:
                print("\nSample Groups:")
                for group in Group.query.limit(3).all():
                    print(f"- {group.name} ({len(group.words.all())} words)")
                    
        except Exception as e:
            print(f"\nError accessing database: {str(e)}")

if __name__ == "__main__":
    check_database_status()
