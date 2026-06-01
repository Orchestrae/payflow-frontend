import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, AlertTriangle, RefreshCw } from 'lucide-react';
import { walletApi } from '@/api/wallet';
import { formatNGN } from '@/utils/currency';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CardSkeleton } from '@/components/shared/Skeleton';
import type { ReconciliationResult } from '@/types';

export default function ReconciliationDashboardPage() {
  const { data: reconciliation, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['platform-reconciliation'],
    queryFn: () => walletApi.getReconciliation().then((r) => r.data),
  });

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Reconciliation</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
      </div>
    );
  }

  const r = reconciliation as ReconciliationResult | undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reconciliation</h1>
          <p className="text-sm text-slate-500 mt-1">Compare wallet balances against double-entry ledger</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          loading={isFetching}
          icon={<RefreshCw className="h-4 w-4" />}
          onClick={() => refetch()}
        >
          Refresh
        </Button>
      </div>

      {r ? (
        <>
          {/* Status Banner */}
          <div className={`rounded-xl p-6 ${
            r.is_reconciled
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'
              : 'bg-gradient-to-r from-red-50 to-amber-50 border border-red-200'
          }`}>
            <div className="flex items-center gap-4">
              {r.is_reconciled ? (
                <ShieldCheck className="h-10 w-10 text-green-500" />
              ) : (
                <AlertTriangle className="h-10 w-10 text-red-500" />
              )}
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {r.is_reconciled ? 'All Balanced' : 'Discrepancy Detected'}
                </h2>
                <p className="text-sm text-slate-600 mt-0.5">
                  {r.is_reconciled
                    ? 'Wallet balance matches the ledger — no discrepancies.'
                    : `Discrepancy of ${formatNGN(Math.abs(r.discrepancy))} detected. Investigate immediately.`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-5 pb-5">
                <p className="text-xs text-slate-500 uppercase tracking-wide">Wallet Balance</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{formatNGN(r.wallet_balance)}</p>
                <p className="text-xs text-slate-400 mt-1">Source: business_wallets table</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-5">
                <p className="text-xs text-slate-500 uppercase tracking-wide">Ledger Balance</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{formatNGN(r.ledger_balance)}</p>
                <p className="text-xs text-slate-400 mt-1">Source: SUM(credits) - SUM(debits)</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-5">
                <p className="text-xs text-green-600 uppercase tracking-wide">Total Credits</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{formatNGN(r.ledger_credits)}</p>
                <p className="text-xs text-slate-400 mt-1">All deposits + incoming</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-5">
                <p className="text-xs text-red-600 uppercase tracking-wide">Total Debits</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{formatNGN(r.ledger_debits)}</p>
                <p className="text-xs text-slate-400 mt-1">All withdrawals + fees</p>
              </CardContent>
            </Card>
          </div>

          {r.discrepancy !== 0 && (
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-red-700">Discrepancy Details</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Wallet balance</span>
                    <span className="font-mono">{formatNGN(r.wallet_balance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Ledger balance</span>
                    <span className="font-mono">{formatNGN(r.ledger_balance)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-semibold text-red-700">
                    <span>Discrepancy</span>
                    <span className="font-mono">{formatNGN(r.discrepancy)}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-3">
                    {r.discrepancy > 0
                      ? 'Wallet has more than ledger — possible deposit not recorded in ledger.'
                      : 'Ledger has more than wallet — possible withdrawal not deducted from wallet.'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-slate-500">No wallet found. Create a wallet first to see reconciliation data.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
