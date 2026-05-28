import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send } from 'lucide-react';
import { useCreateTransfer } from '@/hooks/useApi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { NIGERIAN_BANKS } from '@/utils/banks';

const schema = z.object({
  amount: z.string().min(1, 'Amount is required'),
  bank_code: z.string().min(1, 'Select a bank'),
  account_number: z.string().min(1, 'Account number is required'),
  account_name: z.string().min(1, 'Account name is required'),
  narration: z.string().optional(),
  provider: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NewTransferPage() {
  const navigate = useNavigate();
  const createTransfer = useCreateTransfer();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { provider: '' },
  });

  function onSubmit(data: FormData) {
    createTransfer.mutate(
      {
        amount: data.amount,
        bank_code: data.bank_code,
        account_number: data.account_number,
        account_name: data.account_name,
        narration: data.narration || undefined,
        provider: data.provider || undefined,
      },
      { onSuccess: () => navigate('/transfers') }
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">New Transfer</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-900">Transfer Details</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Amount (NGN)"
              placeholder="50000"
              hint="Enter the amount in Naira"
              error={errors.amount?.message}
              {...register('amount')}
            />
            <Select
              label="Bank"
              placeholder="Select bank"
              options={NIGERIAN_BANKS.map((b) => ({ value: b.code, label: `${b.name} (${b.code})` }))}
              error={errors.bank_code?.message}
              {...register('bank_code')}
            />
            <Input
              label="Account Number"
              placeholder="0123456789"
              error={errors.account_number?.message}
              {...register('account_number')}
            />
            <Input
              label="Account Name"
              placeholder="John Doe"
              error={errors.account_name?.message}
              {...register('account_name')}
            />
            <Input
              label="Narration"
              placeholder="Salary payment"
              {...register('narration')}
            />
            <Select
              label="Provider (optional)"
              placeholder="Auto-select"
              options={[
                { value: '', label: 'Auto-select' },
                { value: 'korapay', label: 'Korapay' },
                { value: 'paystack', label: 'Paystack' },
                { value: 'vfd', label: 'VFD Bank' },
              ]}
              {...register('provider')}
            />
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" type="button" onClick={() => navigate('/transfers')}>Cancel</Button>
          <Button type="submit" loading={createTransfer.isPending} icon={<Send className="h-4 w-4" />}>
            Send transfer
          </Button>
        </div>
      </form>
    </div>
  );
}
