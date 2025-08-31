import axios from 'axios';
import { createClient } from '../supabase/client';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, try to refresh
      const supabase = createClient();
      const { data: { session }, error: refreshError } = await supabase.auth.refreshSession();
      
      if (!refreshError && session) {
        // Retry the original request with new token
        error.config.headers.Authorization = `Bearer ${session.access_token}`;
        return apiClient.request(error.config);
      } else {
        // Refresh failed, redirect to login
        window.location.href = '/admin/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;