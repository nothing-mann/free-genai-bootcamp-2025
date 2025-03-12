import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'outline' | 'nepal' | 'nepal-outline';
  color?: 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

const Badge = ({ 
  children, 
  variant = 'default', 
  color = 'primary', 
  size = 'sm', 
  className = '' 
}: BadgeProps) => {
  
  // Size classes
  const sizeClasses = {
    xs: 'text-xs px-1.5 py-0.5',
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-2.5 py-1'
  };

  // For Nepal themed badges
  if (variant === 'nepal') {
    return (
      <span className={`badge-nepal ${sizeClasses[size]} ${className}`}>
        {children}
      </span>
    );
  }
  
  if (variant === 'nepal-outline') {
    return (
      <span className={`badge-nepal-outline ${sizeClasses[size]} ${className}`}>
        {children}
      </span>
    );
  }
  
  // For default badges using DaisyUI
  let badgeClass = '';
  
  if (variant === 'outline') {
    badgeClass = `badge badge-outline badge-${color} ${sizeClasses[size]}`;
  } else {
    badgeClass = `badge badge-${color} ${sizeClasses[size]}`;
  }
  
  return (
    <span className={`${badgeClass} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
