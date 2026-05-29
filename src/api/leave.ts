import apiClient from './client';
import type { LeaveType, LeaveRequest, LeaveBalance } from '@/types';

export const leaveApi = {
  // Leave types
  createType(data: { name: string; default_days: number; requires_approval: boolean }) {
    return apiClient.post<LeaveType>('/v1/leave-types', data);
  },
  getTypes() {
    return apiClient.get<LeaveType[]>('/v1/leave-types');
  },
  // Leave requests
  submitRequest(data: { employee_id: number; leave_type_id: number; start_date: string; end_date: string; days: number; reason: string }) {
    return apiClient.post<LeaveRequest>('/v1/leave-requests', data);
  },
  listRequests(page = 1, limit = 20) {
    return apiClient.get<{ data: LeaveRequest[]; total: number }>('/v1/leave-requests', { params: { page, limit } });
  },
  approveRequest(id: number) {
    return apiClient.post(`/v1/leave-requests/${id}/approve`);
  },
  rejectRequest(id: number, reason: string) {
    return apiClient.post(`/v1/leave-requests/${id}/reject`, { reason });
  },
  // Balances
  getBalance(employeeId: number) {
    return apiClient.get<LeaveBalance[]>(`/v1/leave-balances/${employeeId}`);
  },
};
