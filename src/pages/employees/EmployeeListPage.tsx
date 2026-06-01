import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Upload, Search, UserX, Users, CheckCircle, AlertCircle } from 'lucide-react';
import { useEmployees, useDeactivateEmployee } from '@/hooks/useApi';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { TableSkeleton } from '@/components/shared/Skeleton';
import { Modal } from '@/components/ui/Modal';

export default function EmployeeListPage() {
  const navigate = useNavigate();
  const { data: employees, isLoading } = useEmployees();
  const deactivate = useDeactivateEmployee();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [confirmDeactivate, setConfirmDeactivate] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (!employees) return [];
    return employees.filter((emp) => {
      const matchesSearch =
        emp.full_name.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && emp.is_active) ||
        (statusFilter === 'inactive' && !emp.is_active);
      return matchesSearch && matchesStatus;
    });
  }, [employees, search, statusFilter]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            icon={<Upload className="h-4 w-4" />}
            onClick={() => navigate('/employees/import')}
          >
            Import CSV
          </Button>
          <Button
            icon={<Plus className="h-4 w-4" />}
            onClick={() => navigate('/employees/new')}
          >
            Add employee
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-[#22BC66]/20 focus:border-[#22BC66]"
          />
        </div>
        <div className="flex gap-1">
          {(['all', 'active', 'inactive'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors cursor-pointer
                ${statusFilter === status
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <Card><TableSkeleton rows={8} cols={5} /></Card>
      ) : !employees?.length ? (
        <Card>
          <EmptyState
            icon={<Users className="h-12 w-12" />}
            title="No employees yet"
            description="Add your first employee to get started with payroll. You can add them one by one or import a CSV file."
            actionLabel="Add employee"
            onAction={() => navigate('/employees/new')}
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
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Bank</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Verified</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp) => (
                  <tr
                    key={emp.id}
                    className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-3 font-medium text-slate-900">{emp.full_name}</td>
                    <td className="px-6 py-3 text-slate-600">{emp.email}</td>
                    <td className="px-6 py-3 text-slate-600">{emp.bank_name}</td>
                    <td className="px-6 py-3">
                      {emp.bank_account_verified ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600" title={emp.bank_account_name || 'Verified'}>
                          <CheckCircle className="h-3.5 w-3.5" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                          <AlertCircle className="h-3.5 w-3.5" /> Unverified
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <StatusBadge status={emp.is_active ? 'active' : 'inactive'} />
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => navigate(`/employees/${emp.id}/edit`)}
                          className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer"
                        >
                          Edit
                        </button>
                        {emp.is_active && (
                          <button
                            onClick={() => setConfirmDeactivate(emp.id)}
                            className="px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
                          >
                            Deactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && employees.length > 0 && (
            <div className="py-8 text-center text-sm text-slate-500">
              No employees match your search
            </div>
          )}
        </Card>
      )}

      {/* Deactivate Confirmation */}
      <Modal
        open={confirmDeactivate !== null}
        onClose={() => setConfirmDeactivate(null)}
        title="Deactivate employee"
      >
        <p className="text-sm text-slate-600 mb-6">
          This employee will be excluded from future payroll runs. You can't undo this action.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setConfirmDeactivate(null)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            loading={deactivate.isPending}
            icon={<UserX className="h-4 w-4" />}
            onClick={() => {
              if (confirmDeactivate) {
                deactivate.mutate(confirmDeactivate, {
                  onSuccess: () => setConfirmDeactivate(null),
                });
              }
            }}
          >
            Deactivate
          </Button>
        </div>
      </Modal>
    </div>
  );
}
