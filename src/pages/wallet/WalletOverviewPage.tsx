import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Wallet, CreditCard, ArrowRight, Lock, BookOpen, Plus, Banknote } from 'lucide-react';
import { useWallet } from '@/hooks/useApi';
import { walletApi } from '@/api/wallet';
import { formatNGN } from '@/utils/currency';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { CardSkeleton } from '@/components/shared/Skeleton';

export default function WalletOverviewPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: wallet, isLoading } = useWallet();

  // Fund Wallet modal state
  const [fundOpen, setFundOpen] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const [fundLoading, setFundLoading] = useState(false);

  // Create Virtual Account state
  const [bvnPromptOpen, setBvnPromptOpen] = useState(false);
  const [bvn, setBvn] = useState('');
  const createVirtualAccount = useMutation({
    mutationFn: (bvnValue?: string) => walletApi.createVirtualAccount(bvnValue ? { bvn: bvnValue } : undefined).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      toast.success('Virtual account created!');
      setBvnPromptOpen(false);
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.error || err.message || 'Failed to create virtual account';
      if (msg.includes('BVN')) {
        setBvnPromptOpen(true);
      } else {
        toast.error(msg);
      }
    },
  });

  async function handleFundWallet() {
    const amountKobo = Math.round(parseFloat(fundAmount) * 100);
    if (!amountKobo || amountKobo < 10000) {
      toast.error('Minimum deposit is NGN 100');
      return;
    }
    setFundLoading(true);
    try {
      const res = await walletApi.initiateDeposit(amountKobo);
      const paymentUrl = res.data.payment_url;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        toast.error('No payment URL returned');
      }
    } catch {
      toast.error('Failed to initiate deposit');
    }
    setFundLoading(false);
  }

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
        <div className="flex gap-2">
          <Button icon={<Banknote className="h-4 w-4" />} onClick={() => setFundOpen(true)}>
            Fund Wallet
          </Button>
          <Button variant="outline" icon={<BookOpen className="h-4 w-4" />}
            onClick={() => navigate('/wallet/ledger')}>
            Ledger
          </Button>
          <Button variant="outline" icon={<ArrowRight className="h-4 w-4" />}
            onClick={() => navigate('/wallet/transactions')}>
            Transactions
          </Button>
        </div>
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
              <div className="text-center py-4">
                <p className="text-sm text-slate-500 mb-4">
                  No virtual account yet. Create one to receive bank transfers directly into your wallet.
                </p>
                <Button
                  variant="secondary"
                  icon={<Plus className="h-4 w-4" />}
                  loading={createVirtualAccount.isPending}
                  onClick={() => createVirtualAccount.mutate()}
                >
                  Create Virtual Account
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* BVN Prompt Modal — only shown if BVN is not on business profile */}
      <Modal open={bvnPromptOpen} onClose={() => setBvnPromptOpen(false)} title="BVN Required">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Your BVN is needed to create a virtual account. You can also add it permanently in Business Settings.
          </p>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">BVN (11 digits)</label>
            <input
              type="text"
              maxLength={11}
              value={bvn}
              onChange={(e) => setBvn(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter your 11-digit BVN"
              className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22BC66]/20 focus:border-[#22BC66]"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setBvnPromptOpen(false)}>Cancel</Button>
            <Button
              loading={createVirtualAccount.isPending}
              disabled={bvn.length !== 11}
              onClick={() => createVirtualAccount.mutate(bvn)}
            >
              Create Account
            </Button>
          </div>
        </div>
      </Modal>

      {/* Fund Wallet Modal */}
      <Modal open={fundOpen} onClose={() => setFundOpen(false)} title="Fund Wallet">
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Enter the amount to deposit. You'll be redirected to complete payment via card, bank transfer, or USSD.
          </p>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Amount (NGN)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">&#8358;</span>
              <input
                type="number"
                min="100"
                step="100"
                value={fundAmount}
                onChange={(e) => setFundAmount(e.target.value)}
                placeholder="5,000"
                className="w-full pl-8 pr-3 py-2.5 text-sm border border-slate-300 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-[#22BC66]/20 focus:border-[#22BC66]"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">Minimum: NGN 100</p>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setFundOpen(false)}>Cancel</Button>
            <Button
              loading={fundLoading}
              disabled={!fundAmount || parseFloat(fundAmount) < 100}
              onClick={handleFundWallet}
            >
              Proceed to payment
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
