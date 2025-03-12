import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`card-bordered p-6 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
