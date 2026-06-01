import apiClient from './client';
import type { PlatformStats, OrgSummary, PlatformSettingSummary } from '@/types';

export const platformApi = {
  getStats() {
    return apiClient.get<PlatformStats>('/platform/stats');
  },
  getOrganizations(page = 1, limit = 20) {
    return apiClient.get<{ data: OrgSummary[]; total: number }>('/platform/organizations', { params: { page, limit } });
  },
  suspendOrg(id: number, reason?: string) {
    return apiClient.post(`/platform/organizations/${id}/suspend`, { reason });
  },
  activateOrg(id: number) {
    return apiClient.post(`/platform/organizations/${id}/activate`);
  },

  // Platform Settings
  getSettings(category?: string) {
    return apiClient.get<PlatformSettingSummary[]>('/platform/settings', {
      params: category ? { category } : {},
    });
  },
  setSetting(key: string, value: string, description: string, category: string) {
    return apiClient.put(`/platform/settings/${key}`, { value, description, category });
  },
  deleteSetting(key: string) {
    return apiClient.delete(`/platform/settings/${key}`);
  },
};
