import type { UserRole } from '@/types';

const rolePermissions: Record<string, UserRole[]> = {
  'employees.read': ['admin', 'operator'],
  'employees.write': ['admin', 'operator'],
  'cadres.read': ['admin', 'operator'],
  'cadres.write': ['admin', 'operator'],
  'deductions.read': ['admin'],
  'deductions.write': ['admin'],
  'payroll.read': ['admin', 'operator', 'approver'],
  'payroll.create': ['admin', 'operator'],
  'payroll.submit': ['admin', 'operator'],
  'payroll.approve': ['admin', 'approver'],
  'payroll.reject': ['admin', 'approver'],
  'payroll.process': ['admin', 'operator'],
  'transfers.read': ['admin', 'operator', 'approver'],
  'transfers.write': ['admin', 'operator', 'approver'],
  'wallet.read': ['admin', 'operator', 'approver'],
  'settings.read': ['admin'],
  'settings.write': ['admin'],
  'audit.read': ['admin'],
  'invite.write': ['admin'],
};

export function canAccess(role: UserRole, feature: string): boolean {
  const allowed = rolePermissions[feature];
  if (!allowed) return false;
  return allowed.includes(role);
}

export function hasRole(role: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(role);
}
