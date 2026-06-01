import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { hasRole } from '@/utils/roles';
import {
  LayoutDashboard,
  Users,
  Layers,
  Calculator,
  Banknote,
  ArrowRightLeft,
  Wallet,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Bell,
  CreditCard,
  Building2,
  HandCoins,
  CalendarDays,
  BookOpen,
  Scale,
} from 'lucide-react';
import type { UserRole } from '@/types';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />,
    roles: ['admin', 'operator', 'approver'],
  },
  {
    label: 'Employees',
    path: '/employees',
    icon: <Users className="h-5 w-5" />,
    roles: ['admin', 'operator'],
  },
  {
    label: 'Salary Grades',
    path: '/cadres',
    icon: <Layers className="h-5 w-5" />,
    roles: ['admin', 'operator'],
  },
  {
    label: 'Deductions',
    path: '/deductions',
    icon: <Calculator className="h-5 w-5" />,
    roles: ['admin'],
  },
  {
    label: 'Payroll',
    path: '/payroll',
    icon: <Banknote className="h-5 w-5" />,
    roles: ['admin', 'operator', 'approver'],
  },
  {
    label: 'Transfers',
    path: '/transfers',
    icon: <ArrowRightLeft className="h-5 w-5" />,
    roles: ['admin', 'operator', 'approver'],
  },
  {
    label: 'Wallet',
    path: '/wallet',
    icon: <Wallet className="h-5 w-5" />,
    roles: ['admin', 'operator', 'approver'],
  },
  {
    label: 'Ledger',
    path: '/wallet/ledger',
    icon: <BookOpen className="h-5 w-5" />,
    roles: ['admin', 'operator'],
  },
  {
    label: 'Loans',
    path: '/loans',
    icon: <HandCoins className="h-5 w-5" />,
    roles: ['admin', 'operator'],
  },
  {
    label: 'Leave',
    path: '/leave',
    icon: <CalendarDays className="h-5 w-5" />,
    roles: ['admin', 'operator', 'approver'],
  },
  {
    label: 'Notifications',
    path: '/notifications',
    icon: <Bell className="h-5 w-5" />,
    roles: ['admin', 'operator', 'approver'],
  },
  {
    label: 'Billing',
    path: '/billing',
    icon: <CreditCard className="h-5 w-5" />,
    roles: ['admin'],
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: <Settings className="h-5 w-5" />,
    roles: ['admin'],
  },
  {
    label: 'Platform',
    path: '/platform',
    icon: <Building2 className="h-5 w-5" />,
    roles: ['super_admin'],
  },
  {
    label: 'Reconciliation',
    path: '/platform/reconciliation',
    icon: <Scale className="h-5 w-5" />,
    roles: ['super_admin'],
  },
];

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const location = useLocation();
  const { user, sidebarCollapsed, toggleSidebar } = useAuthStore();
  const role = user?.role;

  const filteredItems = navItems.filter(
    (item) => role && hasRole(role, item.roles)
  );

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10">
        <div className="h-8 w-8 rounded-lg bg-[#22BC66] flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">P</span>
        </div>
        {!sidebarCollapsed && (
          <span className="text-white font-bold text-lg tracking-tight">
            PayFlow
          </span>
        )}
      </div>

      {/* Environment indicator */}
      {!sidebarCollapsed && (
        <div className="px-4 py-1.5">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full ${
            (import.meta.env.VITE_API_URL || '').includes('localhost')
              ? 'bg-amber-500/20 text-amber-400'
              : 'bg-emerald-500/20 text-emerald-400'
          }`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {(import.meta.env.VITE_API_URL || '').includes('localhost') ? 'Test Mode' : 'Live'}
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onMobileClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
              transition-all duration-150 group
              ${
                isActive(item.path)
                  ? 'bg-white/15 text-white'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }
              ${sidebarCollapsed ? 'justify-center' : ''}`}
            title={sidebarCollapsed ? item.label : undefined}
          >
            <span className="shrink-0">{item.icon}</span>
            {!sidebarCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Collapse toggle — desktop only */}
      <div className="hidden lg:block px-3 py-4 border-t border-white/10">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center w-full p-2 rounded-lg text-slate-400
            hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1a1a2e] transform transition-transform duration-200 lg:hidden
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <button
          onClick={onMobileClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-[#1a1a2e] border-r border-white/5 transition-all duration-200
          ${sidebarCollapsed ? 'w-16' : 'w-64'}`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
