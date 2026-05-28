import apiClient from './client';
import type {
  Employee,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  CSVImportResponse,
} from '@/types';

export const employeesApi = {
  list() {
    return apiClient.get<Employee[]>('/v1/employees');
  },

  getById(id: number) {
    return apiClient.get<Employee>(`/v1/employees/${id}`);
  },

  create(data: CreateEmployeeRequest) {
    return apiClient.post<Employee>('/v1/employees', data);
  },

  update(id: number, data: UpdateEmployeeRequest) {
    return apiClient.put<Employee>(`/v1/employees/${id}`, data);
  },

  deactivate(id: number) {
    return apiClient.patch(`/v1/employees/${id}/deactivate`);
  },

  importCSV(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<CSVImportResponse>('/v1/employees/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
