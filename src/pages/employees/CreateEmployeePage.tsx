import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, CheckCircle, AlertTriangle } from 'lucide-react';
import { useCreateEmployee, useCadres } from '@/hooks/useApi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { NIGERIAN_BANKS } from '@/utils/banks';
import { parseNGNToKobo } from '@/utils/currency';

const schema = z.object({
  full_name: z.string().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  cadre_id: z.string().min(1, 'Select a salary grade'),
  bank_name: z.string().min(1, 'Select a bank'),
  bank_code: z.string().min(1, 'Bank code is required'),
  bank_account_number: z.string().min(1, 'Account number is required'),
  tin: z.string().optional(),
  pension_rsa_pin: z.string().optional(),
  nhf_number: z.string().optional(),
  annual_rent_paid: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function CreateEmployeePage() {
  const navigate = useNavigate();
  const createEmployee = useCreateEmployee();
  const { data: cadres } = useCadres();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { bank_code: '' },
  });

  function onSubmit(data: FormData) {
    createEmployee.mutate(
      {
        full_name: data.full_name,
        email: data.email,
        cadre_id: parseInt(data.cadre_id),
        bank_name: data.bank_name,
        bank_code: data.bank_code,
        bank_account_number: data.bank_account_number,
        tin: data.tin || undefined,
        pension_rsa_pin: data.pension_rsa_pin || undefined,
        nhf_number: data.nhf_number || undefined,
        annual_rent_paid: data.annual_rent_paid
          ? parseNGNToKobo(data.annual_rent_paid)
          : undefined,
      },
      {
        onSuccess: (response) => {
          if (response?.bank_account_verified) {
            // Show brief success before redirecting
            setTimeout(() => navigate('/employees'), 1500);
          } else {
            navigate('/employees');
          }
        },
      }
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Add Employee</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-900">Personal Details</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Adebayo Ogunlesi"
              error={errors.full_name?.message}
              {...register('full_name')}
            />
            <Input
              label="Email"
              type="email"
              placeholder="adebayo@company.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Select
              label="Salary Grade"
              placeholder="Select a grade"
              error={errors.cadre_id?.message}
              options={(cadres || []).map((c) => ({
                value: c.id.toString(),
                label: c.name,
              }))}
              {...register('cadre_id')}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-900">Bank Details</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              label="Bank"
              placeholder="Select bank"
              error={errors.bank_name?.message}
              options={NIGERIAN_BANKS.map((b) => ({
                value: b.name,
                label: `${b.name} (${b.code})`,
              }))}
              {...register('bank_name', {
                onChange: (e) => {
                  const bank = NIGERIAN_BANKS.find((b) => b.name === e.target.value);
                  if (bank) setValue('bank_code', bank.code);
                },
              })}
            />
            <input type="hidden" {...register('bank_code')} />
            <Input
              label="Account Number"
              placeholder="0123456789"
              error={errors.bank_account_number?.message}
              {...register('bank_account_number')}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-900">Statutory Information</h2>
            <p className="text-xs text-slate-500 mt-1">Optional — needed for tax and pension calculations</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Tax Identification Number (TIN)"
                placeholder="Enter TIN"
                {...register('tin')}
              />
              <Input
                label="Pension RSA PIN"
                placeholder="Enter RSA PIN"
                {...register('pension_rsa_pin')}
              />
              <Input
                label="NHF Number"
                placeholder="Enter NHF number"
                {...register('nhf_number')}
              />
              <Input
                label="Annual Rent Paid (NGN)"
                placeholder="0"
                hint="Used for PAYE rent relief calculation"
                {...register('annual_rent_paid')}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" type="button" onClick={() => navigate('/employees')}>
            Cancel
          </Button>
          <Button
            type="submit"
            loading={createEmployee.isPending}
            icon={<Save className="h-4 w-4" />}
          >
            Save employee
          </Button>
        </div>
      </form>
    </div>
  );
}
