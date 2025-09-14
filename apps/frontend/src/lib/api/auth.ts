import {
  Configuration,
  UpdateUserDto,
  UserResponseDto,
  UsersApi,
  AuthenticationApi,
  VerifyTokenResponseDto,
} from '@org/api-lib';
import axiosInstance from './client2';

const usersApi = new UsersApi(new Configuration(), undefined, axiosInstance);
const authenticationApi = new AuthenticationApi(new Configuration(), undefined, axiosInstance);

export const authApi = {
  async getProfile(): Promise<UserResponseDto> {
    const response = await usersApi.usersControllerGetProfile();
    return response.data;
  },

  async updateProfile(data: UpdateUserDto): Promise<UserResponseDto> {
    const response = await usersApi.usersControllerUpdateProfile(data);

    return response.data;
  },

  async verifyToken(): Promise<VerifyTokenResponseDto> {
    const response = await authenticationApi.authControllerVerifyToken();
    return response.data;
  },
};
