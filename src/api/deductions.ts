import apiClient from './client';
import type { DeductionRule, CreateDeductionRuleRequest } from '@/types';

export const deductionsApi = {
  list() {
    return apiClient.get<DeductionRule[]>('/v1/deduction-rules');
  },

  create(data: CreateDeductionRuleRequest) {
    return apiClient.post<DeductionRule>('/v1/deduction-rules', data);
  },

  update(id: number, data: CreateDeductionRuleRequest) {
    return apiClient.put<DeductionRule>(`/v1/deduction-rules/${id}`, data);
  },

  delete(id: number) {
    return apiClient.delete(`/v1/deduction-rules/${id}`);
  },
};
