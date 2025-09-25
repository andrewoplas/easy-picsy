import axios from 'axios';
import { createClient } from '../supabase/client';
import { ROUTES } from '../routes';

const supabase = createClient();

// ✅ Step 1: Create axios instance with interceptors
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const {
        data: { session },
        error: refreshError,
      } = await supabase.auth.refreshSession();
      if (!refreshError && session) {
        error.config.headers.Authorization = `Bearer ${session.access_token}`;
        return axiosInstance.request(error.config);
      } else {
        window.location.href = ROUTES.ADMIN.LOGIN;
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;