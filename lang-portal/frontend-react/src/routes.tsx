import { lazy, Suspense } from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import { LoadingSpinner } from './components/common/LoadingSpinner';

// Lazy load page components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const StudyActivities = lazy(() => import('./pages/StudyActivities'));
const StudyActivityView = lazy(() => import('./pages/StudyActivityView'));
const StudyActivityLaunch = lazy(() => import('./pages/StudyActivityLaunch'));
const Words = lazy(() => import('./pages/Words'));
const WordShow = lazy(() => import('./pages/WordShow'));
const Groups = lazy(() => import('./pages/Groups'));
const GroupShow = lazy(() => import('./pages/GroupShow'));
const StudySessions = lazy(() => import('./pages/StudySessions'));
const StudySessionShow = lazy(() => import('./pages/StudySessionShow'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

export const Routes = () => {
  return useRoutes([
    {
      path: '/',
      element: <Navigate to="/dashboard" replace />,
    },
    {
      path: '/dashboard',
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <Dashboard />
        </Suspense>
      ),
    },
    {
      path: '/study-activities',
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <StudyActivities />
        </Suspense>
      ),
    },
    {
      path: '/study-activities/:id',
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <StudyActivityView />
        </Suspense>
      ),
    },
    {
      path: '/study-activities/:id/launch',
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <StudyActivityLaunch />
        </Suspense>
      ),
    },
    {
      path: '/words',
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <Words />
        </Suspense>
      ),
    },
    {
      path: '/words/:id',
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <WordShow />
        </Suspense>
      ),
    },
    {
      path: '/groups',
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <Groups />
        </Suspense>
      ),
    },
    {
      path: '/groups/:id',
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <GroupShow />
        </Suspense>
      ),
    },
    {
      path: '/study-sessions',
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <StudySessions />
        </Suspense>
      ),
    },
    {
      path: '/study-sessions/:id',
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <StudySessionShow />
        </Suspense>
      ),
    },
    {
      path: '/settings',
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <Settings />
        </Suspense>
      ),
    },
    {
      path: '*',
      element: (
        <Suspense fallback={<LoadingSpinner />}>
          <NotFound />
        </Suspense>
      ),
    },
  ]);
};
