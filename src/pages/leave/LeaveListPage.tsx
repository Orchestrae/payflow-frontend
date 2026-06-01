import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Plus, Check, X, CalendarDays, FileText } from 'lucide-react';
import { leaveApi } from '@/api/leave';
import { useEmployees } from '@/hooks/useApi';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { TableSkeleton } from '@/components/shared/Skeleton';

export default function LeaveListPage() {
  const queryClient = useQueryClient();

  const { data: types, isLoading: typesLoading } = useQuery({
    queryKey: ['leave-types'],
    queryFn: () => leaveApi.getTypes().then(r => r.data),
  });

  const { data: requestsData, isLoading: requestsLoading } = useQuery({
    queryKey: ['leave-requests'],
    queryFn: () => leaveApi.listRequests().then(r => r.data),
  });

  const { data: employees } = useEmployees();

  const approveMutation = useMutation({
    mutationFn: (id: number) => leaveApi.approveRequest(id),
    onSuccess: () => {
      toast.success('Leave request approved');
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
    },
    onError: () => toast.error('Failed to approve leave request'),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: number) => leaveApi.rejectRequest(id, 'Rejected by admin'),
    onSuccess: () => {
      toast.success('Leave request rejected');
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
    },
    onError: () => toast.error('Failed to reject leave request'),
  });

  // Request Leave modal state
  const [requestOpen, setRequestOpen] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: '',
    leave_type_id: '',
    start_date: '',
    end_date: '',
    reason: '',
  });

  const submitRequestMutation = useMutation({
    mutationFn: (data: { employee_id: number; leave_type_id: number; start_date: string; end_date: string; days: number; reason: string }) =>
      leaveApi.submitRequest(data),
    onSuccess: () => {
      toast.success('Leave request submitted');
      queryClient.invalidateQueries({ queryKey: ['leave-requests'] });
      setRequestOpen(false);
      setFormData({ employee_id: '', leave_type_id: '', start_date: '', end_date: '', reason: '' });
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to submit leave request'),
  });

  function handleSubmitRequest() {
    if (!formData.employee_id || !formData.leave_type_id || !formData.start_date || !formData.end_date) {
      toast.error('Please fill in all required fields');
      return;
    }
    // Calculate business days (simple approximation — backend does the real count)
    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

    submitRequestMutation.mutate({
      employee_id: parseInt(formData.employee_id),
      leave_type_id: parseInt(formData.leave_type_id),
      start_date: formData.start_date,
      end_date: formData.end_date,
      days: diffDays,
      reason: formData.reason,
    });
  }

  const requests = requestsData?.data || [];

  if (typesLoading || requestsLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Leave Management</h1>
        <TableSkeleton />
      </div>
    );
  }

  const inputClass = "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22BC66]/20 focus:border-[#22BC66]";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leave Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage leave types, requests, and balances</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={<Plus className="h-4 w-4" />} onClick={() => setRequestOpen(true)}>
            Request Leave
          </Button>
          <Link to="/leave/types/new">
            <Button icon={<Plus className="h-4 w-4" />}>Create Leave Type</Button>
          </Link>
        </div>
      </div>

      {/* Leave Types */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-900">Leave Types</h2>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {!types || types.length === 0 ? (
            <EmptyState
              icon={<CalendarDays className="h-12 w-12" />}
              title="No leave types"
              description="Create leave types to allow employees to submit leave requests."
              actionLabel="Create Leave Type"
              onAction={() => window.location.href = '/leave/types/new'}
            />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Default Days</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Requires Approval</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {types.map((type) => (
                  <tr key={type.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{type.name}</td>
                    <td className="px-6 py-4 text-slate-600">{type.default_days} days</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={type.requires_approval ? 'active' : 'inactive'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Leave Requests */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-slate-900">Leave Requests</h2>
            {requests.filter(r => r.status === 'pending').length > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                {requests.filter(r => r.status === 'pending').length} pending
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {requests.length === 0 ? (
            <EmptyState
              icon={<FileText className="h-12 w-12" />}
              title="No leave requests"
              description="Leave requests from employees will appear here."
            />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Period</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Days</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {req.employee?.full_name || `Employee #${req.employee_id}`}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{req.leave_type?.name || '-'}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {new Date(req.start_date).toLocaleDateString()} — {new Date(req.end_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{req.days}</td>
                    <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                    <td className="px-6 py-4">
                      {req.status === 'pending' && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => approveMutation.mutate(req.id)}
                            disabled={approveMutation.isPending}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                          >
                            <Check className="h-3.5 w-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => rejectMutation.mutate(req.id)}
                            disabled={rejectMutation.isPending}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
                          >
                            <X className="h-3.5 w-3.5" /> Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Request Leave Modal */}
      <Modal open={requestOpen} onClose={() => setRequestOpen(false)} title="Request Leave">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Employee</label>
            <select
              value={formData.employee_id}
              onChange={(e) => setFormData((f) => ({ ...f, employee_id: e.target.value }))}
              className={inputClass}
            >
              <option value="">Select employee...</option>
              {employees?.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.full_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Leave Type</label>
            <select
              value={formData.leave_type_id}
              onChange={(e) => setFormData((f) => ({ ...f, leave_type_id: e.target.value }))}
              className={inputClass}
            >
              <option value="">Select leave type...</option>
              {types?.map((type) => (
                <option key={type.id} value={type.id}>{type.name} ({type.default_days} days)</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData((f) => ({ ...f, start_date: e.target.value }))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">End Date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData((f) => ({ ...f, end_date: e.target.value }))}
                min={formData.start_date}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Reason (optional)</label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData((f) => ({ ...f, reason: e.target.value }))}
              placeholder="Reason for leave request..."
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setRequestOpen(false)}>Cancel</Button>
            <Button
              loading={submitRequestMutation.isPending}
              disabled={!formData.employee_id || !formData.leave_type_id || !formData.start_date || !formData.end_date}
              onClick={handleSubmitRequest}
            >
              Submit request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
