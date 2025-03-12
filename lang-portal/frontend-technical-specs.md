## Frontend Technical Spec
### Business Goal
A language learning school wants to build a prototype of a learning portal which will act as three things:

* Inventory of possible vocabulary that can be learned
* Act as a Learning record store (LRS), providing correct and wrong scores on practiced vocabulary
* A unified launchpad to launch different learning apps

### Technical Stack
* Framework: React 18 with TypeScript
* Build Tool: Vite
* State Management: React Query for server state, Zustand for UI state
* Routing: React Router v6
* Styling: Tailwind CSS with DaisyUI components
* HTTP Client: Axios
* Form Handling: React Hook Form with Zod validation
* Data Visualization: Recharts for progress graphs and statistics
* Date/Time: Day.js for date formatting and manipulation
Internationalization: i18next for multi-language support (EN/NP)
* Testing: Vitest and React Testing Library

### Directory Structure
src/
├── components/           # Reusable UI components
│   ├── common/          # Generic components (buttons, cards, etc.)
│   ├── dashboard/       # Dashboard-specific components
│   ├── words/           # Word-related components
│   ├── groups/          # Group-related components
│   └── study/           # Study session components
├── pages/               # Page components for each route
├── hooks/               # Custom React hooks
├── services/            # API service modules
├── utils/               # Helper functions and utilities
├── types/               # TypeScript type definitions
├── store/               # Zustand store definitions
├── constants/           # Application constants
├── styles/              # Global styles and Tailwind config
├── assets/              # Static assets (images, icons)
├── i18n/                # Internationalization resources
├── App.tsx              # Main App component
├── main.tsx             # Application entry point
└── routes.tsx           # Route definitions

### Development Practices
1. Responsive design for mobile, tablet, and desktop views
2. Accessible UI components following WCAG guidelines
3. Component-driven development with Storybook documentation
4. Progressive enhancement for better user experience
5. Theme support for light and dark modes
6. Performance optimization with code splitting and lazy loading

## Backend Availability
**NOTE** All the backend code is available and working in the @backend-flask/ directory.

### Browser Support
* Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
* Mobile browsers on iOS and Android devices

## Pages
### Dashboard `/dashboard`
#### Purpose
The dashboard page is the main page of the application. It should provide users with an overview of their learning progress and allow them to track their study sessions.
#### Components
- Statistics
    - success rate
    - number of study sessions
    - active groups
    - study streak
- Study Progress
    - total words studied
    - total time spent studying
    - mastery progress bar
- Last Study Session
    - total words
    - correct words
    - wrong words
    - link to group
- Start Study Button
#### Needed API Endpoints
- GET /api/dashboard
- GET /api/dashboard/statistics
- GET /api/dashboard/last-session
- GET /api/dashboard/study-progress
- GET /api/study-activities

### Study Activities `/study-activities`
#### Purpose
The study activities page should provide users with a list of study activities that they can choose to take part in.
#### Components
- Study Activity Cards
    - activity name
    - launch button to take us to the activity launch page
    - view button to view the details of the study activity and data of the previous sessions
    - thumbnail image to reflect on the study activity
#### Needed API Endpoints
- GET /api/study-activities

### Study Activity View Page `/study-activities/:id`
#### Purpose
The study activity view page should provide users with a detailed view of the study activity, including the activity description, instructions, and any additional resources needed to complete the activity.
#### Components
- Activity Name
- Activity Thumbnail
- Activity Description
- Activity Instructions
- Launch Study Activity Button
- Past Study Activities Paginated List
    - id
    - activity name
    - group name
    - start time
    - end time
    - number of review items
    - number of correct review items
    - number of wrong review items
#### Needed API Endpoints
- GET /api/study-activities/:id
- GET /api/study-activities/:id/study-sessions

### Study Activity Launch Page `/study-activities/:id/launch`
#### Purpose
The study activity launch page should launch a study activity
#### Components
- Activity Name
- Launch Form
    - select field for group
    - launch now button (should be disabled until all the validation is passed)
#### Behavior
After the launch form is submitted, a new tab should open with the study activity based on the URL that is provided in the database.
Also, after the form is submitted, the page will redirect to the study sessions page
#### Needed API Endpoints
- POST /api/study-activities

### Words `/words`
#### Purpose
The purpose of this page is to show all the words in our database
#### Components
- Paginated List of Words
    - Columns
        - id
        - nepali_word
        - romanized_nepali_word
        - english_word
        - part_of_speech
    - Pagination with next and previous buttons and 100 words per page
    - Clicking on the nepali word should redirect to the word show page
#### Needed API Endpoints
- GET /api/words


### Word Show Page `/words/:id`
#### Purpose
The purpose of this page is to show the details of a word
#### Components
- Word Information
    - nepali_word
    - romanized_nepali_word
    - english_word
    - part_of_speech
    - study statistics
        - correct count
        - wrong count
- word groups
    - show as a series of pills eg. tags
    - click on a pill should redirect to the word group show page
#### Needed API Endpoints
- GET /api/words/:id
- GET /api/words/:id/groups

### Word Groups `/groups`
#### Purpose
The purpose of this page is to show all the word groups in our database
#### Components
- Paginated List of Word Groups
    - Columns
        - id
        - group name
        - group description
        - created_at
    - Clicking on the word group name should redirect to the word group show page
#### Needed API Endpoints
- GET /api/groups

### Word Group Show Page `/groups/:id`
#### Purpose
The purpose of this page is to show the details of a word group
#### Components
- Word Group Information
    - group name
    - group description
    - created_at
    - group statistics
        - correct count
        - wrong count
- word group words (Paginated list of words)
    - should use the same pagination as the words page
    - click on a word should redirect to the word show page
- study sessions (Paginated list of study sessions)
    - should use the same pagination as the study sessions page
    - click on a study session should redirect to the study session show page
#### Needed API Endpoints
- GET /api/groups/:id  (the name and group stats)
- GET /api/groups/:id/words
- GET /api/groups/:id/study-sessions


### Study Sessions Index `/study-sessions`
#### Purpose
The purpose of this page is to show all the study sessions in our database
#### Components
- Paginated List of Study Sessions
    - Columns
        - id
        - activity name
        - group name
        - start time
        - end time
        - number of review items
        - number of correct review items
        - number of wrong review items
    - Clicking on the study session name should redirect to the study session show page
#### Needed API Endpoints
- GET /api/study-sessions

### Study Session Show Page `/study-sessions/:id`
#### Purpose
The purpose of this page is to show the details of a study session
#### Components
- Study Session Information
    - activity name
    - group name
    - start time
    - end time
    - number of review items
    - number of correct review items
    - number of wrong review items
- word review items (Paginated list of word review items)
    - should use the same pagination as the words page
    - click on a word should redirect to the word show page
#### Needed API Endpoints
- GET /api/study-sessions/:id
- GET /api/study-sessions/:id/words

### Settings `/settings`
#### Purpose
The purpose of this page is to make configurations to the study portal.
#### Components
- Settings
    - Theme eg. dark or light
    - Language eg. en or np
    - Reset History Button
        - This button will delete all the study sessions and word review items in a single request
    - Full reset button
        - This button will drop all the tables and recreate with seed data
#### Needed API Endpoints
- POST /api/reset-history
- POST /api/full-reset
