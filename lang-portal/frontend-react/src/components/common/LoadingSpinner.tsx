import { useTranslation } from 'react-i18next';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
}

export const LoadingSpinner = ({ fullScreen = false }: LoadingSpinnerProps) => {
  const { t } = useTranslation();

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-base-100 bg-opacity-50 z-50">
        <div className="flex flex-col items-center gap-2">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <span className="text-base-content">{t('common.loading')}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-10 gap-2">
      <div className="loading loading-spinner loading-md text-primary"></div>
      <span className="text-base-content">{t('common.loading')}</span>
    </div>
  );
};
