import React from 'react'
import { motion } from 'framer-motion'
import { 
  HeartIcon, 
  CodeBracketIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/utils'
import { APP_CONFIG } from '@/constants'
import { useApiHealth } from '@/hooks'

// Header Component
export const Header = ({ className, ...props }) => {
  const { status, loading } = useApiHealth()

  const getStatusIcon = () => {
    if (loading) return <ClockIcon className="h-4 w-4 text-warning-500 animate-pulse" />
    if (status === 'healthy') return <CheckCircleIcon className="h-4 w-4 text-success-500" />
    return <XCircleIcon className="h-4 w-4 text-error-500" />
  }

  const getStatusText = () => {
    if (loading) return 'Checking...'
    if (status === 'healthy') return 'Online'
    return 'Offline'
  }

  return (
    <header className={cn('bg-white border-b border-slate-200 sticky top-0 z-40', className)} {...props}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg"
            >
              <CodeBracketIcon className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{APP_CONFIG.name}</h1>
              <p className="text-xs text-slate-500">{APP_CONFIG.description}</p>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-slate-50 rounded-full">
            {getStatusIcon()}
            <span className="text-sm font-medium text-slate-700">{getStatusText()}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

// Footer Component
export const Footer = ({ className, ...props }) => {
  return (
    <footer className={cn('bg-slate-50 border-t border-slate-200 mt-auto', className)} {...props}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-sm text-slate-600">Made with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <HeartIcon className="h-4 w-4 text-error-500 fill-current" />
            </motion.div>
            <span className="text-sm text-slate-600">for FYP students</span>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-slate-500">
              Connecting students for successful Final Year Projects
            </p>
            <p className="text-xs text-slate-400">
              Version {APP_CONFIG.version} • Built with React & FastAPI
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Main Layout Component
export const Layout = ({ children, className, ...props }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <main className={cn('flex-1 relative', className)} {...props}>
        {children}
      </main>
      <Footer />
    </div>
  )
}

// Container Component
export const Container = ({ 
  children, 
  size = 'default',
  className,
  ...props 
}) => {
  const sizes = {
    sm: 'max-w-3xl',
    default: 'max-w-5xl',
    lg: 'max-w-7xl',
    full: 'max-w-full',
  }

  return (
    <div 
      className={cn(
        'mx-auto px-4 sm:px-6 lg:px-8',
        sizes[size],
        className
      )} 
      {...props}
    >
      {children}
    </div>
  )
}

// Section Component
export const Section = ({ 
  children, 
  className,
  spacing = 'default',
  ...props 
}) => {
  const spacings = {
    sm: 'py-8',
    default: 'py-12',
    lg: 'py-16',
    xl: 'py-20',
  }

  return (
    <section 
      className={cn(
        spacings[spacing],
        className
      )} 
      {...props}
    >
      {children}
    </section>
  )
}

// Page Header Component
export const PageHeader = ({ 
  title, 
  description, 
  action,
  breadcrumbs,
  className,
  ...props 
}) => {
  return (
    <div className={cn('pb-8', className)} {...props}>
      {breadcrumbs && (
        <nav className="mb-4">
          <ol className="flex items-center space-x-2 text-sm text-slate-500">
            {breadcrumbs.map((breadcrumb, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && <span className="mx-2">/</span>}
                {breadcrumb.href ? (
                  <a href={breadcrumb.href} className="hover:text-slate-700 transition-colors">
                    {breadcrumb.label}
                  </a>
                ) : (
                  <span className="text-slate-700 font-medium">{breadcrumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
          {description && (
            <p className="mt-2 text-lg text-slate-600">{description}</p>
          )}
        </div>
        {action && <div className="ml-4">{action}</div>}
      </div>
    </div>
  )
}

// Grid Component
export const Grid = ({ 
  children, 
  columns = { default: 1, md: 2, lg: 3 },
  gap = 'default',
  className,
  ...props 
}) => {
  const gapSizes = {
    sm: 'gap-4',
    default: 'gap-6',
    lg: 'gap-8',
  }

  const getColumnClasses = () => {
    if (typeof columns === 'number') {
      return `grid-cols-${columns}`
    }
    
    let classes = []
    if (columns.default) classes.push(`grid-cols-${columns.default}`)
    if (columns.sm) classes.push(`sm:grid-cols-${columns.sm}`)
    if (columns.md) classes.push(`md:grid-cols-${columns.md}`)
    if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`)
    if (columns.xl) classes.push(`xl:grid-cols-${columns.xl}`)
    
    return classes.join(' ')
  }

  return (
    <div 
      className={cn(
        'grid',
        getColumnClasses(),
        gapSizes[gap],
        className
      )} 
      {...props}
    >
      {children}
    </div>
  )
}

// Sidebar Layout Component
export const SidebarLayout = ({ 
  children, 
  sidebar, 
  sidebarPosition = 'left',
  sidebarWidth = 'default',
  className,
  ...props 
}) => {
  const widths = {
    sm: 'w-64',
    default: 'w-80',
    lg: 'w-96',
  }

  return (
    <div className={cn('flex gap-8', className)} {...props}>
      {sidebarPosition === 'left' && sidebar && (
        <aside className={cn('flex-shrink-0', widths[sidebarWidth])}>
          {sidebar}
        </aside>
      )}
      
      <main className="flex-1 min-w-0">
        {children}
      </main>
      
      {sidebarPosition === 'right' && sidebar && (
        <aside className={cn('flex-shrink-0', widths[sidebarWidth])}>
          {sidebar}
        </aside>
      )}
    </div>
  )
}

// Animated Page Wrapper
export const AnimatedPage = ({ 
  children, 
  className,
  delay = 0,
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Sticky Container Component
export const StickyContainer = ({ 
  children, 
  className,
  offset = 0,
  ...props 
}) => {
  return (
    <div 
      className={cn('sticky', className)} 
      style={{ top: offset }}
      {...props}
    >
      {children}
    </div>
  )
}
