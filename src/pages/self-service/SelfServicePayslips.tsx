import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FileText, ChevronDown, ChevronUp, Download } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { selfServiceApi } from '@/api/self-service';
import { TableSkeleton } from '@/components/shared/Skeleton';
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

function PayslipRow({ slip }: { slip: Payslip }) {
  const [expanded, setExpanded] = useState(false);

  const earnings = slip.details?.filter(
    (d) => d.type === 'earning' || d.type === 'bonus'
  ) ?? [];
  const deductions = slip.details?.filter(
    (d) => d.type === 'deduction' || d.type === 'statutory_deduction'
  ) ?? [];

  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-lg bg-emerald-50">
            <FileText className="h-4 w-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-900">
              {formatPeriod(slip.period)}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Gross: {formatCurrency(slip.gross_pay)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-emerald-600">
              {formatCurrency(slip.net_pay)}
            </p>
            <p className="text-xs text-slate-400">Net pay</p>
          </div>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-6 pb-5 bg-slate-50/40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Earnings */}
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Earnings
              </h4>
              <div className="space-y-2">
                {earnings.length > 0 ? (
                  earnings.map((d) => (
                    <div
                      key={d.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-slate-600">{d.name}</span>
                      <span className="font-medium text-slate-900">
                        {formatCurrency(d.amount)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">
                    Gross: {formatCurrency(slip.gross_pay)}
                  </p>
                )}
                <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-sm font-semibold">
                  <span className="text-slate-700">Total Gross</span>
                  <span className="text-slate-900">
                    {formatCurrency(slip.gross_pay)}
                  </span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Deductions
              </h4>
              <div className="space-y-2">
                {deductions.length > 0 ? (
                  deductions.map((d) => (
                    <div
                      key={d.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-slate-600">{d.name}</span>
                      <span className="font-medium text-red-600">
                        -{formatCurrency(d.amount)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">
                    Total: {formatCurrency(slip.total_deductions)}
                  </p>
                )}
                <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-sm font-semibold">
                  <span className="text-slate-700">Total Deductions</span>
                  <span className="text-red-600">
                    -{formatCurrency(slip.total_deductions)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Pay summary */}
          <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900">Net Pay</span>
            <span className="text-lg font-bold text-emerald-600">
              {formatCurrency(slip.net_pay)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SelfServicePayslips() {
  const { data: payslips, isLoading } = useQuery({
    queryKey: ['self-service', 'payslips'],
    queryFn: () => selfServiceApi.getPayslips().then((r) => r.data),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payslips</h1>
          <p className="text-slate-500 mt-1">
            View your complete pay history and breakdowns.
          </p>
        </div>
        {payslips && payslips.length > 0 && (
          <button
            type="button"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        )}
      </div>

      <Card>
        {isLoading ? (
          <TableSkeleton rows={5} cols={3} />
        ) : !payslips || payslips.length === 0 ? (
          <CardContent>
            <div className="py-16 text-center">
              <FileText className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500 font-medium">
                No payslips yet
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Your payslips will appear here after payroll is processed.
              </p>
            </div>
          </CardContent>
        ) : (
          <div>
            <CardHeader>
              <p className="text-sm text-slate-500">
                {payslips.length} payslip{payslips.length !== 1 && 's'} found
              </p>
            </CardHeader>
            {payslips.map((slip) => (
              <PayslipRow key={slip.id} slip={slip} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
