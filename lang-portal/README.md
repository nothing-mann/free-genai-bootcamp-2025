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

## Frontend Setup (React)

### Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager

### Setup Instructions

1. **Navigate to the Frontend Directory**
```bash
cd frontend-react
```

2. **Install Dependencies**
```bash
npm install
# or
yarn install
```

3. **Start Development Server**
```bash
npm run dev
# or
yarn dev
```

The development server will start at http://localhost:5173

### Building for Production

```bash
npm run build
# or
yarn build
```

The build output will be in the `dist/` directory.

## Frontend Architecture

### Technical Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**:
  - React Query for server state (API data handling)
  - Zustand for UI state (theme, language preferences)
- **Routing**: React Router v6
- **Styling**: Tailwind CSS with DaisyUI components
- **HTTP Client**: Axios for API communication
- **Internationalization**: i18next (English and Nepali support)

### Key Components

The frontend implements a comprehensive set of reusable components:

#### Common UI Components
- **Card**: Wrapper component for consistent card styling
- **Badge**: For displaying status indicators and tags
- **DataTable**: Flexible table with support for pagination and sorting
- **Modal/ConfirmDialog**: For interactive dialogs
- **PageHeader**: Consistent page header with title and actions
- **StatCard**: For displaying statistics with title, value, and description
- **EmptyState**: For displaying empty state messages
- **ProgressBar**: For visualizing progress indicators

#### Pages
- **Dashboard**: Shows learning statistics and progress
- **Words**: Displays all vocabulary words with pagination
- **WordShow**: Detailed view of a single word
- **Groups**: Lists word groups
- **GroupShow**: Detailed view of a word group and its words
- **StudyActivities**: Shows available study activities
- **StudyActivityLaunch**: Interface to start a study activity
- **StudySessions**: Lists past study sessions
- **Settings**: Configurable options for theme and language

### Frontend Features

- **Responsive Design**: Mobile-first approach that adapts to all screen sizes
- **Internationalization**: Complete translations in English and Nepali
- **Theme Support**: Light and dark mode with persistent preferences
- **Error Handling**: Consistent error displays with retry functionality
- **Loading States**: Visual indicators during data fetching
- **Data Caching**: Efficient API request handling with React Query
- **Type Safety**: Full TypeScript integration for code reliability

## Project Structure
```
lang-portal/
├── backend-flask/       # Flask backend application
│   ├── app/             # Application code
│   │   ├── models/      # Database models
│   │   ├── routes/      # API endpoints
│   │   └── utils/       # Helper functions
│   └── tests/           # Backend tests
│
├── frontend-react/      # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── services/    # API service modules
│   │   ├── contexts/    # React contexts
│   │   └── i18n/        # Internationalization resources
│   └── public/          # Static assets
```

## Full-Stack Integration

### Communication Flow

1. **Data Flow**:
   - React frontend makes API requests to the Flask backend
   - Backend processes requests and interacts with the SQLite database
   - Backend returns structured JSON responses
   - Frontend displays data and handles user interactions

2. **Authentication**: 
   - Currently using simple API access without authentication
   - Future versions could implement JWT authentication

3. **Development Workflow**:
   - Run both backend and frontend servers simultaneously
   - Backend serves API requests on port 5000
   - Frontend proxies API requests to the backend

### Running the Complete Application

1. **Start the Backend**:
```bash
cd backend-flask
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Using the invoke task manager as recommended
invoke run
```

2. **Start the Frontend** (in a new terminal):
```bash
cd frontend-react
npm run dev
# or
yarn dev
```

3. **Access the Application**:
   - Open your browser and navigate to http://localhost:5173
   - The frontend will communicate with the backend API

### Additional Invoke Tasks for the Backend

You can use other invoke commands for managing the backend:

```bash
# Run tests
invoke test

# Run tests with coverage
invoke coverage

# Reset the database to initial state
invoke reset-db

# Load sample data
invoke seed-db
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
- Responsive UI with theme support
- Multi-language interface

## Contributing

1. Fork the repository
2. Create a feature branch
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

MIT License - see LICENSE file for details
