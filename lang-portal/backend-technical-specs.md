# Technical specifications

## Business Goal
A language learning school wants to build a prototype of learning portal which will act as three things:
- Inventory of possible vocabulary that can be learned
- Act as a  Learning record store (LRS), providing correct and wrong score on practice vocabulary
- A unified launchpad to launch different learning apps

## Technical Restriction
- Use python and flask to build the backend
- Use SQLite3 for database
- Use python and flask to build API
- Always return the response from the API in JSON format
- There will be no authentication or authorization needed
- There will be no concept of multiple user

## Database Schema
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

- GET /api/dashboard
- GET /api/dashboard/statistics
- GET /api/dashboard/last-session
- GET /api/dashboard/study-progress
- GET /api/study-activities
- GET /api/study-activities/:id
- GET /api/study-activities/:id/study-sessions
- POST /api/study-activities
    - required params: group_id, study_activity_id
- GET /api/words
- GET /api/words/:id
- GET /api/words/:id/word-groups
- GET /api/word-groups
- GET /api/word-groups/:id
- GET /api/word-groups/:id/words
- GET /api/word-groups/:id/study-sessions
- GET /api/study-sessions
    - pagination with next and previous buttons and 100 study sessions per page
- GET /api/study-sessions/:id
- GET /api/study-sessions/:id/word-review-items
- POST /api/reset-history
- POST /api/full-reset
- POST /api/study-sessions/:id/words/:word_id/review
    - required params: is_correct