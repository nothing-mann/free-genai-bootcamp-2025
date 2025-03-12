import { Suspense } from 'react';
import { Routes } from './routes';
import MainLayout from './components/layouts/MainLayout';
import { LoadingSpinner } from './components/common/LoadingSpinner';

function App() {
  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <MainLayout>
        <Routes />
      </MainLayout>
    </Suspense>
  );
}

export default App;
