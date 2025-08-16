import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helpText?: string;
  characterLimit?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', label, error, helpText, characterLimit, id, value, ...props }, ref) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const characterCount = typeof value === 'string' ? value.length : 0;
    
    const baseStyles = 'block w-full rounded-lg border-gray-300 shadow-sm transition-colors duration-200 focus:border-primary-500 focus:ring-primary-500 sm:text-sm resize-vertical';
    const errorStyles = error ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500' : '';
    
    const textareaClasses = `${baseStyles} ${errorStyles} ${className}`;
    
    return (
      <div className="space-y-1">
        {label && (
          <div className="flex justify-between items-center">
            <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700">
              {label}
            </label>
            {characterLimit && (
              <span className={`text-xs ${characterCount > characterLimit ? 'text-danger-600' : 'text-gray-500'}`}>
                {characterCount}/{characterLimit}
              </span>
            )}
          </div>
        )}
        
        <div className="relative">
          <textarea
            ref={ref}
            id={textareaId}
            className={textareaClasses}
            value={value}
            {...props}
          />
          
          {error && (
            <div className="absolute top-3 right-3 flex items-center pointer-events-none">
              <AlertCircle className="h-5 w-5 text-danger-500" />
            </div>
          )}
        </div>
        
        {error && (
          <p className="text-sm text-danger-600 flex items-center space-x-1">
            <span>{error}</span>
          </p>
        )}
        
        {helpText && !error && (
          <p className="text-sm text-gray-500">{helpText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;