import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  className?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
  text
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colorClasses = {
    primary: 'text-green-500',
    secondary: 'text-green-600',
    white: 'text-white',
    gray: 'text-gray-500'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        <div
          className={`animate-spin rounded-full border-2 border-gray-200 ${sizeClasses[size]}`}
        >
          <div
            className={`absolute inset-0 rounded-full border-2 border-transparent border-t-current ${colorClasses[color]}`}
          />
        </div>
      </div>
      {text && (
        <p className={`mt-2 ${textSizeClasses[size]} ${colorClasses[color]} font-medium`}>
          {text}
        </p>
      )}
    </div>
  );
};

// Overlay Loading Spinner for full-screen loading
export const LoadingOverlay: React.FC<{
  isVisible: boolean;
  text?: string;
  backdrop?: boolean;
}> = ({ isVisible, text = 'Loading...', backdrop = true }) => {
  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        backdrop ? 'bg-black bg-opacity-50' : ''
      }`}
    >
      <div className="bg-white rounded-lg p-6 shadow-xl">
        <LoadingSpinner size="lg" text={text} />
      </div>
    </div>
  );
};

// Inline Loading Spinner for buttons
export const ButtonSpinner: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`inline-block ${className}`}>
    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
  </div>
);

// Page Loading Spinner
export const PageSpinner: React.FC<{ text?: string }> = ({ text = 'Loading page...' }) => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="xl" text={text} />
  </div>
);

export default LoadingSpinner;