from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config

db = SQLAlchemy()

def create_app(config_class=Config):
    """Create and configure the Flask application"""
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Initialize extensions
    db.init_app(app)
    CORS(app)
    
    # Register blueprints
    with app.app_context():
        from app.routes.api import bp as api_bp
        app.register_blueprint(api_bp)
        
        # Register error handlers
        from app.utils.error_handlers import error_handlers
        app.register_blueprint(error_handlers)
        
        # Create database tables
        db.create_all()
    
    return app
