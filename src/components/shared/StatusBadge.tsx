import type { PayrollStatus, TransferStatus } from '@/types';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  neutral: 'bg-slate-50 text-slate-600 border-slate-200',
};

const statusVariantMap: Record<string, BadgeVariant> = {
  // Payroll
  draft: 'neutral',
  pending_approval: 'warning',
  approved: 'info',
  processing: 'info',
  completed: 'success',
  rejected: 'danger',
  failed: 'danger',
  // Transfer
  pending: 'warning',
  success: 'success',
  // Employee
  active: 'success',
  inactive: 'neutral',
  // Loans
  cancelled: 'danger',
  // Wallet
  deposit: 'success',
  withdrawal: 'danger',
  fee: 'warning',
  refund: 'info',
};

const statusLabelMap: Record<string, string> = {
  draft: 'Draft',
  pending_approval: 'Pending Approval',
  approved: 'Approved',
  processing: 'Processing',
  completed: 'Completed',
  rejected: 'Rejected',
  failed: 'Failed',
  pending: 'Pending',
  success: 'Successful',
  active: 'Active',
  inactive: 'Inactive',
  cancelled: 'Cancelled',
  deposit: 'Deposit',
  withdrawal: 'Withdrawal',
  fee: 'Fee',
  refund: 'Refund',
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const variant = statusVariantMap[status] || 'neutral';
  const label = statusLabelMap[status] || status.replace(/_/g, ' ');

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border
        ${variantClasses[variant]} ${className}`}
    >
      {variant === 'info' && status === 'processing' && (
        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
      )}
      {label}
    </span>
  );
}
