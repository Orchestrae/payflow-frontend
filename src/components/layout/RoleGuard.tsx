import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import type { UserRole } from '@/types';

interface RoleGuardProps {
  allowedRoles: UserRole[];
}

export function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const role = useAuthStore((s) => s.user?.role);

  if (!role || !allowedRoles.includes(role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="text-lg font-semibold text-slate-900 mb-2">
          Access restricted
        </h2>
        <p className="text-sm text-slate-500">
          You don't have permission to view this page. Contact your administrator for access.
        </p>
      </div>
    );
  }

  return <Outlet />;
}
