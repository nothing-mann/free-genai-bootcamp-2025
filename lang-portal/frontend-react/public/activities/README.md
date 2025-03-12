# Study Activities

This directory contains standalone web applications for different study activities used in the Language Learning Portal.

## Available Activities

### Flashcards

A simple flashcard activity that presents a Nepali word and allows the user to flip the card to see the English translation and romanized pronunciation.

### Word Match

A memory-style game where users match Nepali words with their English translations.

## Adding New Activities

To add a new activity:

1. Create a new directory under `/activities` with the activity name
2. Create the following files:
   - `index.html` - The main HTML file
   - `styles.css` - CSS specific to the activity
   - `app.js` - JavaScript logic for the activity
3. Update the activity path mapping in `/src/utils/activityUtils.ts`
4. Make sure your activity handles URL parameters: `sessionId` and `groupId`
5. Implement the API calls to record results using:
   - `POST /api/study-sessions/${sessionId}/words/${wordId}/review` for each word
   - `POST /api/study-sessions/${sessionId}/end` when the activity is complete

## Communication Protocol

Each activity should:

1. Fetch words for the specified group ID
2. Track user interactions and score results
3. Submit results to the main application when complete
4. Allow the user to return to the main application
