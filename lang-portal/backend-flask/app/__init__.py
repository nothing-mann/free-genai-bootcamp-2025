from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from config import Config
from app.extensions import db

def create_app(config_class=Config):
    """Create and configure the Flask application"""
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    migrate = Migrate(app, db)  # Add migration support
    CORS(app)
    
    # Register blueprints
    with app.app_context():
        from app.routes.api import bp as api_bp
        from app.routes.study_sessions import bp as study_sessions_bp
        
        app.register_blueprint(api_bp)
        app.register_blueprint(study_sessions_bp)
        
        # Create database tables
        try:
            db.create_all()
        except Exception as e:
            print(f"Error creating tables: {e}")
    
    return app
