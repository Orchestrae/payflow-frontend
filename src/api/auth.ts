import apiClient from './client';
import type { LoginResponse } from '@/types';

export const authApi = {
  login(email: string, password: string) {
    return apiClient.post<LoginResponse>('/v1/auth/login', { email, password });
  },

  register(data: {
    business_name: string;
    email: string;
    password: string;
    rc_number: string;
    incorporation_date: string;
    director_bvn: string;
  }) {
    return apiClient.post('/v1/auth/register', data);
  },

  invite(email: string, role: string) {
    return apiClient.post('/v1/auth/invite', { email, role });
  },

  acceptInvitation(token: string, password: string) {
    return apiClient.post<LoginResponse>('/v1/auth/accept-invitation', {
      token,
      password,
    });
  },

  forgotPassword(email: string) {
    return apiClient.post('/v1/auth/forgot-password', { email });
  },

  resetPassword(token: string, new_password: string) {
    return apiClient.post('/v1/auth/reset-password', { token, new_password });
  },

  verifyEmail(token: string) {
    return apiClient.post('/v1/auth/verify-email', { token });
  },

  resendVerification() {
    return apiClient.post('/v1/auth/resend-verification');
  },
};
