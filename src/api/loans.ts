import apiClient from './client';
import type { EmployeeLoan } from '@/types';

export const loansApi = {
  create(data: { employee_id: number; loan_amount: number; monthly_deduction: number; start_date: string; description: string }) {
    return apiClient.post<EmployeeLoan>('/v1/loans', data);
  },
  list(page = 1, limit = 20) {
    return apiClient.get<{ data: EmployeeLoan[]; total: number }>('/v1/loans', { params: { page, limit } });
  },
  cancel(id: number) {
    return apiClient.patch(`/v1/loans/${id}/cancel`);
  },
};
