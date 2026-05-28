import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '@/api/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  role: z.enum(['operator', 'approver'], { message: 'Select a role' }),
});

type FormData = z.infer<typeof schema>;

export default function InviteUserPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'operator' },
  });

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      await authApi.invite(data.email, data.role);
      setSent(true);
      toast.success('Invitation sent!');
    } catch (err: any) {
      toast.error(err.message || 'Could not send invitation');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center">
          <CheckCircle className="h-6 w-6 text-[#22BC66]" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Invitation sent</h1>
        <p className="text-sm text-slate-500 mb-6">
          They'll receive an email with a link to set up their account.
        </p>
        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={() => setSent(false)}>Invite another</Button>
          <Button onClick={() => navigate('/settings')}>Back to settings</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Invite User</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-900">New Team Member</h2>
            <p className="text-xs text-slate-500 mt-1">
              They'll get an email to set up their password and access PayFlow
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="colleague@company.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Select
              label="Role"
              options={[
                { value: 'operator', label: 'Operator — manages employees, payroll, transfers' },
                { value: 'approver', label: 'Approver — reviews and approves payroll runs' },
              ]}
              error={errors.role?.message}
              {...register('role')}
            />
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" type="button" onClick={() => navigate('/settings')}>Cancel</Button>
          <Button type="submit" loading={loading} icon={<Send className="h-4 w-4" />}>
            Send invitation
          </Button>
        </div>
      </form>
    </div>
  );
}
