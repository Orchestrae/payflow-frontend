import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Check, Crown, Zap, Loader2 } from 'lucide-react';
import { billingApi } from '@/api/billing';
import { formatNGN } from '@/utils/currency';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CardSkeleton } from '@/components/shared/Skeleton';
import type { SubscriptionPlan } from '@/types';

const tierIcons: Record<string, React.ReactNode> = {
  free: <Zap className="h-6 w-6" />,
  starter: <Zap className="h-6 w-6" />,
  pro: <Crown className="h-6 w-6" />,
};

const tierColors: Record<string, { text: string; bg: string; border: string }> = {
  free: { text: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200' },
  starter: { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  pro: { text: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200' },
};

export default function PlansPage() {
  const queryClient = useQueryClient();

  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ['billing', 'plans'],
    queryFn: () => billingApi.getPlans().then((r) => r.data),
  });

  const { data: subscription, isLoading: subLoading } = useQuery({
    queryKey: ['billing', 'subscription'],
    queryFn: () => billingApi.getSubscription().then((r) => r.data),
  });

  const subscribe = useMutation({
    mutationFn: (tier: string) =>
      billingApi.subscribe(tier, window.location.origin + '/billing/subscription'),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['billing'] });
      if (res.data.payment_url) {
        window.location.href = res.data.payment_url;
      } else {
        toast.success(res.data.message || 'Subscription updated');
      }
    },
    onError: () => {
      toast.error('Failed to subscribe. Please try again.');
    },
  });

  const isLoading = plansLoading || subLoading;
  const currentTier = subscription?.plan?.tier;

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Subscription Plans</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const parseFeatures = (plan: SubscriptionPlan): string[] => {
    if (!plan.features) return [];
    try {
      const parsed = JSON.parse(plan.features);
      return Array.isArray(parsed) ? parsed : [plan.features];
    } catch {
      return plan.features.split(',').map((f) => f.trim()).filter(Boolean);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Subscription Plans</h1>
      <p className="text-sm text-slate-500 mb-8">
        Choose the plan that best fits your organization.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans?.map((plan) => {
          const isCurrent = currentTier === plan.tier;
          const colors = tierColors[plan.tier] || tierColors.free;
          const features = parseFeatures(plan);

          return (
            <Card
              key={plan.id}
              className={`relative flex flex-col ${isCurrent ? `ring-2 ring-[#22BC66] ${colors.border}` : ''}`}
            >
              {isCurrent && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center px-3 py-0.5 text-xs font-semibold rounded-full bg-[#22BC66] text-white">
                    Current Plan
                  </span>
                </div>
              )}

              <CardContent className="flex flex-col flex-1 pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${colors.bg}`}>
                    <span className={colors.text}>{tierIcons[plan.tier] || tierIcons.free}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}>
                      {plan.tier}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-slate-900">
                    {plan.price_monthly === 0 ? 'Free' : formatNGN(plan.price_monthly)}
                  </span>
                  {plan.price_monthly > 0 && (
                    <span className="text-sm text-slate-500"> / month</span>
                  )}
                </div>

                <div className="space-y-2 mb-6 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#22BC66] shrink-0" />
                    <span>Up to {plan.max_employees} employees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#22BC66] shrink-0" />
                    <span>{plan.max_payroll_runs === 0 ? 'Unlimited' : `${plan.max_payroll_runs}`} payroll runs / month</span>
                  </div>
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[#22BC66] shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto">
                  {isCurrent ? (
                    <Button variant="outline" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button
                      className="w-full"
                      loading={subscribe.isPending}
                      onClick={() => subscribe.mutate(plan.tier)}
                    >
                      Subscribe
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
