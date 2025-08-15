import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Debounce function to limit the rate of function calls
 * @param {Function} func
 * @param {number} wait
 * @returns {Function}
 */
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Check if array contains any of the given values (case insensitive)
 * @param {string[]} array
 * @param {string[]} values
 * @returns {boolean}
 */
export function arrayContainsAny(array, values) {
  if (!array || !values) return false
  const lowerArray = array.map(item => item.toLowerCase())
  return values.some(value => lowerArray.includes(value.toLowerCase()))
}

/**
 * Filter array by search term
 * @param {string[]} array
 * @param {string} searchTerm
 * @returns {string[]}
 */
export function filterArrayBySearch(array, searchTerm) {
  if (!searchTerm) return array
  const term = searchTerm.toLowerCase()
  return array.filter(item => item.toLowerCase().includes(term))
}

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Generate random string
 * @param {number} length
 * @returns {string}
 */
export function generateRandomString(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Format date for display
 * @param {Date|string} date
 * @returns {string}
 */
export function formatDate(date) {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Calculate time remaining until reset
 * @param {Date|string} resetTime
 * @returns {string}
 */
export function getTimeUntilReset(resetTime) {
  const now = new Date()
  const reset = new Date(resetTime)
  const diff = reset.getTime() - now.getTime()
  
  if (diff <= 0) return 'Now'
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

/**
 * Deep clone an object
 * @param {any} obj
 * @returns {any}
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (obj instanceof Object) {
    const cloned = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key])
      }
    }
    return cloned
  }
}

/**
 * Remove duplicates from array
 * @param {any[]} array
 * @param {string} key - Optional key for object arrays
 * @returns {any[]}
 */
export function removeDuplicates(array, key = null) {
  if (!key) {
    return [...new Set(array)]
  }
  
  const seen = new Set()
  return array.filter(item => {
    const value = item[key]
    if (seen.has(value)) {
      return false
    }
    seen.add(value)
    return true
  })
}

/**
 * Sort array of objects by key
 * @param {any[]} array
 * @param {string} key
 * @param {string} direction - 'asc' or 'desc'
 * @returns {any[]}
 */
export function sortBy(array, key, direction = 'asc') {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
}

/**
 * Check if running in development mode
 * @returns {boolean}
 */
export function isDevelopment() {
  return import.meta.env.MODE === 'development'
}

/**
 * Sleep/delay function
 * @param {number} ms
 * @returns {Promise}
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Utility function to merge Tailwind CSS classes
 * @param {...(string | undefined | null | boolean)} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Format email for display
 * @param {string} email
 * @returns {string}
 */
export function formatEmail(email) {
  if (!email) return ''
  const [username, domain] = email.split('@')
  if (username.length > 8) {
    return `${username.substring(0, 8)}...@${domain}`
  }
  return email
}

/**
 * Truncate text with ellipsis
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncate(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

/**
 * Format processing time
 * @param {number} milliseconds
 * @returns {string}
 */
export function formatProcessingTime(milliseconds) {
  if (milliseconds < 1000) {
    return `${Math.round(milliseconds)}ms`
  }
  const seconds = milliseconds / 1000
  return `${seconds.toFixed(1)}s`
}

/**
 * Format match score for display
 * @param {number} score
 * @returns {string}
 */
export function formatScore(score) {
  return score.toFixed(1)
}

/**
 * Get score percentage (out of 5.0)
 * @param {number} score
 * @returns {number}
 */
export function getScorePercentage(score) {
  return Math.round((score / 5.0) * 100)
}

/**
 * Capitalize first letter of each word
 * @param {string} str
 * @returns {string}
 */
export function capitalizeWords(str) {
  if (!str) return ''
  return str.replace(/\b\w/g, (l) => l.toUpperCase())
}

/**
 * Generate initials from name or email
 * @param {string} name
 * @returns {string}
 */
export function getInitials(name) {
  if (!name) return '??'
  
  // If it's an email, extract username part
  if (name.includes('@')) {
    name = name.split('@')[0]
  }
  
  // Split by common separators
  const words = name.split(/[\s._-]+/).filter(Boolean)
  
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  
  return name.substring(0, 2).toUpperCase()
}

/**
 * Generate a random color from a predefined set
 * @param {string} seed - String to generate consistent color
 * @returns {string}
 */
export function getAvatarColor(seed) {
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-teal-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-rose-500',
  ]
  
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i)
    hash = hash & hash // Convert to 32bit integer
  }
  
  return colors[Math.abs(hash) % colors.length]
}

/**
