## Backend Technical specifications

## Business Goal
A language learning school wants to build a prototype of learning portal which will act as three things:
- Inventory of possible vocabulary that can be learned
- Act as a  Learning record store (LRS), providing correct and wrong score on practice vocabulary
- A unified launchpad to launch different learning apps

## Technical Restriction
- Use python and flask to build the backend
- Invoke is a task runner for python
- Use SQLite3 for database
- Use python and flask to build API
- Always return the response from the API in JSON format
- There will be no authentication or authorization needed
- There will be no concept of multiple user

## Directory Structure
```text
backend-flask/
├── app/                  # Main application code
│   ├── models/          # Database models
│   ├── routes/          # API route handlers
│   ├── services/        # Business logic
│   └── __init__.py      # Flask app initialization
├── db/                  # Database related files
│   ├── migrations/      # SQL migration files
│   └── seeds/          # JSON seed data files
├── tests/              # Test files
│   ├── unit/          # Unit tests
│   └── integration/   # Integration tests
├── config.py          # Configuration settings
├── requirements.txt   # Python dependencies
├── tasks.py          # Invoke tasks definition
├── words.db          # SQLite database file
└── .gitignore        # Git ignore rules
```
## Database Schema
Out database will be a single sqlite3 database called `words.db` that will be located in the root folder of `backend-flask`.

We have the following tables:
- words - stored vocabulary words
    - id integer
    - nepali_word string
    - romanized_nepali_word string
    - english_word string
    - part_of_speech json
- words_groups - join table for words and groups (relationship many-to-many)
    - id integer
    - word_id integer
    - group_id integer
- groups - thematic grouup of words
    - id integer
    - name string
    - description string
- study_sessions - records of study session grouping word_review_items
    - id integer
    - group_id integer
    - started_at datetime
    - ended_at datetime
    study_activity_id integer
- study_activities - a specific study activity, linking a study session to group
    - id integer
    - session_id integer
    - group_id integer
    - started_at datetime
    - ended_at datetime
- word_review_items - a record of word practice, determining if the word was correct or not
    - id integer
    - word_id integer
    - session_id integer
    - group_id integer
    - is_correct boolean
    - created_at datetime

## API Endpoints

### GET /api/dashboard
Returns the overview dashboard information
#### JSON Response
```json
{
  "message": "Welcome to the dashboard!",
  "total_words": 100,
  "total_groups": 10,
  "total_study_sessions": 25
}
```
### GET /api/dashboard/statistics
Returns the statistics of the current user
#### JSON Response
```json
{
  "words_learned": 50,
  "study_sessions_completed": 20,
  "average_score": 85,
  "streak": 10
}
```
### GET /api/dashboard/last-session
Returns the statistics of the last study session
#### JSON Response
```json
{
  "id": 1,
  "group_id": 1,
  "started_at": "2025-02-13T10:00:00Z",
  "ended_at": "2025-02-13T11:00:00Z",
  "score": 90
}
```
### GET /api/dashboard/study-progress
Returns the study progress statistics
The frontend will determine the progress bar based on total words studied and total available work
#### JSON Response
```json
{
  "total_words_studied": 30,
  "total_available_words": 100,
}
```
### GET /api/study-activities
Returns a paginated list of study activities
#### JSON Response
```json
{
  "study_activities": [
    {
      "id": 1,
      "name": "Vocabulary Practice",
      "description": "Practice vocabulary through various exercises.",
      "instructions": "Follow the prompts to complete the exercises.",
      "thumbnail": "https://placehold.co/400x200"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total_pages": 5,
    "has_next": true,
    "has_previous": false
  }
}
```

### GET /api/study-activities/:id
Returns the study activity
#### JSON Response
```json
{
  "id": 1,
  "name": "Vocabulary Practice",
  "description": "Practice vocabulary through various exercises.",
  "instructions": "Follow the prompts to complete the exercises.",
  "thumbnail": "https://placehold.co/400x200"
}
```
### GET /api/study-activities/:id/study-sessions
Returns a paginated list of study sessions
#### JSON Response
```json
{
  "study_sessions": [
    {
      "id": 1,
      "activity_name": "Vocabulary Practice",
      "group_name": "Beginner",
      "started_at": "2025-02-13T10:00:00Z",
      "ended_at": "2025-02-13T11:00:00Z",
      "number_of_review_items": 20,
      "number_of_correct_review_items": 15,
      "number_of_wrong_review_items": 5
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total_pages": 5,
    "has_next": true,
    "has_previous": false
  }
}
```
### POST /api/study-activities

#### Request params
- group_id integer
- study_activity_id integer
#### JSON Response
```json
{
  "id": 3,
  "message": "Study activity created successfully.",
  "group_id": 1,
  "study_activity_id": 1
}
```

### GET /api/words

Returns a paginated list of words

#### JSON Response
```json
{
  "words": [
    {
      "id": 1,
      "nepali_word": "नमस्ते",
      "romanized_nepali_word": "namaste",
      "english_word": "hello",
      "part_of_speech": ["greeting"]
    },
    {
      "id": 2,
      "nepali_word": "धन्यवाद",
      "romanized_nepali_word": "dhanyabad",
      "english_word": "thank you",
      "part_of_speech": ["expression"]
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total_pages": 5,
    "has_next": true,
    "has_previous": false
  }
}
```
### GET /api/words/:id
Returns a word
#### JSON Response
```json
{
  "id": 1,
  "nepali_word": "नमस्ते",
  "romanized_nepali_word": "namaste",
  "english_word": "hello",
  "part_of_speech": ["greeting"],
  "word_groups": [
    {
      "id": 1,
      "name": "Beginner",
      "description": "Words for beginners",
      "total_words": 10
    }
  ]
}
```

