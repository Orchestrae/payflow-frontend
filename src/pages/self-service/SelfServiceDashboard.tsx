import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Banknote,
  CalendarDays,
  Landmark,
  FileText,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { selfServiceApi } from '@/api/self-service';
import { useAuthStore } from '@/store/authStore';
import { CardSkeleton } from '@/components/shared/Skeleton';
import type { Payslip } from '@/types';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatPeriod(period: string): string {
  try {
    const [year, month] = period.split('-');
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  } catch {
    return period;
  }
}

export default function SelfServiceDashboard() {
  const user = useAuthStore((s) => s.user);

  const { data: payslips, isLoading: loadingPayslips } = useQuery({
    queryKey: ['self-service', 'payslips'],
    queryFn: () => selfServiceApi.getPayslips().then((r) => r.data),
  });

  const { data: leaveRequests, isLoading: loadingLeave } = useQuery({
    queryKey: ['self-service', 'leave'],
    queryFn: () => selfServiceApi.getLeaveRequests().then((r) => r.data),
  });

  const { data: loans, isLoading: loadingLoans } = useQuery({
    queryKey: ['self-service', 'loans'],
    queryFn: () => selfServiceApi.getLoans().then((r) => r.data),
  });

  const recentPayslips = (payslips ?? []).slice(0, 3);
  const latestPayslip: Payslip | undefined = recentPayslips[0];
  const pendingLeave = (leaveRequests ?? []).filter(
    (r) => r.status === 'pending'
  ).length;
  const activeLoans = (loans ?? []).filter(
    (l) => l.status === 'active'
  ).length;
  const totalLoanBalance = (loans ?? [])
    .filter((l) => l.status === 'active')
    .reduce((sum, l) => sum + l.remaining_balance, 0);

  const isLoading = loadingPayslips || loadingLeave || loadingLoans;

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {user?.full_name?.split(' ')[0] || 'there'}
        </h1>
        <p className="text-slate-500 mt-1">
          Here is a summary of your pay and benefits.
        </p>
      </div>

      {/* Summary Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card hover>
            <CardContent className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-emerald-50">
                <Banknote className="h-5 w-5 text-emerald-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Last Net Pay
                </p>
                <p className="text-xl font-bold text-slate-900 mt-1">
                  {latestPayslip
                    ? formatCurrency(latestPayslip.net_pay)
                    : '--'}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {latestPayslip
                    ? formatPeriod(latestPayslip.period)
                    : 'No payslips yet'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-blue-50">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Total Payslips
                </p>
                <p className="text-xl font-bold text-slate-900 mt-1">
                  {payslips?.length ?? 0}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">All time</p>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-amber-50">
                <CalendarDays className="h-5 w-5 text-amber-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Pending Leave
                </p>
                <p className="text-xl font-bold text-slate-900 mt-1">
                  {pendingLeave}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {pendingLeave === 1 ? 'request' : 'requests'} awaiting
                  approval
                </p>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="flex items-start gap-4">
              <div className="p-2.5 rounded-xl bg-violet-50">
                <Landmark className="h-5 w-5 text-violet-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Active Loans
                </p>
                <p className="text-xl font-bold text-slate-900 mt-1">
                  {activeLoans}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {totalLoanBalance > 0
                    ? `${formatCurrency(totalLoanBalance)} remaining`
                    : 'No outstanding balance'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Payslips */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-slate-400" />
            <h2 className="text-base font-semibold text-slate-900">
              Recent Payslips
            </h2>
          </div>
          <Link
            to="/self-service/payslips"
            className="text-sm text-[#22BC66] hover:underline font-medium flex items-center gap-1"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {recentPayslips.length === 0 ? (
            <div className="py-12 text-center text-sm text-slate-400">
              No payslips available yet. They will appear here after your first
              payroll run.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentPayslips.map((slip) => (
                <div
                  key={slip.id}
                  className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {formatPeriod(slip.period)}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Gross: {formatCurrency(slip.gross_pay)} | Deductions:{' '}
                      {formatCurrency(slip.total_deductions)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-emerald-600">
                      {formatCurrency(slip.net_pay)}
                    </p>
                    <p className="text-xs text-slate-400">Net pay</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
