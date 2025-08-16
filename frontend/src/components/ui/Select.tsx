import React from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  helpText?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = '', label, error, helpText, options, placeholder, id, ...props }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    
    const baseStyles = 'block w-full rounded-lg border-gray-300 shadow-sm transition-colors duration-200 focus:border-primary-500 focus:ring-primary-500 sm:text-sm appearance-none bg-white pr-10';
    const errorStyles = error ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500' : '';
    
    const selectClasses = `${baseStyles} ${errorStyles} ${className}`;
    
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={selectClasses}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option 
                key={option.value} 
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          
          <div className="absolute inset-y-0 right-0 flex items-center">
            {error ? (
              <div className="pr-8 flex items-center pointer-events-none">
                <AlertCircle className="h-5 w-5 text-danger-500" />
              </div>
            ) : null}
            <div className="pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
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

Select.displayName = 'Select';

export default Select;