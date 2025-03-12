import { ReactNode } from 'react';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

const Badge = ({ children, variant = 'default', size = 'md', className = '' }: BadgeProps) => {
  const variantClass = variant !== 'default' ? `badge-${variant}` : '';
  const sizeClass = size !== 'md' ? (size === 'lg' ? 'badge-lg' : 'badge-sm') : '';
  
  return (
    <div className={`badge ${variantClass} ${sizeClass} ${className}`}>
      {children}
    </div>
  );
};

export default Badge;
