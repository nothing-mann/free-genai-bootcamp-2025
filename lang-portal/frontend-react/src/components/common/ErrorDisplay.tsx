import { useTranslation } from 'react-i18next';

interface ErrorDisplayProps {
  error: Error | null;
  resetError?: () => void;
}

const ErrorDisplay = ({ error, resetError }: ErrorDisplayProps) => {
  const { t } = useTranslation();

  if (!error) return null;

  return (
    <div className="bg-error text-error-content rounded-lg p-4 my-4">
      <div className="flex items-center gap-2">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <h3 className="font-medium">{t('common.error')}</h3>
      </div>
      <p className="mt-2">{error.message}</p>
      {resetError && (
        <button 
          onClick={resetError} 
          className="btn btn-sm btn-error mt-2"
        >
          {t('common.retry')}
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;
