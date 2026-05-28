import apiClient from './client';
import type { Cadre, CreateCadreRequest } from '@/types';

export const cadresApi = {
  list() {
    return apiClient.get<Cadre[]>('/v1/cadres');
  },

  getById(id: number) {
    return apiClient.get<Cadre>(`/v1/cadres/${id}`);
  },

  create(data: CreateCadreRequest) {
    return apiClient.post<Cadre>('/v1/cadres', data);
  },

  update(id: number, data: CreateCadreRequest) {
    return apiClient.put<Cadre>(`/v1/cadres/${id}`, data);
  },

  delete(id: number) {
    return apiClient.delete(`/v1/cadres/${id}`);
  },
};
