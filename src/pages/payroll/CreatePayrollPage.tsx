import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Banknote } from 'lucide-react';
import { useCreatePayrollRun } from '@/hooks/useApi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

const schema = z.object({
  period: z.string().min(1, 'Select a period'),
});

type FormData = z.infer<typeof schema>;

export default function CreatePayrollPage() {
  const navigate = useNavigate();
  const createRun = useCreatePayrollRun();

  const now = new Date();
  const defaultPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { period: defaultPeriod },
  });

  function onSubmit(data: FormData) {
    createRun.mutate(
      { period: data.period },
      { onSuccess: (run) => navigate(`/payroll/${run.id}`) }
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Create Payroll Run</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-900">Payroll Period</h2>
            <p className="text-xs text-slate-500 mt-1">
              Select the month and year for this payroll run. All active employees will be included.
            </p>
          </CardHeader>
          <CardContent>
            <Input
              label="Period"
              type="month"
              error={errors.period?.message}
              {...register('period')}
            />
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" type="button" onClick={() => navigate('/payroll')}>Cancel</Button>
          <Button type="submit" loading={createRun.isPending} icon={<Banknote className="h-4 w-4" />}>
            Run payroll
          </Button>
        </div>
      </form>
    </div>
  );
}
