import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number | ReactNode;
  icon?: ReactNode;
  description?: string;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'accent' | 'success' | 'error' | 'temple';
  percentage?: number; // Add percentage prop to control coloring
}

const StatCard = ({ 
  title, 
  value, 
  icon, 
  description, 
  className = '', 
  variant = 'default',
  percentage // Optional percentage for score-based coloring
}: StatCardProps) => {
  // Use Nepal theme colors for variants - fixing the purple color issue
  let cardClass = 'bg-base-100 border border-nepal-red/10 hover:border-nepal-red/20 transition-all duration-300';
  let titleClass = 'text-base-content/70';
  let valueClass = 'text-nepal-red'; // Default color
  
  // Determine value color based on percentage if provided
  if (percentage !== undefined) {
    if (percentage >= 80) {
      valueClass = 'text-nepal-leaf'; // Green for high scores
    } else if (percentage >= 50) {
      valueClass = 'text-nepal-accent'; // Gold for medium scores
    } else {
      valueClass = 'text-nepal-red'; // Red for low scores
    }
  }
  
  if (variant === 'primary') {
    cardClass = 'bg-gradient-to-br from-nepal-red/90 to-nepal-red/70 text-white hover:shadow-nepal-hover transition-all duration-300';
    titleClass = 'text-white/80';
    valueClass = 'text-white';
  } else if (variant === 'secondary') {
    cardClass = 'bg-gradient-to-br from-nepal-red/90 to-nepal-red/70 text-white hover:shadow-nepal-hover transition-all duration-300';
    titleClass = 'text-white/80';
    valueClass = 'text-white';
  } else if (variant === 'temple') {
    cardClass = 'temple-container bg-base-100 border border-nepal-red/10 hover:border-nepal-red/30 transition-all duration-300';
    titleClass = 'text-nepal-red';
    if (percentage === undefined) {
      valueClass = 'text-nepal-red';
    }
  }
  
  return (
    <div className={`p-6 rounded-lg shadow-md ${cardClass} ${className} transform hover:-translate-y-0.5`}>
      <div className="flex justify-between">
        {icon && <div className="text-nepal-red">{icon}</div>}
        <div className={`text-sm font-medium ${titleClass}`}>{title}</div>
      </div>
      <div className={`text-2xl font-bold mt-2 ${valueClass}`}>{value}</div>
      {description && <div className="text-xs mt-1 opacity-70">{description}</div>}
    </div>
  );
};

export default StatCard;
