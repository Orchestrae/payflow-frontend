import apiClient from './client';

export interface BankVerificationResult {
  account_name: string;
  account_number: string;
  bank_code: string;
  verified: boolean;
}

export interface BVNVerificationResult {
  first_name: string;
  last_name: string;
  bvn_last4: string;
  verified: boolean;
}

export const verificationApi = {
  verifyBankAccount(bankCode: string, accountNumber: string) {
    return apiClient.get<BankVerificationResult>('/v1/verify/bank-account', {
      params: { bank_code: bankCode, account_number: accountNumber },
    });
  },

  verifyBVN(bvn: string) {
    return apiClient.get<BVNVerificationResult>('/v1/verify/bvn', {
      params: { bvn },
    });
  },
};
