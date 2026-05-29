import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Building2, ShieldOff, ShieldCheck } from 'lucide-react';
import { platformApi } from '@/api/platform';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Modal } from '@/components/ui/Modal';
import { TableSkeleton } from '@/components/shared/Skeleton';
import { EmptyState } from '@/components/shared/EmptyState';

const tierBadgeColors: Record<string, string> = {
  free: 'bg-slate-50 text-slate-600 border-slate-200',
  starter: 'bg-blue-50 text-blue-700 border-blue-200',
  pro: 'bg-violet-50 text-violet-700 border-violet-200',
};

function formatDate(dateStr: string): string {
  if (!dateStr) return '--';
  return new Date(dateStr).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function OrganizationListPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [suspendTarget, setSuspendTarget] = useState<number | null>(null);
  const [suspendReason, setSuspendReason] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['platform', 'organizations', page],
    queryFn: () => platformApi.getOrganizations(page).then((r) => r.data),
  });

  const suspendOrg = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) =>
      platformApi.suspendOrg(id, reason),
    onSuccess: () => {
      toast.success('Organization suspended');
      queryClient.invalidateQueries({ queryKey: ['platform'] });
      setSuspendTarget(null);
      setSuspendReason('');
    },
    onError: () => {
      toast.error('Failed to suspend organization');
    },
  });

  const activateOrg = useMutation({
    mutationFn: (id: number) => platformApi.activateOrg(id),
    onSuccess: () => {
      toast.success('Organization activated');
      queryClient.invalidateQueries({ queryKey: ['platform'] });
    },
    onError: () => {
      toast.error('Failed to activate organization');
    },
  });

  const orgs = data?.data ?? [];
  const total = data?.total ?? 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Organizations</h1>
        <span className="text-sm text-slate-500">{total} total</span>
      </div>

      {isLoading ? (
        <Card>
          <TableSkeleton rows={8} cols={7} />
        </Card>
      ) : orgs.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Building2 className="h-12 w-12" />}
            title="No organizations"
            description="No organizations have signed up yet."
          />
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Business Name</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Admin Email</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Employees</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Plan</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Created</th>
                  <th className="text-right px-6 py-3 text-xs font-medium uppercase tracking-wide text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orgs.map((org, idx) => (
                  <tr
                    key={org.business_id}
                    className={`border-b border-slate-50 ${idx % 2 === 1 ? 'bg-slate-50/30' : ''}`}
                  >
                    <td className="px-6 py-3 font-medium text-slate-900">{org.business_name}</td>
                    <td className="px-6 py-3 text-slate-600">{org.admin_email}</td>
                    <td className="px-6 py-3 text-slate-700">{org.employee_count}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border capitalize ${tierBadgeColors[org.plan_tier] || tierBadgeColors.free}`}>
                        {org.plan_tier}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-1.5">
                        <StatusBadge status={org.subscription_status} />
                        {org.is_suspended && (
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full border bg-red-50 text-red-700 border-red-200">
                            Suspended
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-slate-500">{formatDate(org.created_at)}</td>
                    <td className="px-6 py-3 text-right">
                      {org.is_suspended ? (
                        <Button
                          size="sm"
                          variant="primary"
                          icon={<ShieldCheck className="h-3.5 w-3.5" />}
                          loading={activateOrg.isPending}
                          onClick={() => activateOrg.mutate(org.business_id)}
                        >
                          Activate
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="danger"
                          icon={<ShieldOff className="h-3.5 w-3.5" />}
                          onClick={() => setSuspendTarget(org.business_id)}
                        >
                          Suspend
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > 20 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                Page {page} of {Math.ceil(total / 20)}
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={page * 20 >= total}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Suspend Confirmation Modal */}
      <Modal
        open={suspendTarget !== null}
        onClose={() => {
          setSuspendTarget(null);
          setSuspendReason('');
        }}
        title="Suspend Organization"
      >
        <p className="text-sm text-slate-600 mb-4">
          This organization will be immediately suspended and lose access to the platform.
        </p>
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Reason (optional)
          </label>
          <textarea
            value={suspendReason}
            onChange={(e) => setSuspendReason(e.target.value)}
            placeholder="Enter a reason for suspension..."
            rows={3}
            className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setSuspendTarget(null);
              setSuspendReason('');
            }}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            loading={suspendOrg.isPending}
            icon={<ShieldOff className="h-4 w-4" />}
            onClick={() => {
              if (suspendTarget) {
                suspendOrg.mutate({
                  id: suspendTarget,
                  reason: suspendReason || undefined,
                });
              }
            }}
          >
            Suspend
          </Button>
        </div>
      </Modal>
    </div>
  );
}
