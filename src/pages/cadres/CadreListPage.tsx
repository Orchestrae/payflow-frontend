import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronDown, ChevronRight, Layers } from 'lucide-react';
import { useCadres, useDeleteCadre } from '@/hooks/useApi';
import { formatNGN } from '@/utils/currency';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/shared/EmptyState';
import { TableSkeleton } from '@/components/shared/Skeleton';
import { Modal } from '@/components/ui/Modal';

export default function CadreListPage() {
  const navigate = useNavigate();
  const { data: cadres, isLoading } = useCadres();
  const deleteCadre = useDeleteCadre();
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  function toggleExpand(id: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  if (isLoading) return <Card><TableSkeleton /></Card>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Salary Grades</h1>
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => navigate('/cadres/new')}>
          Add grade
        </Button>
      </div>

      {!cadres?.length ? (
        <Card>
          <EmptyState
            icon={<Layers className="h-12 w-12" />}
            title="No salary grades yet"
            description="Create salary grades to define earning structures for your employees."
            actionLabel="Create grade"
            onAction={() => navigate('/cadres/new')}
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {cadres.map((cadre) => {
            const isExpanded = expanded.has(cadre.id);
            const totalPay = cadre.earning_components?.reduce((sum, c) => sum + c.amount, 0) || 0;
            return (
              <Card key={cadre.id}>
                <div
                  className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                  onClick={() => toggleExpand(cadre.id)}
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{cadre.name}</p>
                      <p className="text-xs text-slate-500">
                        {cadre.earning_components?.length || 0} components &middot; Gross: {formatNGN(totalPay)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => navigate(`/cadres/${cadre.id}/edit`)}
                      className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded-md cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setConfirmDelete(cadre.id)}
                      className="px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {isExpanded && cadre.earning_components && (
                  <div className="px-6 pb-4 border-t border-slate-100">
                    <table className="w-full text-sm mt-3">
                      <thead>
                        <tr>
                          <th className="text-left text-xs font-medium uppercase text-slate-500 pb-2">Component</th>
                          <th className="text-left text-xs font-medium uppercase text-slate-500 pb-2">Type</th>
                          <th className="text-right text-xs font-medium uppercase text-slate-500 pb-2">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cadre.earning_components.map((comp, i) => (
                          <tr key={i} className="border-t border-slate-50">
                            <td className="py-2 text-slate-900">{comp.name}</td>
                            <td className="py-2 text-slate-500 capitalize">{comp.component_type}</td>
                            <td className="py-2 text-right text-slate-900 font-medium">{formatNGN(comp.amount)}</td>
                          </tr>
                        ))}
                        <tr className="border-t border-slate-200 font-semibold">
                          <td className="py-2 text-slate-900" colSpan={2}>Total Gross Pay</td>
                          <td className="py-2 text-right text-slate-900">{formatNGN(totalPay)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <Modal open={confirmDelete !== null} onClose={() => setConfirmDelete(null)} title="Delete salary grade">
        <p className="text-sm text-slate-600 mb-6">
          Employees assigned to this grade will need to be reassigned. Are you sure?
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button
            variant="danger"
            loading={deleteCadre.isPending}
            onClick={() => {
              if (confirmDelete) deleteCadre.mutate(confirmDelete, { onSuccess: () => setConfirmDelete(null) });
            }}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
