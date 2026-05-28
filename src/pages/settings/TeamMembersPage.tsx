import { Users } from 'lucide-react';
import { useEmployees } from '@/hooks/useApi';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { TableSkeleton } from '@/components/shared/Skeleton';

export default function TeamMembersPage() {
  const { data: employees, isLoading } = useEmployees();

  if (isLoading) return <Card><TableSkeleton /></Card>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Team Members</h1>

      {!employees?.length ? (
        <Card>
          <EmptyState
            icon={<Users className="h-12 w-12" />}
            title="No team members"
            description="Invite operators and approvers to help manage payroll."
          />
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <tr key={emp.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-6 py-3 font-medium text-slate-900">{emp.full_name}</td>
                    <td className="px-6 py-3 text-slate-600">{emp.email}</td>
                    <td className="px-6 py-3">
                      <StatusBadge status={emp.is_active ? 'active' : 'inactive'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
