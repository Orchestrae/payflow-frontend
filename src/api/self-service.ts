import apiClient from './client';
import type {
  LoginResponse,
  EmployeeProfile,
  UpdateBankDetailsRequest,
  Payslip,
  LeaveRequest,
  CreateLeaveRequestPayload,
  EmployeeLoan,
} from '@/types';

export const selfServiceApi = {
  // Auth
  login(email: string, password: string) {
    return apiClient.post<LoginResponse>('/v1/auth/employee/login', {
      email,
      password,
    });
  },

  // Profile
  getProfile() {
    return apiClient.get<EmployeeProfile>('/v1/me/profile');
  },

  updateBankDetails(data: UpdateBankDetailsRequest) {
    return apiClient.patch<EmployeeProfile>('/v1/me/bank-details', data);
  },

  // Payslips
  getPayslips() {
    return apiClient.get<Payslip[]>('/v1/me/payslips');
  },

  // Leave
  getLeaveRequests() {
    return apiClient.get<LeaveRequest[]>('/v1/leave/requests');
  },

  createLeaveRequest(data: CreateLeaveRequestPayload) {
    return apiClient.post<LeaveRequest>('/v1/leave/requests', data);
  },

  // Loans
  getLoans() {
    return apiClient.get<EmployeeLoan[]>('/v1/loans');
  },
};
