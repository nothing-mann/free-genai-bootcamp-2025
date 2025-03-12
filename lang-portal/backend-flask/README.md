# Language Learning Portal - Backend API

A Flask-based RESTful API backend for the Nepali Language Learning Portal, providing vocabulary management, learning record storage, and activity launching capabilities.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technical Stack](#technical-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development](#development)
  - [Database Management](#database-management)
- [API Documentation](#api-documentation)
- [Code Architecture](#code-architecture)
- [Models](#models)
- [Testing](#testing)
- [Task Management with Invoke](#task-management-with-invoke)

## Overview

The backend API serves as the data and functionality provider for the Language Learning Portal. It manages vocabulary words, organizes them into groups, tracks user learning progress, and provides endpoints to launch and record study activities.

## Features

- **Vocabulary Management**: Store and retrieve Nepali words with translations and metadata
- **Word Grouping**: Organize words into meaningful study groups
- **Study Activities**: Manage different types of learning activities 
- **Learning Record Store**: Track user progress through study sessions
- **Analytics**: Calculate and provide learning statistics
- **RESTful Design**: Well-structured API with consistent response formats
- **Input Validation**: Schema-based validation using Pydantic
- **Comprehensive Testing**: Extensive test suite for both unit and integration testing

## Technical Stack

- **Framework**: Flask 3.0.1
- **Database ORM**: SQLAlchemy 2.0.25
- **Database**: SQLite
- **Validation**: Pydantic 2.5.3
- **Testing**: pytest 7.4.4 with coverage reporting
- **Task Runner**: Invoke 2.2.0

## Project Structure

```
backend-flask/
├── app/                  # Main application code
│   ├── models/           # SQLAlchemy model definitions
│   │   ├── base.py       # Base model class
│   │   ├── word.py       # Word model
│   │   ├── group.py      # Group model 
│   │   ├── study_activity.py
│   │   ├── study_session.py
│   │   ├── word_review.py
│   │   └── __init__.py
│   ├── routes/           # API route definitions
│   │   ├── api.py        # Main API routes
│   │   ├── study_sessions.py
│   │   └── __init__.py
│   ├── utils/            # Utility functions
│   │   ├── responses.py  # Response formatting
│   │   ├── statistics.py # Statistics calculations
│   │   ├── error_handlers.py
│   │   └── __init__.py
│   ├── extensions.py     # Flask extensions (SQLAlchemy)
│   ├── middleware.py     # Request/response middleware
│   ├── schemas.py        # Pydantic validation schemas
│   └── __init__.py       # App factory
├── db/                   # Database files
│   ├── migrations/       # Schema migration files
│   │   ├── 0001_init.sql
│   │   └── 0002_study_tables.sql
│   └── seeds/            # Seed data for testing and development
│       ├── activities.json
│       └── sessions.json
├── tests/                # Test suite
│   ├── unit/             # Unit tests
│   │   ├── test_models.py
│   │   ├── test_schemas.py
│   │   └── test_utils_unit.py
│   ├── integration/      # Integration tests
│   │   ├── test_api_endpoints.py
│   │   ├── test_error_handling.py
│   │   ├── test_word_endpoints.py
│   │   └── test_utils_integration.py
│   ├── fixtures/         # Test fixtures
│   │   └── test_data.py
│   └── conftest.py       # pytest configuration
├── config.py             # Application configuration
├── app.py                # Application entry point
├── manage.py             # Flask CLI management commands
├── tasks.py              # Invoke task definitions
├── setup.py              # Package setup information
├── debug_db.py           # Database debugging utility
├── shell.py              # Interactive shell utility
└── requirements.txt      # Dependencies
```

## Getting Started

### Prerequisites

- Python 3.8 or higher
- pip (Python package installer)
- SQLite3

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/free-genai-bootcamp-2025.git
cd free-genai-bootcamp-2025/lang-portal/backend-flask
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install required packages:
```bash
pip install -r requirements.txt
```

### Development

The recommended way to run the development server is using the Invoke task runner:

```bash
invoke run
```

Alternatively, use Flask's built-in server:

```bash
export FLASK_APP=app.py
export FLASK_ENV=development
flask run
```

The API will be available at `http://localhost:8080`.

### Database Management

1. Initialize a new database:
```bash
invoke init-db
# or
python manage.py init-db
```

2. Run database migrations:
```bash
invoke migrate
```

3. Seed the database with sample data:
```bash
invoke seed-db
```

4. For database debugging:
```bash
python debug_db.py
```

## API Documentation

### Core Resources

#### Words
- `GET /api/words` - List words (paginated)
- `GET /api/words/<id>` - Get a specific word
- `GET /api/words/<id>/groups` - Get groups for a word

#### Groups
- `GET /api/groups` - List groups (paginated)
- `GET /api/groups/<id>` - Get a specific group
- `GET /api/groups/<id>/words` - Get words in a group
- `GET /api/groups/<id>/study-sessions` - Get study sessions for a group

#### Study Activities
- `GET /api/study-activities` - List all study activities
- `GET /api/study-activities/<id>` - Get a specific activity
- `GET /api/study-activities/<id>/study-sessions` - Get sessions for an activity
- `POST /api/study-activities` - Create a new study session for an activity

#### Study Sessions
- `GET /api/study-sessions` - List all study sessions
- `GET /api/study-sessions/<id>` - Get a specific session
- `GET /api/study-sessions/<id>/words` - Get words reviewed in a session
- `POST /api/study-sessions/<id>/end` - End a study session
- `POST /api/study-sessions/<id>/words/<word_id>/review` - Record a word review

#### Dashboard
- `GET /api/dashboard` - Dashboard overview
- `GET /api/dashboard/statistics` - Learning statistics
- `GET /api/dashboard/study-progress` - Study progress
- `GET /api/dashboard/last-session` - Last study session

#### Management
- `POST /api/reset-history` - Reset study history (sessions and reviews)
- `POST /api/full-reset` - Full data reset

### Response Format

Success response:
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2024-01-15T12:34:56Z",
  "meta": { ... }  // Optional metadata
}
```

Error response:
```json
{
  "success": false,
  "message": "Error description",
  "error_code": "ERROR_CODE",
  "timestamp": "2024-01-15T12:34:56Z"
}
```

## Code Architecture

### Core Components

1. **Models**: SQLAlchemy ORM models representing the database schema
2. **Routes**: Flask blueprints defining API endpoints
3. **Schemas**: Pydantic schemas for request/response validation
4. **Utils**: Helper functions for common operations
5. **Middleware**: Request/response processing

### Design Patterns

- **Factory Pattern**: App factory for creating Flask application instances
- **Repository Pattern**: Model-based data access
- **Decorator Pattern**: Middleware for request validation and processing

## Models

The application uses SQLAlchemy ORM with the following key models:

### Word
- `id`: Primary key
- `nepali_word`: Nepali text
- `romanized_nepali_word`: Romanized representation
- `english_word`: English translation
- `part_of_speech`: JSON array of part-of-speech tags
- `groups`: Many-to-many relationship with groups

### Group
- `id`: Primary key
- `name`: Group name
- `description`: Group description
- `words`: Many-to-many relationship with words

### StudyActivity
- `id`: Primary key
- `name`: Activity name
- `description`: Activity description
- `instructions`: User instructions
- `thumbnail`: Image path

### StudySession
- `id`: Primary key
- `group_id`: Foreign key to Group
- `study_activity_id`: Foreign key to StudyActivity
- `started_at`: Session start time
- `ended_at`: Session end time

### WordReviewItem
- `id`: Primary key
- `word_id`: Foreign key to Word
- `session_id`: Foreign key to StudySession
- `group_id`: Foreign key to Group
- `is_correct`: Boolean indicator of correct response
- `created_at`: Review timestamp

## Testing

The project includes a comprehensive test suite:

- **Unit tests**: Tests for models, schemas, and utility functions
- **Integration tests**: Tests for API endpoints and error handling

Run tests with:
```bash
# Run all tests
invoke test

# Run with coverage
invoke coverage

# Run specific test
pytest tests/unit/test_models.py -v
```

## Task Management with Invoke

The project uses `invoke` for task automation:

```bash
# List available tasks
invoke --list

# Common tasks:
invoke init-db     # Initialize database
invoke migrate     # Run migrations
invoke seed-db     # Load seed data
invoke run         # Start development server
invoke test        # Run tests
invoke coverage    # Run tests with coverage
invoke clean       # Remove cache files
invoke lint        # Check code style
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Add tests for your changes
4. Make your changes
5. Run tests to ensure they pass (`invoke test`)
6. Commit your changes (`git commit -am 'Add new feature'`)
7. Push to the branch (`git push origin feature-name`)
8. Create a new Pull Request
