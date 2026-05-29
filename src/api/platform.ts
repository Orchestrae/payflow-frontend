import apiClient from './client';
import type { PlatformStats, OrgSummary } from '@/types';

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
};
