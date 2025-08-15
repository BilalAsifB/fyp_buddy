import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils'
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline'

// Button Component
export const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  disabled = false,
  children, 
  ...props 
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5',
    secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-slate-500 border border-slate-200',
    outline: 'border border-primary-300 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    ghost: 'text-slate-600 hover:bg-slate-100 focus:ring-slate-500',
    danger: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500 shadow-lg hover:shadow-xl',
  }
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  }

  return (
    <button
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        (loading || disabled) && 'cursor-not-allowed',
        className
      )}
      disabled={loading || disabled}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  )
})

Button.displayName = 'Button'

// Input Component
export const Input = React.forwardRef(({ 
  className, 
  type = 'text',
  error = false,
  helperText,
  label,
  required = false,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={cn(
          'w-full px-4 py-3 text-sm border rounded-lg transition-colors duration-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0',
          error 
            ? 'border-error-300 focus:ring-error-500 focus:border-error-500' 
            : 'border-slate-300 focus:ring-primary-500 focus:border-primary-500',
          className
        )}
        {...props}
      />
      {helperText && (
        <p className={cn(
          'mt-1 text-xs',
          error ? 'text-error-600' : 'text-slate-500'
        )}>
          {helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

// Textarea Component
export const Textarea = React.forwardRef(({ 
  className, 
  error = false,
  helperText,
  label,
  required = false,
  rows = 4,
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          'w-full px-4 py-3 text-sm border rounded-lg transition-colors duration-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 resize-none',
          error 
            ? 'border-error-300 focus:ring-error-500 focus:border-error-500' 
            : 'border-slate-300 focus:ring-primary-500 focus:border-primary-500',
          className
        )}
        {...props}
      />
      {helperText && (
        <p className={cn(
          'mt-1 text-xs',
          error ? 'text-error-600' : 'text-slate-500'
        )}>
          {helperText}
        </p>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

// Select Component
export const Select = React.forwardRef(({ 
  className, 
  error = false,
  helperText,
  label,
  required = false,
  options = [],
  placeholder = 'Select an option...',
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={cn(
          'w-full px-4 py-3 text-sm border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 bg-white',
          error 
            ? 'border-error-300 focus:ring-error-500 focus:border-error-500' 
            : 'border-slate-300 focus:ring-primary-500 focus:border-primary-500',
          className
        )}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helperText && (
        <p className={cn(
          'mt-1 text-xs',
          error ? 'text-error-600' : 'text-slate-500'
        )}>
          {helperText}
        </p>
      )}
    </div>
  )
})

Select.displayName = 'Select'

// Badge Component
export const Badge = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className,
  ...props 
}) => {
  const variants = {
    primary: 'bg-primary-100 text-primary-800 border-primary-200',
    secondary: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-success-100 text-success-800 border-success-200',
    warning: 'bg-warning-100 text-warning-800 border-warning-200',
    error: 'bg-error-100 text-error-800 border-error-200',
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

// Card Component
export const Card = ({ 
  children, 
  className,
  hover = false,
  ...props 
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-xl shadow-sm border border-slate-200 p-6',
        hover && 'hover:shadow-md transition-all duration-200 hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Alert Component
export const Alert = ({ 
  children, 
  variant = 'info',
  dismissible = false,
  onDismiss,
  className,
  ...props 
}) => {
  const variants = {
    success: {
      container: 'bg-success-50 border-success-200 text-success-800',
      icon: CheckCircleIcon,
      iconColor: 'text-success-500',
    },
    error: {
      container: 'bg-error-50 border-error-200 text-error-800',
      icon: XCircleIcon,
      iconColor: 'text-error-500',
    },
    warning: {
      container: 'bg-warning-50 border-warning-200 text-warning-800',
      icon: ExclamationTriangleIcon,
      iconColor: 'text-warning-500',
    },
    info: {
      container: 'bg-primary-50 border-primary-200 text-primary-800',
      icon: InformationCircleIcon,
      iconColor: 'text-primary-500',
    },
  }

  const { container, icon: Icon, iconColor } = variants[variant]

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border',
        container,
        className
      )}
      {...props}
    >
      <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', iconColor)} />
      <div className="flex-1 text-sm">
        {children}
      </div>
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 ml-2 p-1 rounded-md hover:bg-black/10 transition-colors"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

// Loading Spinner Component
export const Spinner = ({ 
  size = 'md', 
  className,
  ...props 
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  }

  return (
    <div className={cn('flex justify-center items-center', className)} {...props}>
      <svg 
        className={cn('animate-spin', sizes[size])} 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4" 
        />
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
        />
      </svg>
    </div>
  )
}

// Progress Bar Component
export const ProgressBar = ({ 
  value, 
  max = 100, 
  className,
  showPercentage = false,
  color = 'primary',
  ...props 
}) => {
  const percentage = Math.min((value / max) * 100, 100)
  
  const colors = {
    primary: 'bg-primary-600',
    success: 'bg-success-600',
    warning: 'bg-warning-600',
    error: 'bg-error-600',
  }

  return (
    <div className={cn('w-full', className)} {...props}>
      <div className="flex justify-between items-center mb-1">
        {showPercentage && (
          <span className="text-sm font-medium text-slate-700">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <motion.div
          className={cn('h-2 rounded-full', colors[color])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  )
}

// Modal Component
export const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  title,
  size = 'md',
  ...props 
}) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={cn(
              'relative w-full bg-white rounded-xl shadow-xl',
              sizes[size]
            )}
            {...props}
          >
            {title && (
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            )}
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// Skeleton Component
export const Skeleton = ({ 
  className,
  lines = 1,
  ...props 
}) => {
  return (
    <div className={cn('space-y-3', className)} {...props}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="h-4 bg-slate-200 rounded shimmer"
          style={{
            width: `${Math.random() * 40 + 60}%`,
          }}
        />
      ))}
    </div>
  )
}

// Empty State Component
export const EmptyState = ({ 
  title, 
  description, 
  action,
  icon: Icon,
  className,
  ...props 
}) => {
  return (
    <div className={cn('text-center py-12', className)} {...props}>
      {Icon && (
        <div className="mx-auto h-12 w-12 text-slate-400 mb-4">
          <Icon />
        </div>
      )}
      <h3 className="text-lg font-medium text-slate-900 mb-2">{title}</h3>
      {description && (
        <p className="text-slate-500 mb-6 max-w-md mx-auto">{description}</p>
      )}
      {action}
    </div>
  )
}
