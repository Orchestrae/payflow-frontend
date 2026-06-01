import apiClient from './client';
import type { Business, BusinessSettings, OrgProviderSettingSummary } from '@/types';

export const settingsApi = {
  getSettings() {
    return apiClient.get<Business>('/v1/business/settings');
  },

  updateSettings(data: BusinessSettings) {
    return apiClient.patch<Business>('/v1/business/settings', data);
  },

  // Org-level provider key overrides
  getProviderKeys() {
    return apiClient.get<OrgProviderSettingSummary[]>('/v1/business/provider-keys');
  },

  setProviderKey(provider: string, key: string, value: string) {
    return apiClient.put(`/v1/business/provider-keys/${provider}/${key}`, { value });
  },

  deleteProviderKey(provider: string, key: string) {
    return apiClient.delete(`/v1/business/provider-keys/${provider}/${key}`);
  },
};
