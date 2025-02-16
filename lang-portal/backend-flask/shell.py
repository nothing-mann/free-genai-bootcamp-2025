from app import create_app, db
from app.models import Word, Group, StudyActivity

app = create_app()
app.app_context().push()

def check_data():
    print(f"Words count: {Word.query.count()}")
    print(f"Groups count: {Group.query.count()}")
    print(f"Activities count: {StudyActivity.query.count()}")
    
    # Print first few words
    print("\nFirst 5 words:")
    for word in Word.query.limit(5).all():
        print(f"- {word.nepali_word} ({word.english_word})")

if __name__ == '__main__':
    check_data()
