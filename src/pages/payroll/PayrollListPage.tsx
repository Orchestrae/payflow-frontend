import { useNavigate } from 'react-router-dom';
import { Plus, Banknote } from 'lucide-react';
import { usePayrollRuns } from '@/hooks/useApi';
import { useAuthStore } from '@/store/authStore';
import { hasRole } from '@/utils/roles';
import { formatNGN } from '@/utils/currency';
import { formatPeriod, formatDate } from '@/utils/date';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { TableSkeleton } from '@/components/shared/Skeleton';

export default function PayrollListPage() {
  const navigate = useNavigate();
  const { data: runs, isLoading } = usePayrollRuns();
  const role = useAuthStore((s) => s.user?.role);
  const canCreate = role && hasRole(role, ['admin', 'operator']);

  if (isLoading) return <Card><TableSkeleton /></Card>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Payroll Runs</h1>
        {canCreate && (
          <Button icon={<Plus className="h-4 w-4" />} onClick={() => navigate('/payroll/new')}>
            New payroll
          </Button>
        )}
      </div>

      {!runs?.length ? (
        <Card>
          <EmptyState
            icon={<Banknote className="h-12 w-12" />}
            title="No payroll runs yet"
            description="Create your first payroll run to calculate salaries for your team."
            actionLabel={canCreate ? 'Create payroll' : undefined}
            onAction={canCreate ? () => navigate('/payroll/new') : undefined}
          />
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Period</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Gross Pay</th>
                  <th className="text-right px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Net Pay</th>
                  <th className="text-right px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Employees</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Created</th>
                </tr>
              </thead>
              <tbody>
                {runs.map((run) => (
                  <tr
                    key={run.id}
                    onClick={() => navigate(`/payroll/${run.id}`)}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-3 font-medium text-slate-900">{formatPeriod(run.period)}</td>
                    <td className="px-6 py-3"><StatusBadge status={run.status} /></td>
                    <td className="px-6 py-3 text-right text-slate-700">{formatNGN(run.total_gross_pay)}</td>
                    <td className="px-6 py-3 text-right font-medium text-slate-900">{formatNGN(run.total_net_pay)}</td>
                    <td className="px-6 py-3 text-right text-slate-600">{run.entries?.length || 0}</td>
                    <td className="px-6 py-3 text-slate-500">{formatDate(run.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
