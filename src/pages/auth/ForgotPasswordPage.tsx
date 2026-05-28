import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { authApi } from '@/api/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

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
      await authApi.forgotPassword(data.email);
      setSent(true);
    } catch {
      // Always show success to not reveal if email exists
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center">
          <Mail className="h-6 w-6 text-[#22BC66]" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h1>
        <p className="text-sm text-slate-500 mb-6">
          If an account exists with that email, we've sent password reset instructions. Check your inbox and spam folder.
        </p>
        <Link
          to="/login"
          className="text-sm text-[#3B82F6] hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Reset your password</h1>
      <p className="text-sm text-slate-500 mb-6">
        Enter your email and we'll send you instructions to reset your password
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@company.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Button
          type="submit"
          loading={loading}
          icon={<Mail className="h-4 w-4" />}
          className="w-full"
          size="lg"
        >
          Send reset link
        </Button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-4">
        <Link to="/login" className="text-[#3B82F6] hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
