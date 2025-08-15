import axios from 'axios'
import toast from 'react-hot-toast'
import { API_BASE_URL, API_ENDPOINTS } from '@/constants'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutes timeout for matching requests
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      }
    }
    
    // Log request in development
    if (import.meta.env.MODE === 'development') {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      })
    }
    
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.MODE === 'development') {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      })
    }
    
    return response
  },
  (error) => {
    console.error('❌ Response Error:', error)
    
    // Handle different error types
    if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please try again.')
    } else if (error.response?.status === 429) {
      toast.error('Rate limit exceeded. Please try again later.')
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.')
    } else if (error.response?.status === 422) {
      const errorData = error.response.data
      if (errorData.details && Array.isArray(errorData.details)) {
        // Show validation errors
        errorData.details.forEach(detail => {
          toast.error(`${detail.field}: ${detail.message}`)
        })
      } else {
        toast.error(errorData.message || 'Validation error')
      }
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message)
    } else if (!error.response) {
      toast.error('Network error. Please check your connection.')
    }
    
    return Promise.reject(error)
  }
)

// API Service Class
class ApiService {
  /**
   * Check API health
   */
  async checkHealth() {
    try {
      const response = await api.get(API_ENDPOINTS.HEALTH)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Get detailed health information
   */
  async getDetailedHealth() {
    try {
      const response = await api.get(`${API_ENDPOINTS.HEALTH}/detailed`)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Find matches for a student profile
   * @param {Object} profileData - Student profile data
   */
  async findMatches(profileData) {
    try {
      const response = await api.post(API_ENDPOINTS.MATCHING.FIND, profileData)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
        status: error.response?.status,
      }
    }
  }

  /**
   * Validate profile without performing matching
   * @param {Object} profileData - Student profile data
   */
  async validateProfile(profileData) {
    try {
      const response = await api.post(API_ENDPOINTS.MATCHING.VALIDATE, profileData)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || error.message,
      }
    }
  }

  /**
   * Get current rate limit status
   */
  async getRateLimitStatus() {
    try {
      const response = await api.get(API_ENDPOINTS.MATCHING.RATE_LIMIT)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Get matching statistics
   */
  async getMatchingStats() {
    try {
      const response = await api.get(API_ENDPOINTS.MATCHING.STATS)
      return { success: true, data: response.data }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

// Export singleton instance
export const apiService = new ApiService()
export default api
