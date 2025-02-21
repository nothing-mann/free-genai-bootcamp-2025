import os
import sys

class Config:
    # Get absolute path of the backend-flask directory
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    
    # Database configuration
    DATABASE_NAME = 'words.db'
    DATABASE_PATH = os.path.join(BASE_DIR, DATABASE_NAME)
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or f'sqlite:///{DATABASE_PATH}'
    
    # Ensure these directories exist
    MIGRATIONS_DIR = os.path.join(BASE_DIR, 'db', 'migrations')
    SEEDS_DIR = os.path.join(BASE_DIR, 'db', 'seeds')
    
    # Create directories if they don't exist
    os.makedirs(MIGRATIONS_DIR, exist_ok=True)
    os.makedirs(SEEDS_DIR, exist_ok=True)
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # CORS settings
    CORS_ORIGINS = [
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:3000",  # React development server
        "http://127.0.0.1:3000"
    ]
    CORS_METHODS = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    CORS_ALLOW_HEADERS = ["Content-Type"]

    CORS_HEADERS = 'Content-Type'
    PROPAGATE_EXCEPTIONS = True
    
    PORT = 8080
    HOST = '0.0.0.0'
    
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev'
    JSON_SORT_KEYS = False
