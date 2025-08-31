import apiClient from './client';

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export const authApi = {
  async getProfile(): Promise<UserProfile> {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },

  async updateProfile(data: { fullName?: string; avatarUrl?: string }): Promise<UserProfile> {
    const response = await apiClient.put('/users/profile', data);
    return response.data;
  },

  async verifyToken(): Promise<{ valid: boolean; user: any }> {
    const response = await apiClient.get('/auth/verify');
    return response.data;
  },
};