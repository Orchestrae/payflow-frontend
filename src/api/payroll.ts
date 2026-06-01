import apiClient from './client';
import type { PayrollRun, CreatePayrollRunRequest } from '@/types';

export const payrollApi = {
  list() {
    return apiClient.get<PayrollRun[]>('/v1/payroll-runs');
  },

  getById(id: number) {
    return apiClient.get<PayrollRun>(`/v1/payroll-runs/${id}`);
  },

  create(data: CreatePayrollRunRequest) {
    return apiClient.post<PayrollRun>('/v1/payroll-runs', data);
  },

  submit(id: number) {
    return apiClient.post<PayrollRun>(`/v1/payroll-runs/${id}/submit`);
  },

  approve(id: number) {
    return apiClient.post<PayrollRun>(`/v1/payroll-runs/${id}/approve`);
  },

  reject(id: number, reason: string) {
    return apiClient.post<PayrollRun>(`/v1/payroll-runs/${id}/reject`, { reason });
  },

  processNow(id: number) {
    return apiClient.post<PayrollRun>(`/v1/payroll-runs/${id}/process-now`);
  },

  amend(id: number, adjustments: Record<string, unknown> = {}) {
    return apiClient.put<PayrollRun>(`/v1/payroll-runs/${id}/amend`, adjustments);
  },

  reverse(id: number, reason: string) {
    return apiClient.post<PayrollRun>(`/v1/payroll-runs/${id}/reverse`, { reason });
  },

  // Reports — these return file downloads
  downloadReport(runId: number, type: 'paye' | 'pension' | 'nhf' | 'bank-schedule' | 'summary') {
    return apiClient.get(`/v1/payroll-runs/${runId}/reports/${type}`, {
      responseType: 'blob',
    });
  },

  downloadPayslip(runId: number, employeeId: number) {
    return apiClient.get(`/v1/payroll-runs/${runId}/payslips/${employeeId}`, {
      responseType: 'blob',
    });
  },

  downloadAllPayslips(runId: number) {
    return apiClient.get(`/v1/payroll-runs/${runId}/payslips`, {
      responseType: 'blob',
    });
  },
};
