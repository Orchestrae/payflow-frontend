import apiClient from './client';
import type { AuditLog } from '@/types';

export const auditApi = {
  list(page = 1, limit = 20) {
    return apiClient.get<{ audit_logs: AuditLog[]; total: number; page: number; limit: number }>(
      '/v1/audit-logs',
      { params: { page, limit } }
    );
  },
};
