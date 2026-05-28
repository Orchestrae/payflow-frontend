import { useState } from 'react';
import { Receipt } from 'lucide-react';
import { useWalletTransactions } from '@/hooks/useApi';
import { formatNGN } from '@/utils/currency';
import { formatDateTime } from '@/utils/date';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Pagination } from '@/components/shared/Pagination';
import { TableSkeleton } from '@/components/shared/Skeleton';

export default function TransactionsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useWalletTransactions(page);

  const transactions = data?.transactions || [];
  const totalPages = data ? Math.ceil(data.total / data.limit) : 0;

  if (isLoading) return <Card><TableSkeleton /></Card>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Transaction History</h1>

      {!transactions.length ? (
        <Card>
          <EmptyState
            icon={<Receipt className="h-12 w-12" />}
            title="No transactions yet"
            description="Transactions will appear here when funds are deposited or withdrawn from your wallet."
          />
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Type</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Description</th>
                  <th className="text-right px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Amount</th>
                  <th className="text-right px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Balance After</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-6 py-3"><StatusBadge status={tx.transaction_type} /></td>
                    <td className="px-6 py-3 text-slate-600">{tx.description || tx.reference}</td>
                    <td className={`px-6 py-3 text-right font-medium
                      ${tx.transaction_type === 'deposit' || tx.transaction_type === 'refund'
                        ? 'text-[#22BC66]' : 'text-red-600'}`}>
                      {tx.transaction_type === 'deposit' || tx.transaction_type === 'refund' ? '+' : '-'}
                      {formatNGN(tx.amount)}
                    </td>
                    <td className="px-6 py-3 text-right text-slate-700">{formatNGN(tx.balance_after)}</td>
                    <td className="px-6 py-3 text-slate-500 text-xs">{formatDateTime(tx.created_at)}</td>
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
