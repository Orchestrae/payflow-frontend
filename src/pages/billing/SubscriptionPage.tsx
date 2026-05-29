import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CreditCard, ArrowUpCircle, XCircle, Receipt, Calendar } from 'lucide-react';
import { billingApi } from '@/api/billing';
import { formatNGN } from '@/utils/currency';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { CardSkeleton } from '@/components/shared/Skeleton';
import { Modal } from '@/components/ui/Modal';
import { useState } from 'react';

const tierBadgeColors: Record<string, string> = {
  free: 'bg-slate-50 text-slate-600 border-slate-200',
  starter: 'bg-blue-50 text-blue-700 border-blue-200',
  pro: 'bg-violet-50 text-violet-700 border-violet-200',
};

function formatDate(dateStr: string): string {
  if (!dateStr) return '--';
  return new Date(dateStr).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function SubscriptionPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showCancelModal, setShowCancelModal] = useState(false);

  const { data: subscription, isLoading: subLoading } = useQuery({
    queryKey: ['billing', 'subscription'],
    queryFn: () => billingApi.getSubscription().then((r) => r.data),
  });

  const { data: invoicesData, isLoading: invoicesLoading } = useQuery({
    queryKey: ['billing', 'invoices'],
    queryFn: () => billingApi.getInvoices().then((r) => r.data),
  });

  const cancelSub = useMutation({
    mutationFn: () => billingApi.cancel(),
    onSuccess: () => {
      toast.success('Subscription cancelled');
      queryClient.invalidateQueries({ queryKey: ['billing'] });
      setShowCancelModal(false);
    },
    onError: () => {
      toast.error('Failed to cancel subscription');
    },
  });

  const isLoading = subLoading || invoicesLoading;

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Subscription</h1>
        <div className="space-y-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  const plan = subscription?.plan;
  const invoices = invoicesData?.data ?? [];
  const tier = plan?.tier ?? 'free';

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Subscription</h1>

      {/* Current subscription */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-900">Current Subscription</h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-1">Plan</p>
              <p className="text-lg font-semibold text-slate-900">{plan?.name ?? 'No plan'}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-1">Tier</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border capitalize ${tierBadgeColors[tier] || tierBadgeColors.free}`}>
                {tier}
              </span>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-1">Billing Period</p>
              <div className="flex items-center gap-1.5 text-sm text-slate-700">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>
                  {formatDate(subscription?.current_period_start ?? '')} - {formatDate(subscription?.current_period_end ?? '')}
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-1">Status</p>
              <StatusBadge status={subscription?.status ?? 'inactive'} />
            </div>
          </div>

          <div className="flex gap-2 mt-6 pt-4 border-t border-slate-100">
            <Button
              variant="secondary"
              icon={<ArrowUpCircle className="h-4 w-4" />}
              onClick={() => navigate('/billing/plans')}
            >
              Upgrade
            </Button>
            {subscription?.status === 'active' && tier !== 'free' && (
              <Button
                variant="danger"
                icon={<XCircle className="h-4 w-4" />}
                onClick={() => setShowCancelModal(true)}
              >
                Cancel Subscription
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Invoice history */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-900">Invoice History</h2>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Date</th>
                <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Period</th>
                <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Amount</th>
                <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Reference</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">
                    No invoices yet
                  </td>
                </tr>
              ) : (
                invoices.map((invoice, idx) => (
                  <tr
                    key={invoice.id}
                    className={`border-b border-slate-50 ${idx % 2 === 1 ? 'bg-slate-50/30' : ''}`}
                  >
                    <td className="px-6 py-3 text-slate-700">{formatDate(invoice.created_at)}</td>
                    <td className="px-6 py-3 text-slate-600">
                      {formatDate(invoice.period_start)} - {formatDate(invoice.period_end)}
                    </td>
                    <td className="px-6 py-3 font-medium text-slate-900">{formatNGN(invoice.amount)}</td>
                    <td className="px-6 py-3">
                      <StatusBadge status={invoice.status} />
                    </td>
                    <td className="px-6 py-3 text-slate-500 font-mono text-xs">{invoice.paystack_ref}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Cancel Confirmation Modal */}
      <Modal
        open={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Subscription"
      >
        <p className="text-sm text-slate-600 mb-6">
          Are you sure you want to cancel your subscription? You will lose access to premium features
          at the end of your current billing period.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setShowCancelModal(false)}>
            Keep Subscription
          </Button>
          <Button
            variant="danger"
            loading={cancelSub.isPending}
            onClick={() => cancelSub.mutate()}
          >
            Cancel Subscription
          </Button>
        </div>
      </Modal>
    </div>
  );
}
