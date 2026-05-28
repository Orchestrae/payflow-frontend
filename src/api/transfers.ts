import apiClient from './client';
import type {
  Transfer,
  SingleTransferRequest,
  BatchTransferRequest,
  TransferResponse,
  BatchTransferResponse,
  TransferListResponse,
} from '@/types';

export const transfersApi = {
  list(page = 1, limit = 20) {
    return apiClient.get<TransferListResponse>('/v1/transfers', {
      params: { page, limit },
    });
  },

  getById(id: number) {
    return apiClient.get<Transfer>(`/v1/transfers/${id}`);
  },

  create(data: SingleTransferRequest) {
    return apiClient.post<TransferResponse>('/v1/transfers', data);
  },

  createBatch(data: BatchTransferRequest) {
    return apiClient.post<BatchTransferResponse>('/v1/transfers/batch', data);
  },

  retry(id: number) {
    return apiClient.post<TransferResponse>(`/v1/transfers/${id}/retry`);
  },
};
