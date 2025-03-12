import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'temple' | 'mountain';
}

const Card = ({ children, className = '', variant = 'default' }: CardProps) => {
  let cardClasses = 'bg-base-100 shadow-md rounded-lg p-6 transition-all duration-300 hover:shadow-nepal-hover';
  
  if (variant === 'temple') {
    cardClasses = 'temple-container bg-base-100 shadow-md p-6 transition-all duration-300 hover:shadow-nepal-hover';
  } else if (variant === 'mountain') {
    cardClasses = 'bg-base-100 shadow-md rounded-stupa p-6 border border-nepal-red/10 transition-all duration-300 hover:shadow-nepal-hover';
  }
  
  return (
    <div className={`${cardClasses} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
