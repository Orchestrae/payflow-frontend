import apiClient from './client';
import type { Business, BusinessSettings } from '@/types';

export const settingsApi = {
  getSettings() {
    return apiClient.get<Business>('/v1/business/settings');
  },

  updateSettings(data: BusinessSettings) {
    return apiClient.patch<Business>('/v1/business/settings', data);
  },
};
