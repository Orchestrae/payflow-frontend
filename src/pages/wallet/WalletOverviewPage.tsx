import { useNavigate } from 'react-router-dom';
import { Wallet, CreditCard, ArrowRight, Lock } from 'lucide-react';
import { useWallet } from '@/hooks/useApi';
import { formatNGN } from '@/utils/currency';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { CardSkeleton } from '@/components/shared/Skeleton';

export default function WalletOverviewPage() {
  const navigate = useNavigate();
  const { data: wallet, isLoading } = useWallet();

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Wallet</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Wallet</h1>
        <Button variant="outline" icon={<ArrowRight className="h-4 w-4" />}
          onClick={() => navigate('/wallet/transactions')}>
          View transactions
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Balance Card */}
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-[#22BC66]" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Available Balance</p>
                <p className="text-3xl font-bold text-slate-900">{formatNGN(wallet?.balance ?? 0)}</p>
              </div>
            </div>
            {(wallet?.locked_balance ?? 0) > 0 && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg">
                <Lock className="h-4 w-4 text-amber-600" />
                <span className="text-sm text-amber-700">
                  {formatNGN(wallet!.locked_balance)} locked for pending transfers
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Virtual Account Card */}
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-[#3B82F6]" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Virtual Account</p>
                <p className="text-sm text-slate-700 mt-0.5">Fund your wallet via bank transfer</p>
              </div>
            </div>
            {wallet?.virtual_account_number ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">Account Number</span>
                  <span className="text-sm font-mono font-semibold text-slate-900">{wallet.virtual_account_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">Bank</span>
                  <span className="text-sm text-slate-700">{wallet.virtual_account_bank_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">Provider</span>
                  <span className="text-sm text-slate-700 capitalize">{wallet.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-slate-500">Status</span>
                  <span className="text-sm text-emerald-600 capitalize">{wallet.virtual_account_status}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No virtual account set up yet. Create one via the Wallet API to start receiving funds.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
