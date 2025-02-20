from datetime import datetime, UTC
from app import db

class BaseModel(db.Model):
    """Base model class with common fields"""
    __abstract__ = True
    
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, server_default=db.func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=db.func.now())

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not self.created_at:
            self.created_at = datetime.now(UTC)
