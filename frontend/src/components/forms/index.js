import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { XMarkIcon, PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { cn, debounce, filterArrayBySearch } from '@/utils'
import { Input, Button, Badge } from '@/components/ui'

// Multi-Select Tag Input Component
export const TagInput = ({ 
  value = [], 
  onChange, 
  suggestions = [], 
  placeholder = 'Add tags...',
  maxTags = 20,
  label,
  required = false,
  error,
  helperText,
  className,
  ...props 
}) => {
  const [inputValue, setInputValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState(suggestions)
  const inputRef = useRef(null)

  // Debounced search function
  const debouncedSearch = debounce((searchTerm) => {
    const filtered = filterArrayBySearch(suggestions, searchTerm)
      .filter(item => !value.includes(item))
      .slice(0, 10) // Limit suggestions
    setFilteredSuggestions(filtered)
  }, 200)

  const handleInputChange = (e) => {
    const newValue = e.target.value
    setInputValue(newValue)
    setIsOpen(true)
    debouncedSearch(newValue)
  }

  const handleAddTag = (tag) => {
    if (tag && !value.includes(tag) && value.length < maxTags) {
      onChange([...value, tag])
      setInputValue('')
      setIsOpen(false)
      inputRef.current?.focus()
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    onChange(value.filter(tag => tag !== tagToRemove))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      handleAddTag(inputValue.trim())
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      handleRemoveTag(value[value.length - 1])
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div className={cn('relative w-full', className)} {...props}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      <div
        className={cn(
          'min-h-[48px] w-full border rounded-lg p-2 bg-white transition-colors duration-200',
          error 
            ? 'border-error-300 focus-within:ring-2 focus-within:ring-error-500 focus-within:border-error-500' 
            : 'border-slate-300 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500'
        )}
      >
        <div className="flex flex-wrap gap-1 mb-1">
          {value.map((tag, index) => (
            <motion.div
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1 bg-primary-100 text-primary-800 px-2 py-1 rounded-md text-sm"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="hover:bg-primary-200 rounded p-0.5 transition-colors"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </motion.div>
          ))}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={value.length === 0 ? placeholder : ''}
          disabled={value.length >= maxTags}
          className="w-full border-none outline-none bg-transparent text-sm placeholder-slate-400"
        />
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && (inputValue || filteredSuggestions.length > 0) && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {inputValue && !suggestions.includes(inputValue) && !value.includes(inputValue) && (
            <button
              type="button"
              onClick={() => handleAddTag(inputValue)}
              className="w-full px-4 py-2 text-left hover:bg-slate-50 flex items-center gap-2 text-sm"
            >
              <PlusIcon className="h-4 w-4 text-primary-500" />
              Add "{inputValue}"
            </button>
          )}
          
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleAddTag(suggestion)}
              className="w-full px-4 py-2 text-left hover:bg-slate-50 text-sm"
            >
              {suggestion}
            </button>
          ))}
          
          {filteredSuggestions.length === 0 && inputValue && (
            <div className="px-4 py-2 text-sm text-slate-500">
              No suggestions found
            </div>
          )}
        </div>
      )}

      {/* Helper Text */}
      {(helperText || error) && (
        <p className={cn(
          'mt-1 text-xs',
          error ? 'text-error-600' : 'text-slate-500'
        )}>
          {error || helperText} 
          {!error && (
            <span className="ml-1 text-slate-400">
              ({value.length}/{maxTags})
            </span>
          )}
        </p>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

// Searchable Select Component
export const SearchableSelect = ({
  value,
  onChange,
  options = [],
  placeholder = 'Search and select...',
  label,
  required = false,
  error,
  helperText,
  className,
  ...props
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef(null)

  const filteredOptions = filterArrayBySearch(options, searchTerm)

  const handleSelect = (option) => {
    onChange(option.value)
    setSearchTerm('')
    setIsOpen(false)
  }

  const selectedOption = options.find(opt => opt.value === value)

  return (
    <div className={cn('relative w-full', className)} {...props}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={isOpen ? searchTerm : (selectedOption?.label || '')}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setIsOpen(true)
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className={cn(
              'w-full px-4 py-3 pr-10 text-sm border rounded-lg transition-colors duration-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0',
              error 
                ? 'border-error-300 focus:ring-error-500 focus:border-error-500' 
                : 'border-slate-300 focus:ring-primary-500 focus:border-primary-500'
            )}
          />
          <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        </div>

        {/* Options Dropdown */}
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={cn(
                    'w-full px-4 py-2 text-left hover:bg-slate-50 text-sm transition-colors',
                    value === option.value && 'bg-primary-50 text-primary-700'
                  )}
                >
                  {option.label}
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-slate-500">
                No options found
              </div>
            )}
          </div>
        )}
      </div>

      {helperText && (
        <p className={cn(
          'mt-1 text-xs',
          error ? 'text-error-600' : 'text-slate-500'
        )}>
          {helperText}
        </p>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

// Character Counter Component
export const CharacterCounter = ({ 
  current, 
  max, 
  className,
  showOnlyWhenNearLimit = true,
  warningThreshold = 0.8,
  ...props 
}) => {
  const percentage = current / max
  const isNearLimit = percentage >= warningThreshold
  const isOverLimit = current > max

  if (showOnlyWhenNearLimit && !isNearLimit && !isOverLimit) {
    return null
  }

  return (
    <div className={cn('text-xs text-right', className)} {...props}>
      <span className={cn(
        'font-medium',
        isOverLimit 
          ? 'text-error-600' 
          : isNearLimit 
            ? 'text-warning-600' 
            : 'text-slate-500'
      )}>
        {current}/{max}
      </span>
    </div>
  )
}

// Form Section Component
export const FormSection = ({ 
  title, 
  description, 
  children, 
  className,
  ...props 
}) => {
  return (
    <div className={cn('space-y-6', className)} {...props}>
      {(title || description) && (
        <div className="border-b border-slate-200 pb-4">
          {title && (
            <h3 className="text-lg font-medium text-slate-900">{title}</h3>
          )}
          {description && (
            <p className="mt-1 text-sm text-slate-600">{description}</p>
          )}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}

// Form Field Group Component
export const FieldGroup = ({ 
  children, 
  columns = 1,
  className,
  ...props 
}) => {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
  }

  return (
    <div 
      className={cn(
        'grid gap-4',
        columnClasses[columns],
        className
      )} 
      {...props}
    >
      {children}
    </div>
  )
}
