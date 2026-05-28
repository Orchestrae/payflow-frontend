import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save } from 'lucide-react';
import { useDeductionRules, useUpdateDeductionRule } from '@/hooks/useApi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent } from '@/components/ui/Card';
import { TableSkeleton } from '@/components/shared/Skeleton';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['percentage', 'flat']),
  value: z.string().min(1, 'Value is required'),
  calculation_basis: z.enum(['gross_pay', 'basic_pay']),
});

type FormData = z.infer<typeof schema>;

export default function EditDeductionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const ruleId = parseInt(id || '0');
  const { data: rules, isLoading } = useDeductionRules();
  const updateRule = useUpdateDeductionRule();

  const rule = rules?.find((r) => r.id === ruleId);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const ruleType = watch('type');

  useEffect(() => {
    if (rule) {
      reset({
        name: rule.name,
        type: rule.type,
        value: rule.value.toString(),
        calculation_basis: rule.calculation_basis,
      });
    }
  }, [rule, reset]);

  if (isLoading) return <TableSkeleton />;
  if (!rule) return <p className="text-sm text-slate-500">Rule not found.</p>;

  function onSubmit(data: FormData) {
    updateRule.mutate(
      {
        id: ruleId,
        data: {
          name: data.name,
          type: data.type,
          value: parseFloat(data.value),
          calculation_basis: data.calculation_basis,
        },
      },
      { onSuccess: () => navigate('/deductions') }
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Edit Deduction Rule</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
        <Card>
          <CardContent className="space-y-4">
            <Input label="Rule Name" error={errors.name?.message} {...register('name')} />
            <Select label="Type" options={[
              { value: 'percentage', label: 'Percentage' },
              { value: 'flat', label: 'Flat Amount' },
            ]} {...register('type')} />
            <Input
              label={ruleType === 'percentage' ? 'Percentage (%)' : 'Amount (kobo)'}
              error={errors.value?.message}
              {...register('value')}
            />
            <Select label="Calculation Basis" options={[
              { value: 'gross_pay', label: 'Gross Pay' },
              { value: 'basic_pay', label: 'Basic Pay' },
            ]} {...register('calculation_basis')} />
          </CardContent>
        </Card>
        <div className="flex gap-3">
          <Button variant="outline" type="button" onClick={() => navigate('/deductions')}>Cancel</Button>
          <Button type="submit" loading={updateRule.isPending} icon={<Save className="h-4 w-4" />}>Save changes</Button>
        </div>
      </form>
    </div>
  );
}
