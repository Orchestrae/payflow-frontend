import apiClient from './client';
import type { BusinessWallet, WalletTransactionListResponse, LedgerEntryListResponse, ReconciliationResult } from '@/types';

export const walletApi = {
  getWallet() {
    return apiClient.get<BusinessWallet>('/v1/wallets');
  },

  getBalance() {
    return apiClient.get<{ balance: number; currency: string }>('/v1/wallets/balance');
  },

  getTransactions(page = 1, limit = 10) {
    return apiClient.get<WalletTransactionListResponse>('/v1/wallets/transactions', {
      params: { page, limit },
    });
  },

  initiateDeposit(amount: number, email?: string) {
    return apiClient.post<{ payment_url: string; reference: string; amount: number; message: string }>(
      '/v1/wallets/deposit',
      { amount, email }
    );
  },

  createVirtualAccount(data: { account_name?: string } = {}) {
    return apiClient.post<BusinessWallet>('/v1/wallets/virtual-account', data);
  },

  getLedgerEntries(page = 1, limit = 50) {
    return apiClient.get<LedgerEntryListResponse>('/v1/wallets/ledger', {
      params: { page, limit },
    });
  },

  getReconciliation() {
    return apiClient.get<ReconciliationResult>('/v1/wallets/reconcile');
  },
};
