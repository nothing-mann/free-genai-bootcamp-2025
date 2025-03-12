import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'nepal';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = ({ 
  children, 
  variant = 'nepal', 
  size = 'md', 
  isLoading = false,
  className = '',
  disabled,
  ...props 
}: ButtonProps) => {
  
  // Base classes
  let baseClasses = 'font-medium rounded-md focus:outline-none transition-all duration-200';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };
  
  // Variant classes - updated to use consistent styling
  let variantClass = '';
  
  if (variant === 'nepal') {
    variantClass = 'bg-secondary text-white hover:bg-secondary-focus';
  } else if (variant === 'primary') {
    variantClass = 'bg-primary text-white hover:bg-primary-focus';
  } else if (variant === 'secondary') {
    variantClass = 'bg-secondary text-white hover:bg-secondary-focus';
  } else if (variant === 'outline') {
    variantClass = 'btn-outline border-secondary text-secondary hover:bg-secondary hover:text-white';
  } else if (variant === 'ghost') {
    variantClass = 'btn-ghost text-secondary hover:bg-secondary/10';
  }
  
  // Loading state
  const loadingClasses = isLoading ? 'opacity-80 pointer-events-none' : '';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  return (
    <button
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClass}
        ${loadingClasses}
        ${disabledClasses}
        shadow-sm hover:shadow-md
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="mr-2 inline-block animate-spin">⟳</span>
      )}
      {children}
    </button>
  );
};

export default Button;
