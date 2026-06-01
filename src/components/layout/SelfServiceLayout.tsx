import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  CalendarDays,
  User,
  Landmark,
  Bell,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const navItems = [
  { to: '/self-service/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/self-service/payslips', label: 'Payslips', icon: FileText },
  { to: '/self-service/leave', label: 'Leave', icon: CalendarDays },
  { to: '/self-service/loans', label: 'Loans', icon: Landmark },
  { to: '/self-service/profile', label: 'Profile', icon: User },
];

export function SelfServiceLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/employee-login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-[#22BC66] flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-base">P</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold text-slate-900 tracking-tight">
                  PayFlow
                </span>
                {user?.company_name && (
                  <span className="text-xs text-slate-400 ml-2 font-medium">
                    {user.company_name}
                  </span>
                )}
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-[#22BC66]/10 text-[#22BC66]'
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="relative p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#22BC66]" />
              </button>

              <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200">
                <div className="h-8 w-8 rounded-full bg-[#22BC66]/10 flex items-center justify-center">
                  <span className="text-[#22BC66] font-semibold text-sm">
                    {user?.full_name
                      ? user.full_name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)
                      : 'U'}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900 leading-tight">
                    {user?.full_name || user?.email || 'Employee'}
                  </p>
                  <p className="text-xs text-slate-400">Employee</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </button>

              {/* Mobile menu toggle */}
              <button
                type="button"
                className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white">
            <nav className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#22BC66]/10 text-[#22BC66]'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`
                  }
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
        <Outlet />
      </main>
    </div>
  );
}
