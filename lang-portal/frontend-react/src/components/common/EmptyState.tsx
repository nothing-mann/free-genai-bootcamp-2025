import React, { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

const EmptyState = ({ 
  title, 
  message, 
  icon, 
  action,
  className = ''
}: EmptyStateProps) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 bg-base-100 rounded-lg border border-nepal-red/10 ${className}`}>
      {icon ? (
        <div className="text-nepal-blue mb-4">{icon}</div>
      ) : (
        <div className="w-16 h-16 mb-4 rounded-full bg-nepal-blue/10 flex items-center justify-center">
          <svg 
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-nepal-blue"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      )}
      <h3 className="text-lg font-medium text-nepal-red mb-2">{title}</h3>
      {message && <p className="text-base-content/70 text-center max-w-md mb-4">{message}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

export default EmptyState;
