// === Auth & User ===
export type UserRole = 'admin' | 'operator' | 'approver' | 'employee' | 'super_admin';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  business_id: number;
  is_verified: boolean;
  invite_accepted: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// === Business ===
export interface Business {
  id: number;
  admin_id: number;
  name: string;
  rc_number?: string;
  incorporation_date?: string;
  director_bvn_last4?: string;
  bvn_verified: boolean;
  rc_verified: boolean;
  is_verified: boolean;
  payroll_requires_approval: boolean;
  payroll_auto_process: boolean;
  pension_enabled: boolean;
  nhf_enabled: boolean;
  nsitf_enabled: boolean;
  paye_enabled: boolean;
  subscription_tier: string;
  subscription_status: string;
  is_suspended: boolean;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessSettings {
  pension_enabled?: boolean;
  nhf_enabled?: boolean;
  nsitf_enabled?: boolean;
  paye_enabled?: boolean;
  payroll_requires_approval?: boolean;
  payroll_auto_process?: boolean;
}

// === Employee ===
export interface Employee {
  id: number;
  business_id: number;
  cadre_id: number;
  full_name: string;
  email: string;
  bank_name: string;
  bank_code: string;
  bank_account_number: string;
  is_active: boolean;
  tin?: string;
  pension_rsa_pin?: string;
  nhf_number?: string;
  annual_rent_paid: number;
  cadre?: Cadre;
  created_at: string;
  updated_at: string;
}

export interface CreateEmployeeRequest {
  cadre_id: number;
  full_name: string;
  email: string;
  bank_name: string;
  bank_code: string;
  bank_account_number: string;
  tin?: string;
  pension_rsa_pin?: string;
  nhf_number?: string;
  annual_rent_paid?: number;
}

export interface UpdateEmployeeRequest {
  cadre_id?: number;
  full_name?: string;
  email?: string;
  bank_name?: string;
  bank_code?: string;
  bank_account_number?: string;
  is_active?: boolean;
  tin?: string;
  pension_rsa_pin?: string;
  nhf_number?: string;
  annual_rent_paid?: number;
}

// === Cadre ===
export type EarningComponentType = 'basic' | 'housing' | 'transport' | 'other';

export interface EarningComponent {
  id?: number;
  cadre_id?: number;
  name: string;
  amount: number;
  component_type: EarningComponentType;
  created_at?: string;
  updated_at?: string;
}

export interface Cadre {
  id: number;
  business_id: number;
  name: string;
  earning_components: EarningComponent[];
  deduction_rules?: DeductionRule[];
  employees?: Employee[];
  created_at: string;
  updated_at: string;
}

export interface CreateCadreRequest {
  name: string;
  earning_components: { name: string; amount: number; component_type?: EarningComponentType }[];
  deduction_rule_ids?: number[];
}

// === Deduction Rule ===
export type DeductionRuleType = 'percentage' | 'flat';
export type CalculationBasis = 'gross_pay' | 'basic_pay';

export interface DeductionRule {
  id: number;
  business_id: number;
  cadre_id?: number;
  name: string;
  type: DeductionRuleType;
  value: number;
  calculation_basis: CalculationBasis;
  created_at: string;
  updated_at: string;
}

export interface CreateDeductionRuleRequest {
  name: string;
  type: DeductionRuleType;
  value: number;
  calculation_basis: CalculationBasis;
}

// === Payroll ===
export type PayrollStatus =
  | 'draft'
  | 'pending_approval'
  | 'approved'
  | 'processing'
  | 'completed'
  | 'rejected'
  | 'failed';

export type PayrollEntryDetailType =
  | 'earning'
  | 'deduction'
  | 'bonus'
  | 'statutory_deduction'
  | 'employer_cost';

export interface PayrollRunEntryDetail {
  id: number;
  payroll_run_entry_id: number;
  type: PayrollEntryDetailType;
  name: string;
  amount: number;
  description?: string;
}

export interface PayrollRunEntry {
  id: number;
  payroll_run_id: number;
  employee_id: number;
  gross_pay: number;
  total_deductions: number;
  bonuses: number;
  net_pay: number;
  employer_pension: number;
  employer_nsitf: number;
  total_employer_cost: number;
  total_cost_to_company: number;
  employee?: Employee;
  details: PayrollRunEntryDetail[];
}

export interface PayrollRun {
  id: number;
  business_id: number;
  period: string;
  status: PayrollStatus;
  total_gross_pay: number;
  total_deductions: number;
  total_net_pay: number;
  total_employer_costs: number;
  total_cost_to_company: number;
  scheduled_for: string;
  processed_at?: string;
  payment_reference?: string;
  rejection_reason?: string;
  entries: PayrollRunEntry[];
  created_at: string;
  updated_at: string;
}

export interface CreatePayrollRunRequest {
  period?: string;
  adjustments?: Record<string, AdjustmentItem[]>;
}

export interface AdjustmentItem {
  item_name: string;
  amount: number;
  description?: string;
  component_type?: string;
}

// === Transfer ===
export type TransferStatus = 'pending' | 'processing' | 'success' | 'failed';

export interface Transfer {
  id: number;
  business_id: number;
  reference: string;
  amount: string;
  currency: string;
  narration?: string;
  recipient_bank_code: string;
  recipient_account_number: string;
  recipient_account_name: string;
  provider: string;
  status: string;
  transaction_id?: string;
  fee?: string;
  processed_at?: string;
  processing_error?: string;
  created_at: string;
  updated_at: string;
}

export interface SingleTransferRequest {
  amount: string;
  bank_code: string;
  account_number: string;
  account_name: string;
  narration?: string;
  reference?: string;
  provider?: string;
}

export interface BatchTransferRequest {
  transfers: SingleTransferRequest[];
}

export interface TransferResponse {
  success: boolean;
  transfer_id: number;
  reference: string;
  transaction_id?: string;
  status: string;
  message?: string;
  provider: string;
  fee?: string;
  processing_time?: string;
}

export interface BatchTransferResponse {
  total_transfers: number;
  successful_transfers: number;
  failed_transfers: number;
  transfers: TransferResponse[];
  processing_time: string;
}

// === Wallet ===
export interface BusinessWallet {
  id: number;
  business_id: number;
  balance: number;
  locked_balance: number;
  currency: string;
  virtual_account_number: string;
  virtual_account_bank_code: string;
  virtual_account_bank_name: string;
  virtual_account_reference: string;
  virtual_account_status: string;
  provider: string;
  created_at: string;
  updated_at: string;
}

export type WalletTransactionType = 'deposit' | 'withdrawal' | 'fee' | 'refund';

export interface WalletTransaction {
  id: number;
  business_id: number;
  transaction_type: WalletTransactionType;
  amount: number;
  balance_before: number;
  balance_after: number;
  currency: string;
  reference: string;
  provider_reference: string;
  description: string;
  transfer_id?: number;
  status: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

// === Dashboard ===
export interface DashboardSummary {
  total_employees: number;
  active_employees: number;
  payroll_runs: number;
  pending_approvals: number;
  wallet_balance: number;
  last_payroll_cost: number;
}

// === Audit ===
export interface AuditLog {
  id: number;
  user_id: number;
  business_id: number;
  action: string;
  resource_type: string;
  resource_id: number;
  description: string;
  ip_address?: string;
  created_at: string;
}

// === Pagination ===
export interface PaginatedResponse<T> {
  data?: T[];
  total: number;
  page: number;
  limit: number;
}

export interface TransferListResponse {
  transfers: Transfer[];
  total: number;
  page: number;
  limit: number;
}

export interface WalletTransactionListResponse {
  transactions: WalletTransaction[];
  total: number;
  page: number;
  limit: number;
}

// === CSV Import ===
export interface CSVImportResponse {
  created_count: number;
  error_count: number;
  errors?: { row: number; message: string }[];
}

// === Billing & Subscriptions ===
export type PlanTier = 'free' | 'starter' | 'pro';

export interface SubscriptionPlan {
  id: number;
  name: string;
  tier: PlanTier;
  price_monthly: number;
  max_employees: number;
  max_payroll_runs: number;
  features: string;
  is_active: boolean;
}

export interface Subscription {
  id: number;
  business_id: number;
  plan_id: number;
  status: string;
  current_period_start: string;
  current_period_end: string;
  plan?: SubscriptionPlan;
}

export interface Invoice {
  id: number;
  business_id: number;
  amount: number;
  status: string;
  paid_at?: string;
  paystack_ref: string;
  period_start: string;
  period_end: string;
  created_at: string;
}

// === Platform (Super Admin) ===
export interface PlatformStats {
  total_organizations: number;
  active_organizations: number;
  suspended_organizations: number;
  total_employees: number;
  mrr: number;
  signups_this_month: number;
  plan_distribution: Record<string, number>;
}

export interface OrgSummary {
  business_id: number;
  business_name: string;
  admin_email: string;
  employee_count: number;
  plan_tier: string;
  subscription_status: string;
  is_suspended: boolean;
  created_at: string;
}

// === Notifications ===
export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  link_url?: string;
  created_at: string;
}

// === Loans ===
export interface EmployeeLoan {
  id: number;
  business_id: number;
  employee_id: number;
  loan_amount: number;
  monthly_deduction: number;
  total_repaid: number;
  remaining_balance: number;
  status: string;
  start_date: string;
  description: string;
  employee?: Employee;
  created_at: string;
}

// === Leave ===
export interface LeaveType {
  id: number;
  business_id: number;
  name: string;
  default_days: number;
  requires_approval: boolean;
}

export interface LeaveRequest {
  id: number;
  employee_id: number;
  business_id: number;
  leave_type_id: number;
  start_date: string;
  end_date: string;
  days: number;
  reason: string;
  status: string;
  approved_by_id?: number;
  employee?: Employee;
  leave_type?: LeaveType;
  created_at: string;
}

export interface LeaveBalance {
  id: number;
  employee_id: number;
  leave_type_id: number;
  year: number;
  entitled: number;
  used: number;
  remaining: number;
}
