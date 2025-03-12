import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface EmptyStateProps {
  title?: string;
  message: string;
  icon?: ReactNode;
  action?: ReactNode;
}

const EmptyState = ({ title, message, icon, action }: EmptyStateProps) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      {icon && <div className="text-base-content/50 text-5xl mb-4">{icon}</div>}
      
      {!icon && (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-16 w-16 text-base-content/30" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1} 
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" 
          />
        </svg>
      )}
      
      {title && <h3 className="font-medium text-lg mb-2">{title}</h3>}
      <p className="text-base-content/70 max-w-md">{message}</p>
      
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;
