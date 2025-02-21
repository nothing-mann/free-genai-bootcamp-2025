from datetime import datetime, UTC
from app.extensions import db

class BaseModel(db.Model):
    """Base model class"""
    __abstract__ = True
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, server_default=db.func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=db.func.now())

    def __init__(self, **kwargs):
        allowed = self.__mapper__.attrs.keys()
        filtered = {k: v for k, v in kwargs.items() if k in allowed}
        super().__init__(**filtered)
        if not self.created_at:
            self.created_at = datetime.now(UTC)