### GET /api/words/:id/groups
Returns a paginated list of word groups

#### JSON Response
```json
{
  "word_groups": [
    {
      "id": 1,
      "name": "Greetings",
      "description": "Common greetings in Nepali.",
      "total_words": 10
    }
  ]
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total_pages": 5,
    "has_next": true,
    "has_previous": false
  }
}
```
### GET /api/groups
Returns a paginated list of word groups

#### JSON Response
```json
{
  "word_groups": [
    {
      "id": 1,
      "name": "Greetings",
      "description": "Common greetings in Nepali.",
      "total_words": 10
    },
    {
      "id": 2,
      "name": "Colors",
      "description": "Vocabulary related to colors.",
      "total_words": 10
    }
  ]
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total_pages": 5,
    "has_next": true,
    "has_previous": false
  }
}
```

### GET /api/groups/:id
Returns a word group
#### JSON Response
```json
{
  "id": 1,
  "name": "Greetings",
  "description": "Common greetings in Nepali.",
  "statistics": {
    "correct_count": 5,
    "wrong_count": 2,
    "total_count": 7
  }
}
```
### GET /api/groups/:id/words
Returns a paginated list of words in a word group
#### JSON Response
```json
{
  "words": [
    {
      "id": 1,
      "nepali_word": "नमस्ते",
      "romanized_nepali_word": "namaste",
      "english_word": "hello"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total_pages": 5,
    "has_next": true,
    "has_previous": false
  }
}
```
### GET /api/groups/:id/study-sessions
Returns a paginated list of study sessions in a word group
#### JSON Response
```json
{
  "study_sessions": [
    {
      "id": 1,
      "activity_name": "Vocabulary Practice",
      "group_name": "Beginner",
      "started_at": "2025-02-13T10:00:00Z",
      "ended_at": "2025-02-13T11:00:00Z",
      "number_of_review_items": 20,
      "number_of_correct_review_items": 15,
      "number_of_wrong_review_items": 5
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total_pages": 5,
    "has_next": true,
    "has_previous": false
  }
}
```
### GET /api/study-sessions
Returns a paginated list of study sessions
#### JSON Response
```json
{
  "study_sessions": [
      {
      "id": 1,
      "activity_name": "Vocabulary Practice",
      "group_name": "Beginner",
      "started_at": "2025-02-13T10:00:00Z",
      "ended_at": "2025-02-13T11:00:00Z",
      "number_of_review_items": 20,
      "number_of_correct_review_items": 15,
      "number_of_wrong_review_items": 5
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total_pages": 5,
    "has_next": true,
    "has_previous": false
  }
}
```
### GET /api/study-sessions/:id
Returns a study session
#### JSON Response
```json
{
    "id": 1,
    "activity_name": "Vocabulary Practice",
    "group_name": "Beginner",
    "started_at": "2025-02-13T10:00:00Z",
    "ended_at": "2025-02-13T11:00:00Z",
    "number_of_review_items": 20,
    "number_of_correct_review_items": 15,
    "number_of_wrong_review_items": 5
}
```
### GET /api/study-sessions/:id/words
Returns a paginated list of word review items in a study session
#### JSON Response
```json
{
  "words": [
    {
      "id": 1,
      "nepali_word": "नमस्ते",
      "romanized_nepali_word": "namaste",
      "english_word": "hello"
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total_pages": 5,
    "has_next": true,
    "has_previous": false
  }
}
```
### POST /api/reset-history
Deletes all the study sessions and word review items
#### JSON Response
```json
{
    "success": true,
    "message": "History reset successfully"
}
```
### POST /api/full-reset
Deletes all the tables and recreate with seed data
#### JSON Response
```json
{
    "success": true,
    "message": "Full reset successfully"
}
```
### POST /api/study-sessions/:id/words/:word_id/review
Reviews a word review item
#### Request Params
- id (study_session_id) integer,
- word_id integer,
- is_correct boolean
#### Request Payload
```json
{
    "is_correct": true
}
```
#### JSON Response
```json
{
    "success": true,
    "message": "Word review item reviewed successfully",
    "id": 1,
    "word_id": 1,
    "session_id": 1,
    "group_id": 1,
    "is_correct": true,
    "created_at": "2025-02-13T20:04:22Z"
}
```
## Task Runner Tasks
Let's list the possible tasks that we need for our app

### Initialize Database
This task will initialize the  sqlite database called `words.db`

### Migrate Database
This task will run a series of migrations sql files on the database

Migrations live in the `migrations` folder.
The migration files will be run in order of their file name.
The migration file name should look like this
```sql
0001_init.sql
0002_create_words_table.sql
0003_create_words_groups_table.sql
0004_create_groups_table.sql
0005_create_study_sessions_table.sql
0006_create_study_activity_table.sql
0007_create_word_review_items_table.sql
```

### Seed Database
This task will import json files and transform them into target data for our database.

All seed files live in the `seeds` folder
All seed files should be loaded

In our task we should have DSL to specific each seed file and its expected group word name. 
```json
{
    "nepali": "अध्याय",
    "romanized_nepali": "adhyay",
    "english": "chapter",
    "part_of_speech": [
        "noun"
    ]
}
```