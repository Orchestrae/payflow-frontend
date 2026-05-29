import apiClient from './client';
import type { SubscriptionPlan, Subscription, Invoice } from '@/types';

export const billingApi = {
  getPlans() {
    return apiClient.get<SubscriptionPlan[]>('/v1/billing/plans');
  },
  getSubscription() {
    return apiClient.get<Subscription>('/v1/billing/subscription');
  },
  subscribe(tier: string, callbackUrl?: string) {
    return apiClient.post<{ payment_url?: string; message: string }>('/v1/billing/subscribe', { tier, callback_url: callbackUrl });
  },
  cancel() {
    return apiClient.post<{ message: string }>('/v1/billing/cancel');
  },
  getInvoices(page = 1, limit = 20) {
    return apiClient.get<{ data: Invoice[]; total: number }>('/v1/billing/invoices', { params: { page, limit } });
  },
};
