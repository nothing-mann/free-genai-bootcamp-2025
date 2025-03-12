import { ReactNode } from 'react';

interface DividerProps {
  children?: ReactNode;
  variant?: 'default' | 'nepal' | 'prayer';
  className?: string;
}

const Divider = ({ children, variant = 'default', className = '' }: DividerProps) => {
  if (variant === 'nepal') {
    return (
      <div className={`relative ${className}`}>
        <div className="nepal-divider"></div>
        {children && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-base-100 px-4">
            {children}
          </div>
        )}
      </div>
    );
  }
  
  if (variant === 'prayer') {
    return (
      <div className={`${className}`}>
        <div className="prayer-flags">
          <div className="prayer-flag prayer-flag-blue"></div>
          <div className="prayer-flag prayer-flag-white"></div>
          <div className="prayer-flag prayer-flag-red"></div>
          <div className="prayer-flag prayer-flag-green"></div>
          <div className="prayer-flag prayer-flag-yellow"></div>
          <div className="prayer-flag prayer-flag-blue"></div>
          <div className="prayer-flag prayer-flag-white"></div>
          <div className="prayer-flag prayer-flag-red"></div>
        </div>
        {children && (
          <div className="text-center -mt-3 mb-4">
            <span className="bg-base-100 px-4 text-sm text-nepal-stone">
              {children}
            </span>
          </div>
        )}
      </div>
    );
  }
  
  // Default divider using DaisyUI
  if (!children) {
    return <div className={`divider ${className}`}></div>;
  }
  
  return <div className={`divider ${className}`}>{children}</div>;
};

export default Divider;
