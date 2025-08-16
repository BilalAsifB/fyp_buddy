import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';
import {
  ProfileRequest,
  MatchingResponse,
  HealthResponse,
  RateLimitResponse,
  ErrorResponse,
  ApiError
} from './types';

// ✅ Extend Axios config to include metadata
declare module 'axios' {
  export interface InternalAxiosRequestConfig<D = any> {
    metadata?: {
      startTime?: Date;
    };
  }
}

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
        const duration =
          new Date().getTime() -
          (response.config.metadata?.startTime?.getTime() || 0);

        if (process.env.REACT_APP_ENABLE_CONSOLE_LOGS === 'true') {
          console.log(
            `✅ API Response: ${response.config.method?.toUpperCase()} ${
              response.config.url
            } (${duration}ms)`
          );
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
      status: 500,
    };

    if (error.response) {
      const errorData = error.response.data as ErrorResponse;

      apiError = {
        message: errorData.message || `Server error: ${error.response.status}`,
        status: error.response.status,
        details: errorData.details || errorData,
      };

      switch (error.response.status) {
        case 422:
          apiError.message = 'Please check your input data for errors';
          break;
        case 429:
          apiError.message =
            'You have exceeded the daily API limit. Please try again tomorrow.';
          break;
        case 503:
          apiError.message =
            'Service temporarily unavailable. Please try again later.';
          break;
        case 500:
          apiError.message =
            'Internal server error. Please try again later.';
          break;
      }
    } else if (error.request) {
      apiError = {
        message:
          'Unable to connect to the server. Please check your internet connection.',
        status: 0,
      };
    } else {
      apiError = {
        message: error.message || 'Failed to make request',
        status: 0,
      };
    }

    if (process.env.REACT_APP_ENABLE_CONSOLE_LOGS === 'true') {
      console.error('❌ API Error:', apiError);
    }

    return apiError;
  }

  // Health check
  async healthCheck(): Promise<HealthResponse> {
    const response = await this.client.get<HealthResponse>('/health');
    return response.data;
  }

  // Find student matches
  async findMatches(profileData: ProfileRequest): Promise<MatchingResponse> {
    const loadingToast = toast.loading(
      'Finding your perfect study buddies... This may take up to 60 seconds.'
    );

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
  }

  async validateProfile(profileData: ProfileRequest): Promise<any> {
    const response = await this.client.post(
      `/api/v1/matching/validate`,
      profileData
    );
    return response.data;
  }

  async getRateLimitStatus(): Promise<RateLimitResponse> {
    const response = await this.client.get<RateLimitResponse>(
      `/api/v1/matching/rate-limit`
    );
    return response.data;
  }

  async getMatchingStats(): Promise<any> {
    const response = await this.client.get(`/api/v1/matching/stats`);
    return response.data;
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.healthCheck();
      return true;
    } catch {
      return false;
    }
  }
}

export const apiService = new ApiService();
export default apiService;