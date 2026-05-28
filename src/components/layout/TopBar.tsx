import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Menu, ChevronRight, LogOut, User } from 'lucide-react';

const breadcrumbMap: Record<string, string> = {
  '': 'Dashboard',
  employees: 'Employees',
  cadres: 'Salary Grades',
  deductions: 'Deductions',
  payroll: 'Payroll',
  transfers: 'Transfers',
  wallet: 'Wallet',
  settings: 'Settings',
  new: 'Create',
  edit: 'Edit',
  import: 'Import CSV',
  'audit-logs': 'Audit Logs',
  team: 'Team Members',
  invite: 'Invite User',
  batch: 'Batch Transfer',
  transactions: 'Transactions',
};

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const segments = location.pathname.split('/').filter(Boolean);
  const breadcrumbs = [
    { label: 'Dashboard', path: '/' },
    ...segments.map((seg, i) => ({
      label:
        breadcrumbMap[seg] ||
        (seg.match(/^\d+$/) ? `#${seg}` : seg.charAt(0).toUpperCase() + seg.slice(1)),
      path: '/' + segments.slice(0, i + 1).join('/'),
    })),
  ];

  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav className="flex items-center text-sm">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.path} className="flex items-center">
              {i > 0 && (
                <ChevronRight className="h-3.5 w-3.5 text-slate-300 mx-1.5" />
              )}
              {i === breadcrumbs.length - 1 ? (
                <span className="text-slate-900 font-medium">{crumb.label}</span>
              ) : (
                <button
                  onClick={() => navigate(crumb.path)}
                  className="text-slate-500 hover:text-slate-700 cursor-pointer"
                >
                  {crumb.label}
                </button>
              )}
            </span>
          ))}
        </nav>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <div className="h-8 w-8 rounded-full bg-[#22BC66] flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="hidden md:block text-left">
            <p className="text-sm font-medium text-slate-900 leading-tight">
              {user?.email}
            </p>
            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
          </div>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-slate-200 shadow-lg py-1 z-50">
            <div className="px-3 py-2 border-b border-slate-100 md:hidden">
              <p className="text-sm font-medium text-slate-900">{user?.email}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
