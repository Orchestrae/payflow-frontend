import { useQuery } from '@tanstack/react-query';
import {
  Building2,
  Users,
  TrendingUp,
  UserPlus,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';
import { platformApi } from '@/api/platform';
import { formatNGN } from '@/utils/currency';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { CardSkeleton } from '@/components/shared/Skeleton';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

function StatCard({ label, value, icon, color, bgColor }: StatCardProps) {
  return (
    <Card hover>
      <CardContent className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 mb-1">
            {label}
          </p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div
          className={`h-10 w-10 rounded-xl flex items-center justify-center ${bgColor}`}
        >
          <span className={color}>{icon}</span>
        </div>
      </CardContent>
    </Card>
  );
}

const tierColors: Record<string, string> = {
  free: 'bg-slate-100 text-slate-700',
  starter: 'bg-blue-50 text-blue-700',
  pro: 'bg-violet-50 text-violet-700',
};

export default function PlatformDashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['platform', 'stats'],
    queryFn: () => platformApi.getStats().then((r) => r.data),
  });

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Platform Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const statCards: StatCardProps[] = [
    {
      label: 'Monthly Recurring Revenue',
      value: formatNGN(stats?.mrr ?? 0),
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      label: 'Total Organizations',
      value: stats?.total_organizations ?? 0,
      icon: <Building2 className="h-5 w-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Active Organizations',
      value: stats?.active_organizations ?? 0,
      icon: <CheckCircle2 className="h-5 w-5" />,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      label: 'Suspended Organizations',
      value: stats?.suspended_organizations ?? 0,
      icon: <ShieldAlert className="h-5 w-5" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      label: 'Signups This Month',
      value: stats?.signups_this_month ?? 0,
      icon: <UserPlus className="h-5 w-5" />,
      color: 'text-violet-600',
      bgColor: 'bg-violet-50',
    },
    {
      label: 'Total Employees',
      value: stats?.total_employees ?? 0,
      icon: <Users className="h-5 w-5" />,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
  ];

  const planDistribution = stats?.plan_distribution ?? {};

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Platform Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {statCards.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Plan Distribution */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-slate-900">Plan Distribution</h2>
        </CardHeader>
        <CardContent>
          {Object.keys(planDistribution).length === 0 ? (
            <p className="text-sm text-slate-500">No plan data available</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(planDistribution).map(([tier, count]) => {
                const total = Object.values(planDistribution).reduce((a, b) => a + b, 0);
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                const colorClass = tierColors[tier] || tierColors.free;

                return (
                  <div key={tier}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full capitalize ${colorClass}`}>
                          {tier}
                        </span>
                        <span className="text-sm text-slate-600">{count} organizations</span>
                      </div>
                      <span className="text-sm font-medium text-slate-700">{pct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          tier === 'pro'
                            ? 'bg-violet-500'
                            : tier === 'starter'
                            ? 'bg-blue-500'
                            : 'bg-slate-400'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
