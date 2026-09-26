import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function useOtpVerification() {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // TODO: POST /api/auth/verify-otp
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'الرمز غير صحيح');
    } finally {
      setLoading(false);
    }
  };

  return { otp, setOtp, error, loading, handleVerify };
}