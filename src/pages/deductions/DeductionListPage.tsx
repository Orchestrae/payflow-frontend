import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calculator } from 'lucide-react';
import { useDeductionRules, useDeleteDeductionRule } from '@/hooks/useApi';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/shared/EmptyState';
import { TableSkeleton } from '@/components/shared/Skeleton';
import { Modal } from '@/components/ui/Modal';

export default function DeductionListPage() {
  const navigate = useNavigate();
  const { data: rules, isLoading } = useDeductionRules();
  const deleteRule = useDeleteDeductionRule();
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  if (isLoading) return <Card><TableSkeleton /></Card>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Deduction Rules</h1>
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => navigate('/deductions/new')}>
          Add rule
        </Button>
      </div>

      {!rules?.length ? (
        <Card>
          <EmptyState
            icon={<Calculator className="h-12 w-12" />}
            title="No deduction rules yet"
            description="Define rules for taxes, pension, or custom deductions that apply to payroll."
            actionLabel="Create rule"
            onAction={() => navigate('/deductions/new')}
          />
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Type</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Value</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Basis</th>
                  <th className="text-right px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rules.map((rule) => (
                  <tr key={rule.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-6 py-3 font-medium text-slate-900">{rule.name}</td>
                    <td className="px-6 py-3 text-slate-600 capitalize">{rule.type}</td>
                    <td className="px-6 py-3 text-slate-600">
                      {rule.type === 'percentage' ? `${rule.value}%` : `NGN ${rule.value.toLocaleString()}`}
                    </td>
                    <td className="px-6 py-3 text-slate-600 capitalize">{rule.calculation_basis.replace('_', ' ')}</td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => navigate(`/deductions/${rule.id}/edit`)}
                          className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer">
                          Edit
                        </button>
                        <button onClick={() => setConfirmDelete(rule.id)}
                          className="px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 rounded-md cursor-pointer">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal open={confirmDelete !== null} onClose={() => setConfirmDelete(null)} title="Delete deduction rule">
        <p className="text-sm text-slate-600 mb-6">This rule will no longer be applied to future payroll runs.</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button variant="danger" loading={deleteRule.isPending}
            onClick={() => { if (confirmDelete) deleteRule.mutate(confirmDelete, { onSuccess: () => setConfirmDelete(null) }); }}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
