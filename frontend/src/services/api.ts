import axios, { AxiosInstance, AxiosError } from 'axios';
import toast from 'react-hot-toast';
import {
  ProfileRequest,
  MatchingResponse,
  HealthResponse,
  RateLimitResponse,
  ErrorResponse,
  ApiError
} from './types';

class ApiService {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 120000, // 2 minutes for potentially long-running matching requests
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add timestamp for debugging
        config.metadata = { startTime: new Date() };
        
        if (process.env.REACT_APP_ENABLE_CONSOLE_LOGS === 'true') {
          console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(this.handleError(error));
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        const duration = new Date().getTime() - response.config.metadata?.startTime?.getTime();
        
        if (process.env.REACT_APP_ENABLE_CONSOLE_LOGS === 'true') {
          console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`);
        }
        
        return response;
      },
      (error) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): ApiError {
    let apiError: ApiError = {
      message: 'An unexpected error occurred',
      status: 500
    };

    if (error.response) {
      // Server responded with error status
      const errorData = error.response.data as ErrorResponse;
      
      apiError = {
        message: errorData.message || `Server error: ${error.response.status}`,
        status: error.response.status,
        details: errorData.details || errorData
      };

      // Handle specific error types
      switch (error.response.status) {
        case 422:
          apiError.message = 'Please check your input data for errors';
          break;
        case 429:
          apiError.message = 'You have exceeded the daily API limit. Please try again tomorrow.';
          break;
        case 503:
          apiError.message = 'Service temporarily unavailable. Please try again later.';
          break;
        case 500:
          apiError.message = 'Internal server error. Please try again later.';
          break;
      }
    } else if (error.request) {
      // Network error
      apiError = {
        message: 'Unable to connect to the server. Please check your internet connection.',
        status: 0
      };
    } else {
      // Request setup error
      apiError = {
        message: error.message || 'Failed to make request',
        status: 0
      };
    }

    if (process.env.REACT_APP_ENABLE_CONSOLE_LOGS === 'true') {
      console.error('❌ API Error:', apiError);
    }

    return apiError;
  }

  // Health check
  async healthCheck(): Promise<HealthResponse> {
    try {
      const response = await this.client.get<HealthResponse>('/health');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Find student matches
  async findMatches(profileData: ProfileRequest): Promise<MatchingResponse> {
    try {
      // Show loading toast
      const loadingToast = toast.loading('Finding your perfect study buddies... This may take up to 60 seconds.');
      
      try {
        const response = await this.client.post<MatchingResponse>(
          `/api/v1/matching/find`,
          profileData
        );
        
        toast.dismiss(loadingToast);
        
        if (response.data.success) {
          toast.success(`Found ${response.data.total_matches} potential matches!`);
        } else {
          toast.error(response.data.message);
        }
        
        return response.data;
      } catch (error) {
        toast.dismiss(loadingToast);
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }

  // Validate profile without matching
  async validateProfile(profileData: ProfileRequest): Promise<any> {
    try {
      const response = await this.client.post(
        `/api/v1/matching/validate`,
        profileData
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get rate limit status
  async getRateLimitStatus(): Promise<RateLimitResponse> {
    try {
      const response = await this.client.get<RateLimitResponse>(
        `/api/v1/matching/rate-limit`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Get matching statistics
  async getMatchingStats(): Promise<any> {
    try {
      const response = await this.client.get(`/api/v1/matching/stats`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      await this.healthCheck();
      return true;
    } catch {
      return false;
    }
  }
}

// Create singleton instance
export const apiService = new ApiService();

// Export default
export default apiService;