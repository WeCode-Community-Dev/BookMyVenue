import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
  text?: string;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  fullPage = false,
  text,
  className = '',
}) => {
  // Sizing definitions for the spinning red ring
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-11 w-11 border-3',
    lg: 'h-16 w-16 border-4',
  };

  const spinner = (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      {/* Modern Spinning Red Ring */}
      <div
        className={[
          'animate-spin rounded-full border-solid border-primary/15 border-t-primary shadow-xs',
          sizeClasses[size],
        ].join(' ')}
        role="status"
        aria-label="loading"
      />
      {text && (
        <span className="mt-4 text-[13px] font-semibold text-foreground/80 tracking-wide animate-pulse">
          {text}
        </span>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md transition-colors duration-300">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center p-8 w-full min-h-[120px]">{spinner}</div>;
};

export default Loading;
