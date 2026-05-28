import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save } from 'lucide-react';
import { useCreateDeductionRule } from '@/hooks/useApi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent } from '@/components/ui/Card';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['percentage', 'flat'], { message: 'Select a type' }),
  value: z.string().min(1, 'Value is required'),
  calculation_basis: z.enum(['gross_pay', 'basic_pay'], { message: 'Select a basis' }),
});

type FormData = z.infer<typeof schema>;

export default function CreateDeductionPage() {
  const navigate = useNavigate();
  const createRule = useCreateDeductionRule();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'percentage', calculation_basis: 'gross_pay' },
  });

  const ruleType = watch('type');

  function onSubmit(data: FormData) {
    createRule.mutate(
      {
        name: data.name,
        type: data.type,
        value: parseFloat(data.value),
        calculation_basis: data.calculation_basis,
      },
      { onSuccess: () => navigate('/deductions') }
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Create Deduction Rule</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
        <Card>
          <CardContent className="space-y-4">
            <Input label="Rule Name" placeholder="e.g. Tax, Pension" error={errors.name?.message} {...register('name')} />
            <Select label="Type" options={[
              { value: 'percentage', label: 'Percentage' },
              { value: 'flat', label: 'Flat Amount' },
            ]} error={errors.type?.message} {...register('type')} />
            <Input
              label={ruleType === 'percentage' ? 'Percentage (%)' : 'Amount (kobo)'}
              placeholder={ruleType === 'percentage' ? '7.5' : '15000'}
              error={errors.value?.message}
              {...register('value')}
            />
            <Select label="Calculation Basis" options={[
              { value: 'gross_pay', label: 'Gross Pay' },
              { value: 'basic_pay', label: 'Basic Pay' },
            ]} error={errors.calculation_basis?.message} {...register('calculation_basis')} />
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" type="button" onClick={() => navigate('/deductions')}>Cancel</Button>
          <Button type="submit" loading={createRule.isPending} icon={<Save className="h-4 w-4" />}>Save rule</Button>
        </div>
      </form>
    </div>
  );
}
