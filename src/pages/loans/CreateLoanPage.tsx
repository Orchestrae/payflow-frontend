import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { loansApi } from '@/api/loans';
import { employeesApi } from '@/api/employees';
import { parseNGNToKobo } from '@/utils/currency';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

const schema = z.object({
  employee_id: z.string().min(1, 'Select an employee'),
  loan_amount: z.string().min(1, 'Loan amount is required'),
  monthly_deduction: z.string().min(1, 'Monthly deduction is required'),
  start_date: z.string().min(1, 'Start date is required'),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function CreateLoanPage() {
  const navigate = useNavigate();

  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: () => employeesApi.list().then((r) => r.data),
  });

  const createLoan = useMutation({
    mutationFn: loansApi.create,
    onSuccess: () => {
      toast.success('Loan created');
      navigate('/loans');
    },
    onError: () => toast.error('Failed to create loan'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      employee_id: '',
      loan_amount: '',
      monthly_deduction: '',
      start_date: '',
      description: '',
    },
  });

  function onSubmit(data: FormData) {
    createLoan.mutate({
      employee_id: Number(data.employee_id),
      loan_amount: parseNGNToKobo(data.loan_amount),
      monthly_deduction: parseNGNToKobo(data.monthly_deduction),
      start_date: data.start_date,
      description: data.description || '',
    });
  }

  const employeeOptions = (employees || []).map((e) => ({
    value: String(e.id),
    label: e.full_name,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Create Loan</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-900">Loan Details</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              label="Employee"
              placeholder="Select employee"
              options={employeeOptions}
              error={errors.employee_id?.message}
              {...register('employee_id')}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Loan Amount (NGN)"
                placeholder="e.g. 500000"
                error={errors.loan_amount?.message}
                {...register('loan_amount')}
              />
              <Input
                label="Monthly Deduction (NGN)"
                placeholder="e.g. 50000"
                error={errors.monthly_deduction?.message}
                {...register('monthly_deduction')}
              />
            </div>
            <Input
              label="Start Date"
              type="date"
              error={errors.start_date?.message}
              {...register('start_date')}
            />
            <div className="space-y-1.5">
              <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Purpose of the loan (optional)"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white
                  transition-colors duration-150
                  placeholder:text-slate-400
                  focus:outline-none focus:ring-2 focus:ring-[#22BC66]/20 focus:border-[#22BC66]"
                {...register('description')}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" type="button" onClick={() => navigate('/loans')}>Cancel</Button>
          <Button type="submit" loading={createLoan.isPending} icon={<Save className="h-4 w-4" />}>
            Create loan
          </Button>
        </div>
      </form>
    </div>
  );
}
