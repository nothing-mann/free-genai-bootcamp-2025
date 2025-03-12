import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number | ReactNode;
  icon?: ReactNode;
  description?: string;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'error';
}

const StatCard = ({ 
  title, 
  value, 
  icon, 
  description, 
  className = '', 
  variant = 'default'
}: StatCardProps) => {
  const variantClass = variant !== 'default' 
    ? `bg-${variant} text-${variant}-content` 
    : 'bg-base-200';
  
  return (
    <div className={`stat ${variantClass} ${className}`}>
      {icon && <div className="stat-figure text-secondary">{icon}</div>}
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
      {description && <div className="stat-desc">{description}</div>}
    </div>
  );
};

export default StatCard;
