import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface TechStackInputProps {
  label?: string;
  value: string[];
  onChange: (value: string[]) => void;
  suggestions?: readonly string[];
  error?: string;
  helpText?: string;
  maxItems?: number;
  placeholder?: string;
}

const TechStackInput: React.FC<TechStackInputProps> = ({
  label,
  value,
  onChange,
  suggestions = [],
  error,
  helpText,
  maxItems = 25,
  placeholder = "Type and press Enter to add..."
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputValue.trim() && suggestions.length > 0) {
      const filtered = suggestions
        .filter(suggestion => 
          suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
          !value.includes(suggestion)
        )
        .slice(0, 8); // Limit suggestions for performance
      
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [inputValue, value, suggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addItem = (item: string) => {
    const trimmedItem = item.trim();
    
    if (!trimmedItem) return;
    
    if (value.includes(trimmedItem)) {
      setInputValue('');
      return;
    }
    
    if (value.length >= maxItems) {
      setInputValue('');
      return;
    }
    
    onChange([...value, trimmedItem]);
    setInputValue('');
    setShowSuggestions(false);
  };

  const removeItem = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeItem(value.length - 1);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    addItem(suggestion);
    inputRef.current?.focus();
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          <span className="text-xs text-gray-500">
            {value.length}/{maxItems}
          </span>
        </div>
      )}

      <div ref={containerRef} className="relative">
        {/* Tags Display */}
        <div className={`
          min-h-[42px] p-3 border rounded-lg bg-white transition-colors duration-200
          ${error ? 'border-danger-300 focus-within:border-danger-500 focus-within:ring-danger-500' : 
            'border-gray-300 focus-within:border-primary-500 focus-within:ring-primary-500'}
          focus-within:ring-1
        `}>
          <div className="flex flex-wrap gap-2 items-center">
            {value.map((item, index) => (
              <Badge 
                key={index} 
                variant="primary" 
                className="flex items-center space-x-1 pl-2 pr-1"
              >
                <span className="text-xs">{item}</span>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="ml-1 hover:bg-primary-200 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(filteredSuggestions.length > 0)}
              placeholder={value.length === 0 ? placeholder : ''}
              disabled={value.length >= maxItems}
              className="flex-1 min-w-[120px] outline-none bg-transparent text-sm"
            />
            
            {value.length < maxItems && inputValue && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => addItem(inputValue)}
                className="p-1 h-6 w-6"
              >
                <Plus className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Error Icon */}
        {error && (
          <div className="absolute top-3 right-3 flex items-center pointer-events-none">
            <AlertCircle className="h-5 w-5 text-danger-500" />
          </div>
        )}

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none first:rounded-t-lg last:rounded-b-lg"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-danger-600 flex items-center space-x-1">
          <span>{error}</span>
        </p>
      )}

      {/* Help Text */}
      {helpText && !error && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}

      {/* Max Items Warning */}
      {value.length >= maxItems && (
        <p className="text-xs text-warning-600">
          Maximum {maxItems} items reached. Remove some items to add more.
        </p>
      )}
    </div>
  );
};

export default TechStackInput;