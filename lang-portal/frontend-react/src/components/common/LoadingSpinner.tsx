import React from 'react';
import { useTranslation } from 'react-i18next';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export const LoadingSpinner = ({ size = 'md', fullScreen = false }: LoadingSpinnerProps) => {
  const { t } = useTranslation();
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };
  
  const spinner = (
    <div className="flex items-center justify-center">
      <div className={`animate-spin rounded-full border-t-transparent border-nepal-red ${sizeClass[size]} border-4`} />
    </div>
  );
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-base-100/80 z-50">
        <div className="text-center">
          {spinner}
          <p className="mt-4 text-nepal-blue font-medium">{t('common.loading')}</p>
        </div>
      </div>
    );
  }
  
  return spinner;
};
