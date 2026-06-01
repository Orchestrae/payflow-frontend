import { Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  Banknote,
  Clock,
  Wallet,
  TrendingUp,
  ArrowRight,
  CalendarDays,
  HandCoins,
  BookOpen,
  Layers,
} from 'lucide-react';
import { useDashboard } from '@/hooks/useApi';
import { formatNGN } from '@/utils/currency';
import { Card, CardContent } from '@/components/ui/Card';
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

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const stats: StatCardProps[] = [
    {
      label: 'Total Employees',
      value: data?.total_employees ?? 0,
      icon: <Users className="h-5 w-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Active Employees',
      value: data?.active_employees ?? 0,
      icon: <UserCheck className="h-5 w-5" />,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      label: 'Payroll Runs',
      value: data?.payroll_runs ?? 0,
      icon: <Banknote className="h-5 w-5" />,
      color: 'text-violet-600',
      bgColor: 'bg-violet-50',
    },
    {
      label: 'Pending Approvals',
      value: data?.pending_approvals ?? 0,
      icon: <Clock className="h-5 w-5" />,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      label: 'Wallet Balance',
      value: formatNGN(data?.wallet_balance ?? 0),
      icon: <Wallet className="h-5 w-5" />,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      label: 'Last Payroll Cost',
      value: formatNGN(data?.last_payroll_cost ?? 0),
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'text-slate-600',
      bgColor: 'bg-slate-100',
    },
  ];

  const quickLinks = [
    { label: 'Run Payroll', path: '/payroll/new', icon: <Banknote className="h-4 w-4" /> },
    { label: 'Add Employee', path: '/employees/new', icon: <Users className="h-4 w-4" /> },
    { label: 'Leave Requests', path: '/leave', icon: <CalendarDays className="h-4 w-4" /> },
    { label: 'Loans', path: '/loans', icon: <HandCoins className="h-4 w-4" /> },
    { label: 'Ledger', path: '/wallet/ledger', icon: <BookOpen className="h-4 w-4" /> },
    { label: 'Salary Grades', path: '/cadres', icon: <Layers className="h-4 w-4" /> },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-semibold text-slate-900 mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {quickLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-indigo-200 transition-colors group"
          >
            <span className="text-slate-400 group-hover:text-indigo-500 transition-colors">{link.icon}</span>
            <span>{link.label}</span>
            <ArrowRight className="h-3 w-3 ml-auto text-slate-300 group-hover:text-indigo-400 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
