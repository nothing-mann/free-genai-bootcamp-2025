interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'nepal';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  showPercentage?: boolean;
}

const ProgressBar = ({
  value,
  max = 100,
  color = 'nepal', // Setting nepal as default color
  size = 'md',
  className = '',
  showPercentage = false,
}: ProgressBarProps) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const sizeClass = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  }[size];

  // Special Nepal-themed progress bar - always using the custom nepal progress bar
  return (
    <div className={`w-full flex flex-col ${className}`}>
      <div className={`progress-nepal ${sizeClass} rounded-full overflow-hidden`}>
        <div 
          className="bar transition-all duration-500 ease-out" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      {showPercentage && (
        <div className="text-right text-sm mt-1 font-medium text-nepal-red">
          {percentage.toFixed(0)}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
