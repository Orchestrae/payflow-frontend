import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Landmark } from 'lucide-react';
import toast from 'react-hot-toast';
import { loansApi } from '@/api/loans';
import { formatNGN } from '@/utils/currency';
import { formatDate } from '@/utils/date';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { TableSkeleton } from '@/components/shared/Skeleton';
import { Modal } from '@/components/ui/Modal';

export default function LoanListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [confirmCancel, setConfirmCancel] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['loans'],
    queryFn: () => loansApi.list().then((r) => r.data),
  });

  const cancelLoan = useMutation({
    mutationFn: (id: number) => loansApi.cancel(id),
    onSuccess: () => {
      toast.success('Loan cancelled');
      queryClient.invalidateQueries({ queryKey: ['loans'] });
      setConfirmCancel(null);
    },
    onError: () => toast.error('Failed to cancel loan'),
  });

  const loans = data?.data || [];

  if (isLoading) return <Card><TableSkeleton /></Card>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Employee Loans</h1>
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => navigate('/loans/new')}>
          Create Loan
        </Button>
      </div>

      {!loans.length ? (
        <Card>
          <EmptyState
            icon={<Landmark className="h-12 w-12" />}
            title="No loans yet"
            description="Create employee loans with scheduled monthly deductions from payroll."
            actionLabel="Create loan"
            onAction={() => navigate('/loans/new')}
          />
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Employee</th>
                  <th className="text-right px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Loan Amount</th>
                  <th className="text-right px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Monthly Deduction</th>
                  <th className="text-right px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Total Repaid</th>
                  <th className="text-right px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Remaining</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Start Date</th>
                  <th className="text-right px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500"></th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-6 py-3 font-medium text-slate-900">
                      {loan.employee
                        ? loan.employee.full_name
                        : `Employee #${loan.employee_id}`}
                    </td>
                    <td className="px-6 py-3 text-right text-slate-900 font-medium">{formatNGN(loan.loan_amount)}</td>
                    <td className="px-6 py-3 text-right text-slate-600">{formatNGN(loan.monthly_deduction)}</td>
                    <td className="px-6 py-3 text-right text-slate-600">{formatNGN(loan.total_repaid)}</td>
                    <td className="px-6 py-3 text-right text-slate-600">{formatNGN(loan.remaining_balance)}</td>
                    <td className="px-6 py-3"><StatusBadge status={loan.status} /></td>
                    <td className="px-6 py-3 text-slate-500 text-xs">{formatDate(loan.start_date)}</td>
                    <td className="px-6 py-3 text-right">
                      {loan.status === 'active' && (
                        <button
                          onClick={() => setConfirmCancel(loan.id)}
                          className="px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal open={confirmCancel !== null} onClose={() => setConfirmCancel(null)} title="Cancel loan">
        <p className="text-sm text-slate-600 mb-6">
          This will stop all future deductions for this loan. This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setConfirmCancel(null)}>Go back</Button>
          <Button
            variant="danger"
            loading={cancelLoan.isPending}
            onClick={() => { if (confirmCancel) cancelLoan.mutate(confirmCancel); }}
          >
            Cancel loan
          </Button>
        </div>
      </Modal>
    </div>
  );
}
