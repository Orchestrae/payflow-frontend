import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  ChevronDown,
  ChevronRight,
  Send,
  CheckCircle,
  XCircle,
  Play,
  Download,
  FileText,
} from 'lucide-react';
import {
  usePayrollRun,
  useSubmitPayroll,
  useApprovePayroll,
  useRejectPayroll,
  useProcessPayroll,
} from '@/hooks/useApi';
import { useAuthStore } from '@/store/authStore';
import { hasRole } from '@/utils/roles';
import { formatNGN } from '@/utils/currency';
import { formatPeriod } from '@/utils/date';
import { payrollApi } from '@/api/payroll';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { TableSkeleton } from '@/components/shared/Skeleton';

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function PayrollDetailPage() {
  const { id } = useParams();
  const runId = parseInt(id || '0');
  const { data: run, isLoading } = usePayrollRun(runId);
  const role = useAuthStore((s) => s.user?.role);

  const submitPayroll = useSubmitPayroll();
  const approvePayroll = useApprovePayroll();
  const rejectPayroll = useRejectPayroll();
  const processPayroll = useProcessPayroll();

  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [downloading, setDownloading] = useState<string | null>(null);

  function toggleExpand(entryId: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(entryId) ? next.delete(entryId) : next.add(entryId);
      return next;
    });
  }

  async function handleDownloadReport(type: 'paye' | 'pension' | 'nhf' | 'bank-schedule' | 'summary') {
    setDownloading(type);
    try {
      const res = await payrollApi.downloadReport(runId, type);
      downloadBlob(res.data, `${type}-report-${runId}.csv`);
    } catch { /* toast handled by interceptor */ }
    setDownloading(null);
  }

  async function handleDownloadPayslip(employeeId?: number) {
    const key = employeeId ? `payslip-${employeeId}` : 'payslips-all';
    setDownloading(key);
    try {
      if (employeeId) {
        const res = await payrollApi.downloadPayslip(runId, employeeId);
        downloadBlob(res.data, `payslip-${employeeId}.pdf`);
      } else {
        const res = await payrollApi.downloadAllPayslips(runId);
        downloadBlob(res.data, `payslips-${runId}.zip`);
      }
    } catch { /* handled */ }
    setDownloading(null);
  }

  if (isLoading) return <TableSkeleton />;
  if (!run) return <p className="text-sm text-slate-500">Payroll run not found.</p>;

  const canSubmit = role && hasRole(role, ['admin', 'operator']) && (run.status === 'draft');
  const canApprove = role && hasRole(role, ['admin', 'approver']) && run.status === 'pending_approval';
  const canReject = canApprove;
  const canProcess = role && hasRole(role, ['admin', 'operator']) && (run.status === 'approved' || run.status === 'draft');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{formatPeriod(run.period)}</h1>
          <div className="flex items-center gap-3 mt-1">
            <StatusBadge status={run.status} />
            {run.rejection_reason && (
              <span className="text-xs text-red-600">Reason: {run.rejection_reason}</span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {canSubmit && (
            <Button variant="secondary" icon={<Send className="h-4 w-4" />}
              loading={submitPayroll.isPending} onClick={() => submitPayroll.mutate(runId)}>
              Submit for approval
            </Button>
          )}
          {canApprove && (
            <Button icon={<CheckCircle className="h-4 w-4" />}
              loading={approvePayroll.isPending} onClick={() => approvePayroll.mutate(runId)}>
              Approve
            </Button>
          )}
          {canReject && (
            <Button variant="danger" icon={<XCircle className="h-4 w-4" />}
              onClick={() => setRejectOpen(true)}>
              Reject
            </Button>
          )}
          {canProcess && (
            <Button icon={<Play className="h-4 w-4" />}
              loading={processPayroll.isPending} onClick={() => processPayroll.mutate(runId)}>
              Process now
            </Button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Gross Pay', value: run.total_gross_pay },
          { label: 'Deductions', value: run.total_deductions },
          { label: 'Net Pay', value: run.total_net_pay },
          { label: 'Employer Costs', value: run.total_employer_costs },
          { label: 'Total Cost', value: run.total_cost_to_company },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{item.label}</p>
              <p className="text-lg font-bold text-slate-900 mt-1">{formatNGN(item.value)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reports */}
      {run.status !== 'draft' && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-900">Reports & Payslips</h2>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(['paye', 'pension', 'nhf', 'bank-schedule', 'summary'] as const).map((type) => (
                <Button key={type} variant="outline" size="sm"
                  icon={<Download className="h-3.5 w-3.5" />}
                  loading={downloading === type}
                  onClick={() => handleDownloadReport(type)}>
                  {type.replace('-', ' ').toUpperCase()}
                </Button>
              ))}
              <Button variant="outline" size="sm"
                icon={<FileText className="h-3.5 w-3.5" />}
                loading={downloading === 'payslips-all'}
                onClick={() => handleDownloadPayslip()}>
                All Payslips (ZIP)
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Employee Entries */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-slate-900">
            Employee Breakdown ({run.entries?.length || 0})
          </h2>
        </CardHeader>
        <div className="divide-y divide-slate-100">
          {run.entries?.map((entry) => {
            const isExpanded = expanded.has(entry.id);
            const earnings = entry.details?.filter((d) => d.type === 'earning' || d.type === 'bonus') || [];
            const deductions = entry.details?.filter((d) => d.type === 'deduction' || d.type === 'statutory_deduction') || [];
            const employerCosts = entry.details?.filter((d) => d.type === 'employer_cost') || [];

            return (
              <div key={entry.id}>
                <div
                  className="flex items-center justify-between px-6 py-3 hover:bg-slate-50/50 cursor-pointer"
                  onClick={() => toggleExpand(entry.id)}
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
                    <div>
                      <p className="text-sm font-medium text-slate-900">{entry.employee?.full_name || `Employee #${entry.employee_id}`}</p>
                      <p className="text-xs text-slate-500">{entry.employee?.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">{formatNGN(entry.net_pay)}</p>
                    <p className="text-xs text-slate-500">net pay</p>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-6 pb-4 grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/30">
                    {/* Earnings */}
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-2">Earnings</p>
                      {earnings.map((d, i) => (
                        <div key={i} className="flex justify-between text-sm py-1">
                          <span className="text-slate-600">{d.name}</span>
                          <span className="text-slate-900">{formatNGN(d.amount)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm py-1 font-semibold border-t border-slate-200 mt-1 pt-1">
                        <span>Gross</span>
                        <span>{formatNGN(entry.gross_pay)}</span>
                      </div>
                    </div>

                    {/* Deductions */}
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-2">Deductions</p>
                      {deductions.map((d, i) => (
                        <div key={i} className="flex justify-between text-sm py-1">
                          <span className="text-slate-600">{d.name}</span>
                          <span className="text-red-600">-{formatNGN(d.amount)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm py-1 font-semibold border-t border-slate-200 mt-1 pt-1">
                        <span>Net Pay</span>
                        <span className="text-[#22BC66]">{formatNGN(entry.net_pay)}</span>
                      </div>
                    </div>

                    {/* Employer Costs */}
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-2">Employer Costs</p>
                      {employerCosts.length > 0 ? employerCosts.map((d, i) => (
                        <div key={i} className="flex justify-between text-sm py-1">
                          <span className="text-slate-600">{d.name}</span>
                          <span className="text-slate-900">{formatNGN(d.amount)}</span>
                        </div>
                      )) : (
                        <p className="text-xs text-slate-400">No employer costs</p>
                      )}
                      <div className="flex justify-between text-sm py-1 font-semibold border-t border-slate-200 mt-1 pt-1">
                        <span>Cost to Company</span>
                        <span>{formatNGN(entry.total_cost_to_company)}</span>
                      </div>

                      {/* Individual payslip download */}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDownloadPayslip(entry.employee_id); }}
                        className="mt-2 flex items-center gap-1.5 text-xs text-[#3B82F6] hover:underline cursor-pointer"
                      >
                        <FileText className="h-3.5 w-3.5" /> Download payslip
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Reject Modal */}
      <Modal open={rejectOpen} onClose={() => setRejectOpen(false)} title="Reject payroll">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Provide a reason for rejecting this payroll run. The operator will be notified.
          </p>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Explain why this payroll is being rejected..."
            rows={3}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-[#22BC66]/20 focus:border-[#22BC66]
              resize-none"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setRejectOpen(false)}>Cancel</Button>
            <Button
              variant="danger"
              disabled={!rejectReason.trim()}
              loading={rejectPayroll.isPending}
              onClick={() => {
                rejectPayroll.mutate(
                  { id: runId, reason: rejectReason },
                  { onSuccess: () => { setRejectOpen(false); setRejectReason(''); } }
                );
              }}
            >
              Reject payroll
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
