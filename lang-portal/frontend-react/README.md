# Language Learning Portal - Frontend

A React-based frontend application for a language learning platform, focused on vocabulary management, learning record storage, and launching learning activities.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technical Stack](#technical-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development](#development)
  - [Building for Production](#building-for-production)
- [Integration with Backend](#integration-with-backend)
- [Code Architecture](#code-architecture)
- [Components](#components)
- [Internationalization](#internationalization)
- [Theming](#theming)
- [API Integration](#api-integration)
- [Pages and Features](#pages-and-features)

## Overview

The Language Learning Portal is designed to help users learn languages (with a focus on Nepali) through various study activities. The portal serves three main purposes:

1. **Vocabulary Management**: Allows users to browse and organize words into groups
2. **Learning Record Store (LRS)**: Tracks progress by recording correct and wrong responses 
3. **Unified Launchpad**: Provides access to different learning applications

## Features

- Responsive dashboard with statistics and study progress
- Word and word group management
- Study activities with interactive learning tools
- Study session tracking and analytics
- Theme customization (light/dark mode)
- Multi-language support (English and Nepali)
- Detailed analytics for learning progress

## Technical Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: 
  - React Query for server state
  - Zustand for UI state
- **Routing**: React Router v6
- **Styling**: Tailwind CSS with DaisyUI components
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form with Zod validation
- **Data Visualization**: Recharts
- **Internationalization**: i18next
- **Testing**: Vitest and React Testing Library

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/           # Generic components (buttons, cards, etc.)
│   └── layouts/          # Layout components
├── pages/                # Page components for each route
├── hooks/                # Custom React hooks
├── services/             # API service modules
├── types/                # TypeScript type definitions
├── store/                # Zustand store definitions
├── styles/               # Global styles and Tailwind config
├── i18n/                 # Internationalization resources
│   └── locales/          # Translation files
├── contexts/             # React contexts
├── App.tsx               # Main App component
├── main.tsx              # Application entry point
└── routes.tsx            # Route definitions
```

## Getting Started

### Prerequisites

- Node.js (version 16.x or higher)
- npm or yarn
- Backend API server running (see [Integration with Backend](#integration-with-backend))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/free-genai-bootcamp-2025.git
cd free-genai-bootcamp-2025/lang-portal/frontend-react
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

### Development

Start the development server:
```bash
npm run dev
# or
yarn dev
```

This will start the development server at `http://localhost:5173` with hot reload enabled.

### Building for Production

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## Integration with Backend

The frontend is designed to work with the Flask backend in the `backend-flask/` directory.

### Setup

1. Start the backend server first:
```bash
cd ../backend-flask
pip install -r requirements.txt
python app.py
```

2. The backend should be running on port 5000 by default.

3. Start the frontend with the proxy configuration (already set up in `vite.config.ts`):
```bash
cd ../frontend-react
npm run dev
```

4. The frontend will proxy API requests to the backend server.

## Code Architecture

### Core Principles

1. **Component-Based Architecture**: Modular components for reusability and maintainability
2. **Separation of Concerns**: Clear separation between UI, state, and business logic
3. **Type Safety**: TypeScript throughout for better developer experience and code safety
4. **Responsive Design**: Mobile-first approach with adaptive layouts
5. **Performance Optimization**: Code splitting, lazy loading, and memoization

### State Management

- **Server State**: Managed with React Query for caching, synchronization, and error handling
- **UI State**: Managed with Zustand for simple and efficient state management
- **Context API**: Used for global themes and other app-wide settings

## Components

The application includes a robust set of reusable components:

### Common Components

- **Card**: Container with consistent styling
- **Badge**: For status indicators and tags
- **DataTable**: Flexible data display with sorting and pagination
- **Pagination**: For navigating multi-page content
- **Modal/ConfirmDialog**: For interactive dialogs
- **ErrorDisplay**: For showing error messages
- **LoadingSpinner**: For indicating loading states
- **EmptyState**: For displaying when no data is available
- **ProgressBar**: For visualizing progress
- **StatCard**: For displaying statistics

### Layout Components

- **MainLayout**: Main layout with sidebar and navbar
- **Sidebar**: Navigation sidebar with links to main sections
- **Navbar**: Top navigation with theme toggle and language selector

## Internationalization

The application supports multiple languages:

- English (default)
- Nepali

Language files are stored in `src/i18n/locales/` and can be switched in the UI via the language selector in the navbar.

## Theming

The application supports light and dark themes:

- Theme switching via the toggle in the navbar
- Theme preferences are stored in local storage
- DaisyUI provides theme consistency across components

## API Integration

The frontend communicates with the backend API using Axios:

- API base URL is configured to proxy to the backend server
- Services are organized by domain (words, groups, study activities, etc.)
- React Query handles caching, refetching, and error handling

## Pages and Features

### Dashboard (`/dashboard`)

- Overview of learning statistics
- Study progress indicators
- Last study session summary
- Quick access to start studying

### Words (`/words`)

- Paginated list of all words
- Search and filtering capabilities
- Navigation to individual word details

### Word Details (`/words/:id`)

- Detailed view of a word
- Study statistics for the word
- Associated word groups

### Groups (`/groups`)

- List of word groups
- Group creation and management
- Group study statistics

### Group Details (`/groups/:id`)

- Detailed view of a group
- Words in the group
- Study sessions for the group

### Study Activities (`/study-activities`)

- Available study activities
- Launch interface for activities
- Activity descriptions and thumbnails

### Study Activity Details (`/study-activities/:id`)

- Detailed view of a study activity
- Past sessions for the activity
- Option to launch the activity

### Study Activity Launch (`/study-activities/:id/launch`)

- Interface to select a word group
- Launch configuration options
- Redirects to external learning tools

### Study Sessions (`/study-sessions`)

- List of past study sessions
- Session statistics
- Session filtering and searching

### Study Session Details (`/study-sessions/:id`)

- Detailed view of a study session
- Word review items
- Performance statistics

### Settings (`/settings`)

- Theme toggle (light/dark)
- Language selection (English/Nepali)
- Data reset options
  - Reset history (study sessions)
  - Full reset (all data)

## Conclusion

The Language Learning Portal frontend provides a comprehensive interface for language learning with a focus on vocabulary acquisition, progress tracking, and interactive learning activities. It is designed to be responsive, accessible, and user-friendly while integrating seamlessly with the backend API.
