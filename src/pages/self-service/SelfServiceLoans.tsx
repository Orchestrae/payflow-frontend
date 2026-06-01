import { useQuery } from '@tanstack/react-query';
import { Landmark, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { selfServiceApi } from '@/api/self-service';
import { TableSkeleton } from '@/components/shared/Skeleton';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);
}

const statusStyles: Record<string, { badge: string; label: string }> = {
  active: {
    badge: 'bg-emerald-50 text-emerald-600',
    label: 'Active',
  },
  completed: {
    badge: 'bg-slate-100 text-slate-500',
    label: 'Completed',
  },
  defaulted: {
    badge: 'bg-red-50 text-red-600',
    label: 'Defaulted',
  },
};

function getStatus(status: string) {
  return (
    statusStyles[status] ?? {
      badge: 'bg-slate-100 text-slate-500',
      label: status,
    }
  );
}

export default function SelfServiceLoans() {
  const { data: loans, isLoading } = useQuery({
    queryKey: ['self-service', 'loans'],
    queryFn: () => selfServiceApi.getLoans().then((r) => r.data),
  });

  const activeLoans = (loans ?? []).filter((l) => l.status === 'active');
  const totalRemaining = activeLoans.reduce(
    (sum, l) => sum + l.remaining_balance,
    0
  );
  const totalMonthly = activeLoans.reduce(
    (sum, l) => sum + l.monthly_deduction,
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Loans</h1>
        <p className="text-slate-500 mt-1">
          View your loans and repayment status.
        </p>
      </div>

      {/* Summary */}
      {!isLoading && activeLoans.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-violet-50">
                <Landmark className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Active Loans
                </p>
                <p className="text-xl font-bold text-slate-900 mt-1">
                  {activeLoans.length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-50">
                <TrendingDown className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Outstanding Balance
                </p>
                <p className="text-xl font-bold text-slate-900 mt-1">
                  {formatCurrency(totalRemaining)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-blue-50">
                <TrendingDown className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Monthly Deduction
                </p>
                <p className="text-xl font-bold text-slate-900 mt-1">
                  {formatCurrency(totalMonthly)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Loan List */}
      <Card>
        {isLoading ? (
          <TableSkeleton rows={4} cols={4} />
        ) : !loans || loans.length === 0 ? (
          <CardContent>
            <div className="py-16 text-center">
              <Landmark className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500 font-medium">
                No loans found
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Any assigned loans will appear here.
              </p>
            </div>
          </CardContent>
        ) : (
          <>
            <CardHeader>
              <p className="text-sm text-slate-500">
                {loans.length} loan{loans.length !== 1 && 's'}
              </p>
            </CardHeader>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Description
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Loan Amount
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Monthly
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Repaid
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Remaining
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loans.map((loan) => {
                    const st = getStatus(loan.status);
                    const pct =
                      loan.loan_amount > 0
                        ? Math.round(
                            (loan.total_repaid / loan.loan_amount) * 100
                          )
                        : 0;
                    return (
                      <tr
                        key={loan.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-900">
                            {loan.description || `Loan #${loan.id}`}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Start: {loan.start_date}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right text-slate-900">
                          {formatCurrency(loan.loan_amount)}
                        </td>
                        <td className="px-6 py-4 text-right text-slate-600">
                          {formatCurrency(loan.monthly_deduction)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-slate-900">
                            {formatCurrency(loan.total_repaid)}
                          </span>
                          <span className="text-xs text-slate-400 ml-1">
                            ({pct}%)
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-slate-900">
                          {formatCurrency(loan.remaining_balance)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${st.badge}`}
                          >
                            {st.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {loans.map((loan) => {
                const st = getStatus(loan.status);
                const pct =
                  loan.loan_amount > 0
                    ? Math.round(
                        (loan.total_repaid / loan.loan_amount) * 100
                      )
                    : 0;
                return (
                  <div key={loan.id} className="px-6 py-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-900">
                        {loan.description || `Loan #${loan.id}`}
                      </p>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${st.badge}`}
                      >
                        {st.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-slate-400 uppercase tracking-wide font-medium">
                          Amount
                        </p>
                        <p className="text-slate-900 mt-0.5">
                          {formatCurrency(loan.loan_amount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 uppercase tracking-wide font-medium">
                          Monthly
                        </p>
                        <p className="text-slate-900 mt-0.5">
                          {formatCurrency(loan.monthly_deduction)}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 uppercase tracking-wide font-medium">
                          Repaid
                        </p>
                        <p className="text-slate-900 mt-0.5">
                          {formatCurrency(loan.total_repaid)} ({pct}%)
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 uppercase tracking-wide font-medium">
                          Remaining
                        </p>
                        <p className="text-slate-900 mt-0.5">
                          {formatCurrency(loan.remaining_balance)}
                        </p>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
