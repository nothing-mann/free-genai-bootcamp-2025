# Nepali Language Learning Portal

A full-stack web application for learning Nepali language with interactive study sessions and progress tracking.

## Backend Setup (Flask)

### Prerequisites

- Python 3.12 or higher
- pip (Python package installer)
- virtualenv
- SQLite3

### Setup Instructions

1. **Create Virtual Environment**
```bash
cd backend-flask
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install Dependencies**
```bash
pip install -r requirements.txt
```

Dependencies include:
- Flask==3.0.1
- flask-sqlalchemy==3.1.1
- flask-cors==4.0.0
- pydantic==2.5.3
- pytest==7.4.4
- pytest-cov==4.1.0
(full list in requirements.txt)

3. **Initialize Database**
```python
# Start Python shell
python
>>> from app import db, create_app
>>> app = create_app()
>>> with app.app_context():
...     db.create_all()
```

4. **Load Sample Data (Optional)**
```python
>>> from tests.fixtures.test_data import SAMPLE_WORDS, SAMPLE_GROUPS, SAMPLE_ACTIVITIES
>>> from app.models import Word, Group, StudyActivity
>>> with app.app_context():
...     # Add sample words
...     for word_data in SAMPLE_WORDS:
...         word = Word(**word_data)
...         db.session.add(word)
...     db.session.commit()
```


### Using Invoke Task Manager

The project uses `invoke` for common development tasks. Here are the available commands:

```bash
# Install dependencies
invoke install

# Run the development server
invoke run

# Run tests
invoke test

# Run tests with coverage
invoke coverage

# Clean up Python cache files
invoke clean

# Reset the database
invoke reset-db

# Load sample data
invoke seed-db

# Check code style
invoke lint
```

You can see all available tasks by running:
```bash
invoke --list
```

### Running the Server

```bash
export FLASK_APP=app
export FLASK_ENV=development
flask run
```
Server will be available at http://localhost:5000

### Running Tests

```bash
# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ -v --cov=app
```

## API Endpoints

### Core Resources

#### Words
- `GET /api/words` - List words (paginated)
- `GET /api/words/<id>` - Get word details
- `GET /api/words/<id>/groups` - Get word groups

#### Groups
- `GET /api/groups` - List groups
- `GET /api/groups/<id>` - Get group details
- `GET /api/groups/<id>/words` - List words in group

### Study Features

#### Activities
- `GET /api/study-activities` - List activities
- `POST /api/study-activities` - Create study session
- `GET /api/study-activities/<id>` - Get activity details

#### Sessions
- `GET /api/study-sessions/<id>` - Get session details
- `POST /api/study-sessions/<id>/end` - End session
- `POST /api/study-sessions/<id>/words/<word_id>/review` - Submit review

#### Progress & Statistics
- `GET /api/dashboard` - Dashboard overview
- `GET /api/dashboard/statistics` - Learning statistics
- `GET /api/dashboard/study-progress` - Study progress
- `GET /api/dashboard/last-session` - Latest session

#### Management
- `POST /api/reset-history` - Reset study history
- `POST /api/full-reset` - Full system reset

## Project Structure
```
backend-flask/
├── app/
│   ├── models/        # Database models
│   ├── routes/        # API endpoints
│   ├── schemas/       # Data validation
│   └── utils/         # Helper functions
├── tests/
│   ├── fixtures/      # Test data
│   ├── integration/   # Integration tests
│   └── conftest.py    # Test configuration
└── requirements.txt
```

## Features
- Word management (Nepali, romanized, English)
- Word grouping system
- Interactive study sessions
- Progress tracking
- Statistics and analytics
- Error handling
- Input validation
- Comprehensive testing
- RESTful API design

## Development
- All endpoints return standardized JSON responses
- Proper error handling with status codes
- Input validation using Pydantic
- SQLAlchemy for database operations
- Pytest for testing
- Coverage reporting

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

MIT License - see LICENSE file for details
