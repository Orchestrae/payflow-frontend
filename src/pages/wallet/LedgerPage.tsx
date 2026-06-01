import { useState } from 'react';
import { BookOpen, CheckCircle, AlertTriangle, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useLedgerEntries, useReconciliation } from '@/hooks/useApi';
import { formatNGN } from '@/utils/currency';
import { formatDateTime } from '@/utils/date';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { EmptyState } from '@/components/shared/EmptyState';
import { Pagination } from '@/components/shared/Pagination';
import { TableSkeleton } from '@/components/shared/Skeleton';

export default function LedgerPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useLedgerEntries(page);
  const { data: reconciliation } = useReconciliation();

  const entries = data?.entries || [];
  const totalPages = data ? Math.ceil(data.total / data.limit) : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Double-Entry Ledger</h1>

      {/* Reconciliation Summary */}
      {reconciliation && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide">Wallet Balance</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{formatNGN(reconciliation.wallet_balance)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide">Total Credits</p>
              <p className="text-xl font-bold text-green-600 mt-1">{formatNGN(reconciliation.ledger_credits)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide">Total Debits</p>
              <p className="text-xl font-bold text-red-600 mt-1">{formatNGN(reconciliation.ledger_debits)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-xs text-slate-500 uppercase tracking-wide">Status</p>
              <div className="flex items-center gap-2 mt-1">
                {reconciliation.is_reconciled ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-lg font-semibold text-green-600">Reconciled</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <span className="text-lg font-semibold text-amber-600">
                      Discrepancy: {formatNGN(Math.abs(reconciliation.discrepancy))}
                    </span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Ledger Entries Table */}
      {isLoading ? (
        <Card><TableSkeleton /></Card>
      ) : entries.length === 0 ? (
        <Card>
          <EmptyState
            icon={<BookOpen className="h-12 w-12" />}
            title="No ledger entries yet"
            description="Ledger entries are created automatically when deposits and withdrawals occur."
          />
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-900">Ledger Entries</h2>
            <p className="text-xs text-slate-500 mt-1">Every financial transaction is recorded as a debit/credit pair</p>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Transaction</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Account</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Type</th>
                  <th className="text-right px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Description</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-6 py-3 text-slate-500 text-xs whitespace-nowrap">
                      {formatDateTime(entry.created_at)}
                    </td>
                    <td className="px-6 py-3 text-slate-600 font-mono text-xs">
                      {entry.transaction_id.substring(0, 12)}...
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-flex px-2 py-0.5 text-xs rounded-full bg-slate-100 text-slate-700 capitalize">
                        {entry.account_type}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      {entry.entry_type === 'credit' ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600">
                          <ArrowDownRight className="h-3.5 w-3.5" /> Credit
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-red-600">
                          <ArrowUpRight className="h-3.5 w-3.5" /> Debit
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-right font-medium text-slate-900">
                      {formatNGN(entry.amount)}
                    </td>
                    <td className="px-6 py-3 text-slate-600 text-xs max-w-[200px] truncate">
                      {entry.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100">
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
