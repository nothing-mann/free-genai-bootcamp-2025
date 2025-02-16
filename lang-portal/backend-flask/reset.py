import os
import shutil
from config import Config

def reset_database():
    """Reset everything and start fresh"""
    # Remove database file if it exists
    if os.path.exists(Config.DATABASE_PATH):
        os.remove(Config.DATABASE_PATH)
        print(f"Removed existing database: {Config.DATABASE_PATH}")
    
    # Recreate directories
    os.makedirs(Config.MIGRATIONS_DIR, exist_ok=True)
    os.makedirs(Config.SEEDS_DIR, exist_ok=True)
    print("Recreated directories")
    
    # Set proper permissions
    os.chmod(Config.BASE_DIR, 0o755)
    print("Set proper permissions")
    
    print("\nSystem is reset and ready for fresh initialization")
    print("\nNow run these commands in order:")
    print("1. python manage.py init-db")
    print("2. invoke migrate")
    print("3. invoke seed-db")

if __name__ == "__main__":
    reset_database()
