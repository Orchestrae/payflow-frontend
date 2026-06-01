import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  User,
  Building2,
  CreditCard,
  Shield,
  Save,
  Pencil,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { selfServiceApi } from '@/api/self-service';
import { CardSkeleton } from '@/components/shared/Skeleton';

const bankSchema = z.object({
  bank_name: z.string().min(1, 'Bank name is required'),
  bank_code: z.string().min(1, 'Bank code is required'),
  bank_account_number: z.string().min(10, 'Enter a valid account number'),
});

type BankFormData = z.infer<typeof bankSchema>;

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string | undefined | null;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-slate-100 last:border-0">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-500 sm:w-44 shrink-0">
        {label}
      </span>
      <span className="text-sm text-slate-900 mt-0.5 sm:mt-0">
        {value || '--'}
      </span>
    </div>
  );
}

export default function SelfServiceProfile() {
  const [editingBank, setEditingBank] = useState(false);
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['self-service', 'profile'],
    queryFn: () => selfServiceApi.getProfile().then((r) => r.data),
  });

  const updateBankMutation = useMutation({
    mutationFn: (data: BankFormData) =>
      selfServiceApi.updateBankDetails(data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['self-service', 'profile'],
      });
      toast.success('Bank details updated');
      setEditingBank(false);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BankFormData>({
    resolver: zodResolver(bankSchema),
  });

  function startEditing() {
    if (profile) {
      reset({
        bank_name: profile.bank_name,
        bank_code: profile.bank_code,
        bank_account_number: profile.bank_account_number,
      });
    }
    setEditingBank(true);
  }

  function cancelEditing() {
    setEditingBank(false);
    reset();
  }

  function onSubmitBank(data: BankFormData) {
    updateBankMutation.mutate(data);
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
          <p className="text-slate-500 mt-1">View and manage your details.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        <p className="text-slate-500 mt-1">
          View your personal details and manage bank information.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Details */}
        <Card>
          <CardHeader className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-400" />
            <h2 className="text-base font-semibold text-slate-900">
              Personal Details
            </h2>
          </CardHeader>
          <CardContent>
            <InfoRow label="Full Name" value={profile?.full_name} />
            <InfoRow label="Email" value={profile?.email} />
            <InfoRow
              label="Status"
              value={profile?.is_active ? 'Active' : 'Inactive'}
            />
            <InfoRow label="Employee ID" value={profile?.id?.toString()} />
          </CardContent>
        </Card>

        {/* Employment Details */}
        <Card>
          <CardHeader className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-slate-400" />
            <h2 className="text-base font-semibold text-slate-900">
              Employment
            </h2>
          </CardHeader>
          <CardContent>
            <InfoRow label="Company" value={profile?.company_name} />
            <InfoRow label="Salary Grade" value={profile?.cadre?.name} />
            <InfoRow label="TIN" value={profile?.tin} />
            <InfoRow label="Pension RSA" value={profile?.pension_rsa_pin} />
            <InfoRow label="NHF Number" value={profile?.nhf_number} />
          </CardContent>
        </Card>

        {/* Bank Details */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-slate-400" />
              <h2 className="text-base font-semibold text-slate-900">
                Bank Details
              </h2>
            </div>
            {!editingBank && (
              <Button
                variant="ghost"
                size="sm"
                onClick={startEditing}
                icon={<Pencil className="h-3.5 w-3.5" />}
              >
                Edit
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {editingBank ? (
              <form
                onSubmit={handleSubmit(onSubmitBank)}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Bank Name"
                    placeholder="e.g. GTBank"
                    error={errors.bank_name?.message}
                    {...register('bank_name')}
                  />
                  <Input
                    label="Bank Code"
                    placeholder="e.g. 058"
                    error={errors.bank_code?.message}
                    {...register('bank_code')}
                  />
                  <Input
                    label="Account Number"
                    placeholder="0123456789"
                    error={errors.bank_account_number?.message}
                    {...register('bank_account_number')}
                  />
                </div>
                <div className="flex items-center gap-3 justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={cancelEditing}
                    icon={<X className="h-4 w-4" />}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    loading={updateBankMutation.isPending}
                    icon={<Save className="h-4 w-4" />}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Bank Name
                  </p>
                  <p className="text-sm text-slate-900 mt-1">
                    {profile?.bank_name || '--'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Bank Code
                  </p>
                  <p className="text-sm text-slate-900 mt-1">
                    {profile?.bank_code || '--'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Account Number
                  </p>
                  <p className="text-sm text-slate-900 mt-1">
                    {profile?.bank_account_number || '--'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Account Name
                  </p>
                  <p className="text-sm text-slate-900 mt-1">
                    {profile?.bank_account_name || '--'}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Verified
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Shield
                      className={`h-4 w-4 ${
                        profile?.bank_account_verified
                          ? 'text-emerald-500'
                          : 'text-slate-300'
                      }`}
                    />
                    <span className="text-sm text-slate-900">
                      {profile?.bank_account_verified ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
