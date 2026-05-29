import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '@/api/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const schema = z.object({
  business_name: z.string().min(2, 'Business name is required'),
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rc_number: z.string().min(2, 'RC Number is required'),
  director_bvn: z.string().length(11, 'BVN must be exactly 11 digits'),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setLoading(true);
    try {
      await authApi.register({
        ...data,
        incorporation_date: new Date().toISOString(),
      });
      toast.success('Business registered! Please sign in.');
      navigate('/login');
    } catch (err: any) {
      const message = err?.response?.data?.error || err.message || 'Registration failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Create your account</h1>
      <p className="text-sm text-slate-500 mb-6">
        Register your business on PayFlow
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Business Name"
          placeholder="Acme Corporation Ltd"
          error={errors.business_name?.message}
          {...register('business_name')}
        />
        <Input
          label="Email"
          type="email"
          placeholder="admin@acme.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Minimum 8 characters"
          error={errors.password?.message}
          {...register('password')}
        />
        <Input
          label="RC Number"
          placeholder="RC123456"
          error={errors.rc_number?.message}
          {...register('rc_number')}
        />
        <Input
          label="Director BVN"
          placeholder="11-digit BVN"
          maxLength={11}
          error={errors.director_bvn?.message}
          {...register('director_bvn')}
        />

        <Button
          type="submit"
          loading={loading}
          icon={<Building2 className="h-4 w-4" />}
          className="w-full"
          size="lg"
        >
          Register Business
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="text-[#3B82F6] font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
