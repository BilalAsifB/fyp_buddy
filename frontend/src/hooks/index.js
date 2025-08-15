import { useState, useEffect, useCallback, useRef } from 'react'
import { apiService } from '@/services/api'
import { debounce } from '@/utils'

/**
 * Hook for managing API health status
 */
export function useApiHealth() {
  const [health, setHealth] = useState({
    status: 'unknown',
    loading: true,
    error: null,
    lastChecked: null,
    data: null,
  })

  const checkHealth = useCallback(async () => {
    setHealth(prev => ({ ...prev, loading: true, error: null }))
    try {
      const result = await apiService.checkHealth()
      setHealth({
        status: result.success ? 'healthy' : 'unhealthy',
        loading: false,
        error: result.success ? null : result.error,
        lastChecked: new Date(),
        data: result.data ?? null,
      })
    } catch (err) {
      setHealth({
        status: 'unhealthy',
        loading: false,
        error: err.message ?? 'Unknown error',
        lastChecked: new Date(),
        data: null,
      })
    }
  }, [])

  useEffect(() => {
    checkHealth()
    const interval = setInterval(checkHealth, 30000)
    return () => clearInterval(interval)
  }, [checkHealth])

  return { ...health, refetch: checkHealth }
}

/**
 * Hook for managing matching statistics
 */
export function useMatchingStats() {
  const [stats, setStats] = useState({
    data: null,
    loading: true,
    error: null,
  })

  const fetchStats = useCallback(async () => {
    setStats(prev => ({ ...prev, loading: true, error: null }))
    try {
      const result = await apiService.getMatchingStats()
      setStats({
        data: result.success ? result.data : null,
        loading: false,
        error: result.success ? null : result.error,
      })
    } catch (err) {
      setStats({ data: null, loading: false, error: err.message })
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return { ...stats, refetch: fetchStats }
}

/**
 * Hook for managing rate limit status
 */
export function useRateLimit() {
  const [rateLimit, setRateLimit] = useState({
    data: null,
    loading: true,
    error: null,
  })

  const fetchRateLimit = useCallback(async () => {
    try {
      const result = await apiService.getRateLimitStatus()
      setRateLimit({
        data: result.success ? result.data : null,
        loading: false,
        error: result.success ? null : result.error,
      })
    } catch (err) {
      setRateLimit({ data: null, loading: false, error: err.message })
    }
  }, [])

  useEffect(() => {
    fetchRateLimit()
  }, [fetchRateLimit])

  return { ...rateLimit, refetch: fetchRateLimit }
}

/**
 * Hook for finding matches
 */
export function useMatching() {
  const [matching, setMatching] = useState({
    data: null,
    loading: false,
    error: null,
    progress: 0,
  })

  const findMatches = useCallback(async (profileData) => {
    setMatching({ data: null, loading: true, error: null, progress: 0 })
    const progressInterval = setInterval(() => {
      setMatching(prev => ({
        ...prev,
        progress: Math.min(prev.progress + Math.random() * 20, 90),
      }))
    }, 2000)

    try {
      const result = await apiService.findMatches(profileData)
      clearInterval(progressInterval)
      setMatching({
        data: result.success ? result.data : null,
        loading: false,
        error: result.success ? null : result.error,
        progress: 100,
      })
      return result
    } catch (error) {
      clearInterval(progressInterval)
      setMatching({
        data: null,
        loading: false,
        error: error.message,
        progress: 0,
      })
      return { success: false, error: error.message }
    }
  }, [])

  const reset = useCallback(() => {
    setMatching({ data: null, loading: false, error: null, progress: 0 })
  }, [])

  return { ...matching, findMatches, reset }
}

/**
 * Hook for form validation with debounced validation
 */
export function useFormValidation(validationSchema, initialData = {}) {
  const [data, setData] = useState(initialData)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isValid, setIsValid] = useState(false)

  const validateField = useCallback((fieldName, value) => {
    try {
      const testData = { ...data, [fieldName]: value }
      validationSchema.parse(testData)
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    } catch (error) {
      const fieldError = error.errors?.find(err =>
        err.path.join('.') === fieldName
      )
      if (fieldError) {
        setErrors(prev => ({ ...prev, [fieldName]: fieldError.message }))
      }
    }
  }, [data, validationSchema])

  const debouncedValidateRef = useRef(debounce(validateField, 300))

  useEffect(() => {
    debouncedValidateRef.current = debounce(validateField, 300)
  }, [validateField])

  const setValue = useCallback((fieldName, value) => {
    setData(prev => ({ ...prev, [fieldName]: value }))
    setTouched(prev => ({ ...prev, [fieldName]: true }))
    debouncedValidateRef.current(fieldName, value)
  }, [])

  const validateForm = useCallback(() => {
    try {
      validationSchema.parse(data)
      setErrors({})
      return true
    } catch (error) {
      const newErrors = {}
      error.errors?.forEach(err => {
        const path = err.path.join('.')
        newErrors[path] = err.message
      })
      setErrors(newErrors)
      return false
    }
  }, [data, validationSchema])

  useEffect(() => {
    const hasNoErrors = Object.keys(errors).length === 0
    const hasRequiredFields = Object.keys(data).length > 0
    setIsValid(hasNoErrors && hasRequiredFields)
  }, [errors, data])

  return {
    data,
    errors,
    touched,
    isValid,
    setValue,
    validateForm,
    setData,
    setErrors,
  }
}

/**
 * Hook for managing local storage
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch {}
  }, [key, storedValue])

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)
    } catch {}
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}

/**
 * Hook for managing previous values
 */
export function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

/**
 * Hook for managing window size
 */
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  })

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}

/**
 * Hook for detecting clicks outside an element
 */
export function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return
      handler(event)
    }
    document.addEventListener('mousedown', listener)
    document.addEventListener('touchstart', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
      document.removeEventListener('touchstart', listener)
    }
  }, [ref, handler])
}

/**
 * Hook for managing async operations
 */
export function useAsync() {
  const [state, setState] = useState({
    loading: false,
    error: null,
    data: null,
  })

  const execute = useCallback(async (asyncFunction) => {
    setState({ loading: true, error: null, data: null })
    try {
      const result = await asyncFunction()
      setState({ loading: false, error: null, data: result })
      return result
    } catch (error) {
      setState({ loading: false, error: error.message, data: null })
      throw error
    }
  }, [])

  const reset = useCallback(() => {
    setState({ loading: false, error: null, data: null })
  }, [])

  return { ...state, execute, reset }
}
