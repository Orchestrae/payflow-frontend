import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Plus, Check, X } from 'lucide-react';
import { leaveApi } from '@/api/leave';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/shared/StatusBadge';

export default function LeaveListPage() {
  const queryClient = useQueryClient();

  const { data: types } = useQuery({
    queryKey: ['leave-types'],
    queryFn: () => leaveApi.getTypes().then(r => r.data),
  });

  const { data: requestsData } = useQuery({
    queryKey: ['leave-requests'],
    queryFn: () => leaveApi.listRequests().then(r => r.data),
  });

  const approveMutation = useMutation({
    mutationFn: (id: number) => leaveApi.approveRequest(id),
    onSuccess: () => { toast.success('Leave approved'); queryClient.invalidateQueries({ queryKey: ['leave-requests'] }); },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: number) => leaveApi.rejectRequest(id, 'Rejected'),
    onSuccess: () => { toast.success('Leave rejected'); queryClient.invalidateQueries({ queryKey: ['leave-requests'] }); },
  });

  const requests = requestsData?.data || [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Leave Management</h1>
        <Link to="/leave/types/new">
          <Button><Plus className="h-4 w-4 mr-2" /> Create Leave Type</Button>
        </Link>
      </div>

      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Leave Types</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="pb-3">Name</th>
                <th className="pb-3">Default Days</th>
                <th className="pb-3">Requires Approval</th>
              </tr>
            </thead>
            <tbody>
              {(types || []).map((type) => (
                <tr key={type.id} className="border-b last:border-0">
                  <td className="py-3 font-medium">{type.name}</td>
                  <td className="py-3">{type.default_days} days</td>
                  <td className="py-3"><StatusBadge status={type.requires_approval ? 'active' : 'inactive'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Leave Requests</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-slate-500">
                <th className="pb-3">Employee</th>
                <th className="pb-3">Type</th>
                <th className="pb-3">Dates</th>
                <th className="pb-3">Days</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-b last:border-0">
                  <td className="py-3 font-medium">{req.employee?.full_name || `Employee #${req.employee_id}`}</td>
                  <td className="py-3">{req.leave_type?.name || '-'}</td>
                  <td className="py-3 text-xs">{new Date(req.start_date).toLocaleDateString()} - {new Date(req.end_date).toLocaleDateString()}</td>
                  <td className="py-3">{req.days}</td>
                  <td className="py-3"><StatusBadge status={req.status} /></td>
                  <td className="py-3">
                    {req.status === 'pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => approveMutation.mutate(req.id)} className="text-green-600 hover:text-green-800"><Check className="h-4 w-4" /></button>
                        <button onClick={() => rejectMutation.mutate(req.id)} className="text-red-600 hover:text-red-800"><X className="h-4 w-4" /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-slate-400">No leave requests</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
