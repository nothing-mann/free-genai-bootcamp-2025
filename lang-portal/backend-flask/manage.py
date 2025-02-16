from flask.cli import FlaskGroup
from app import create_app, db
from app.models import Word, Group, StudyActivity, StudySession, WordReviewItem

cli = FlaskGroup(create_app=create_app)

@cli.command("init-db")
def init_db():
    """Initialize the database."""
    db.drop_all()
    db.create_all()
    print("Initialized database")

if __name__ == '__main__':
    cli()
