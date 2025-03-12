interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  showPercentage?: boolean;
}

const ProgressBar = ({
  value,
  max = 100,
  color = 'primary',
  size = 'md',
  className = '',
  showPercentage = false,
}: ProgressBarProps) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const sizeClass = size === 'md' ? '' : `progress-${size}`;
  
  return (
    <div className={`w-full flex flex-col ${className}`}>
      <progress 
        className={`progress progress-${color} ${sizeClass} w-full`} 
        value={percentage} 
        max="100"
      ></progress>
      
      {showPercentage && (
        <div className="text-right text-sm mt-1">
          {percentage.toFixed(0)}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
