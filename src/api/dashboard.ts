import apiClient from './client';
import type { DashboardSummary } from '@/types';

export const dashboardApi = {
  getSummary() {
    return apiClient.get<DashboardSummary>('/v1/dashboard');
  },
};
