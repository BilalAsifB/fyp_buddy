import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '', 
  text 
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };
  
  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };
  
  if (text) {
    return (
      <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
        <Loader2 className={`${sizes[size]} animate-spin text-primary-600`} />
        <p className={`${textSizes[size]} text-gray-600 font-medium`}>
          {text}
        </p>
      </div>
    );
  }
  
  return (
    <Loader2 className={`${sizes[size]} animate-spin text-primary-600 ${className}`} />
  );
};

export default LoadingSpinner;