import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { authApi } from '@/api/auth';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided');
      return;
    }

    authApi
      .verifyEmail(token)
      .then(() => {
        setStatus('success');
        setMessage('Your email has been verified successfully!');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.message || 'Verification failed. The link may have expired.');
      });
  }, [token]);

  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">Email Verification</h1>

      {status === 'loading' && (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-12 w-12 text-[#22BC66] animate-spin" />
          <p className="text-slate-600">Verifying your email...</p>
        </div>
      )}

      {status === 'success' && (
        <div className="flex flex-col items-center gap-3">
          <CheckCircle className="h-12 w-12 text-green-500" />
          <p className="text-slate-700">{message}</p>
          <Link
            to="/login"
            className="mt-4 inline-flex px-6 py-2 bg-[#22BC66] text-white rounded-lg hover:bg-[#1da558] transition-colors"
          >
            Continue to Login
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center gap-3">
          <XCircle className="h-12 w-12 text-red-500" />
          <p className="text-slate-700">{message}</p>
          <Link
            to="/login"
            className="mt-4 text-sm text-[#22BC66] hover:underline"
          >
            Back to Login
          </Link>
        </div>
      )}
    </div>
  );
}
