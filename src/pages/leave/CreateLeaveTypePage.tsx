import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { leaveApi } from '@/api/leave';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Toggle } from '@/components/ui/Toggle';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export default function CreateLeaveTypePage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [defaultDays, setDefaultDays] = useState('');
  const [requiresApproval, setRequiresApproval] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createType = useMutation({
    mutationFn: leaveApi.createType,
    onSuccess: () => {
      toast.success('Leave type created');
      navigate('/leave');
    },
    onError: () => toast.error('Failed to create leave type'),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!defaultDays || Number(defaultDays) < 1) newErrors.default_days = 'Enter a valid number of days';

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    createType.mutate({
      name: name.trim(),
      default_days: Number(defaultDays),
      requires_approval: requiresApproval,
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Create Leave Type</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-900">Leave Type Details</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Name"
              placeholder="e.g. Annual Leave, Sick Leave"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
            />
            <Input
              label="Default Days"
              type="number"
              min={1}
              placeholder="e.g. 20"
              value={defaultDays}
              onChange={(e) => setDefaultDays(e.target.value)}
              error={errors.default_days}
            />
            <Toggle
              label="Requires Approval"
              description="When enabled, leave requests of this type must be approved by an admin."
              enabled={requiresApproval}
              onChange={setRequiresApproval}
            />
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" type="button" onClick={() => navigate('/leave')}>Cancel</Button>
          <Button type="submit" loading={createType.isPending} icon={<Save className="h-4 w-4" />}>
            Create type
          </Button>
        </div>
      </form>
    </div>
  );
}
