import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Layers, ArrowRightLeft, RotateCcw } from 'lucide-react';
import { useTransfers, useRetryTransfer } from '@/hooks/useApi';
import { formatTransferAmount } from '@/utils/currency';
import { formatDateTime } from '@/utils/date';
import { getBankName } from '@/utils/banks';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Pagination } from '@/components/shared/Pagination';
import { TableSkeleton } from '@/components/shared/Skeleton';

export default function TransferListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useTransfers(page);
  const retryTransfer = useRetryTransfer();

  const transfers = data?.transfers || [];
  const totalPages = data ? Math.ceil(data.total / data.limit) : 0;

  if (isLoading) return <Card><TableSkeleton /></Card>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Transfers</h1>
        <div className="flex gap-2">
          <Button variant="outline" icon={<Layers className="h-4 w-4" />}
            onClick={() => navigate('/transfers/batch')}>
            Batch transfer
          </Button>
          <Button icon={<Plus className="h-4 w-4" />} onClick={() => navigate('/transfers/new')}>
            New transfer
          </Button>
        </div>
      </div>

      {!transfers.length ? (
        <Card>
          <EmptyState
            icon={<ArrowRightLeft className="h-12 w-12" />}
            title="No transfers yet"
            description="Send money to bank accounts via Korapay, Paystack, or VFD."
            actionLabel="New transfer"
            onAction={() => navigate('/transfers/new')}
          />
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Recipient</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Bank</th>
                  <th className="text-right px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Provider</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Date</th>
                  <th className="text-right px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500"></th>
                </tr>
              </thead>
              <tbody>
                {transfers.map((t) => (
                  <tr key={t.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-6 py-3">
                      <p className="font-medium text-slate-900">{t.recipient_account_name}</p>
                      <p className="text-xs text-slate-500">{t.recipient_account_number}</p>
                    </td>
                    <td className="px-6 py-3 text-slate-600">{getBankName(t.recipient_bank_code)}</td>
                    <td className="px-6 py-3 text-right font-medium text-slate-900">{formatTransferAmount(t.amount)}</td>
                    <td className="px-6 py-3 text-slate-600 capitalize">{t.provider}</td>
                    <td className="px-6 py-3"><StatusBadge status={t.status} /></td>
                    <td className="px-6 py-3 text-slate-500 text-xs">{formatDateTime(t.created_at)}</td>
                    <td className="px-6 py-3 text-right">
                      {t.status === 'failed' && (
                        <Button variant="ghost" size="sm" icon={<RotateCcw className="h-3.5 w-3.5" />}
                          loading={retryTransfer.isPending}
                          onClick={() => retryTransfer.mutate(t.id)}>
                          Retry
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </Card>
      )}
    </div>
  );
}
