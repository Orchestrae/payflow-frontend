import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  CalendarDays,
  Plus,
  X,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { selfServiceApi } from '@/api/self-service';
import { TableSkeleton } from '@/components/shared/Skeleton';

const leaveSchema = z.object({
  leave_type_id: z.coerce.number().min(1, 'Select a leave type'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  reason: z.string().min(3, 'Provide a reason (at least 3 characters)'),
});

type LeaveFormData = z.infer<typeof leaveSchema>;

const statusConfig: Record<
  string,
  { icon: typeof Clock; color: string; bg: string; label: string }
> = {
  pending: {
    icon: Clock,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    label: 'Pending',
  },
  approved: {
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    label: 'Approved',
  },
  rejected: {
    icon: XCircle,
    color: 'text-red-600',
    bg: 'bg-red-50',
    label: 'Rejected',
  },
};

function getStatusConfig(status: string) {
  return (
    statusConfig[status] ?? {
      icon: Clock,
      color: 'text-slate-500',
      bg: 'bg-slate-50',
      label: status,
    }
  );
}

export default function SelfServiceLeave() {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: leaveRequests, isLoading } = useQuery({
    queryKey: ['self-service', 'leave'],
    queryFn: () => selfServiceApi.getLeaveRequests().then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: LeaveFormData) =>
      selfServiceApi.createLeaveRequest(data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['self-service', 'leave'] });
      toast.success('Leave request submitted');
      setShowForm(false);
      reset();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeaveFormData>({
    resolver: zodResolver(leaveSchema),
    defaultValues: { leave_type_id: 0, start_date: '', end_date: '', reason: '' },
  });

  function onSubmit(data: LeaveFormData) {
    createMutation.mutate(data);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leave Requests</h1>
          <p className="text-slate-500 mt-1">
            Submit and track your leave requests.
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          icon={
            showForm ? (
              <X className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )
          }
          variant={showForm ? 'ghost' : 'primary'}
        >
          {showForm ? 'Cancel' : 'New Request'}
        </Button>
      </div>

      {/* New Leave Request Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <h2 className="text-base font-semibold text-slate-900">
              Submit Leave Request
            </h2>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div className="space-y-1.5">
                <label
                  htmlFor="leave_type_id"
                  className="block text-xs font-medium uppercase tracking-wide text-slate-500"
                >
                  Leave Type ID
                </label>
                <input
                  id="leave_type_id"
                  type="number"
                  min="1"
                  className={`w-full px-3 py-2 text-sm border rounded-lg bg-white transition-colors duration-150 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#22BC66]/20 focus:border-[#22BC66] ${
                    errors.leave_type_id
                      ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
                      : 'border-slate-300'
                  }`}
                  placeholder="e.g. 1"
                  {...register('leave_type_id')}
                />
                {errors.leave_type_id && (
                  <p className="text-xs text-red-500">
                    {errors.leave_type_id.message}
                  </p>
                )}
              </div>

              <div>{/* spacer for grid alignment on desktop */}</div>

              <Input
                label="Start Date"
                type="date"
                error={errors.start_date?.message}
                {...register('start_date')}
              />
              <Input
                label="End Date"
                type="date"
                error={errors.end_date?.message}
                {...register('end_date')}
              />

              <div className="sm:col-span-2">
                <Input
                  label="Reason"
                  placeholder="Brief reason for your leave request"
                  error={errors.reason?.message}
                  {...register('reason')}
                />
              </div>

              <div className="sm:col-span-2 flex justify-end">
                <Button
                  type="submit"
                  loading={createMutation.isPending}
                  icon={<CalendarDays className="h-4 w-4" />}
                >
                  Submit Request
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Leave Requests List */}
      <Card>
        {isLoading ? (
          <TableSkeleton rows={4} cols={4} />
        ) : !leaveRequests || leaveRequests.length === 0 ? (
          <CardContent>
            <div className="py-16 text-center">
              <CalendarDays className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500 font-medium">
                No leave requests
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Submit your first leave request using the button above.
              </p>
            </div>
          </CardContent>
        ) : (
          <>
            <CardHeader>
              <p className="text-sm text-slate-500">
                {leaveRequests.length} request
                {leaveRequests.length !== 1 && 's'}
              </p>
            </CardHeader>
            <div className="divide-y divide-slate-100">
              {leaveRequests.map((req) => {
                const cfg = getStatusConfig(req.status);
                const StatusIcon = cfg.icon;
                return (
                  <div
                    key={req.id}
                    className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className={`p-2 rounded-lg ${cfg.bg}`}>
                        <StatusIcon className={`h-4 w-4 ${cfg.color}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900">
                          {req.leave_type?.name ?? `Leave Type #${req.leave_type_id}`}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">
                          {req.start_date} to {req.end_date} ({req.days} day
                          {req.days !== 1 && 's'})
                        </p>
                        {req.reason && (
                          <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">
                            {req.reason}
                          </p>
                        )}
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}
                    >
                      {cfg.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
