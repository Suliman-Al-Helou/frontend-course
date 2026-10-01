import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { loginSchema } from '@/lib/validations/auth';
import { flattenZodErrors } from '@/lib/validations/flattenZodErrors';
import { handleFormError } from '@/lib/errors/handleFormError';
import { notify } from '@/lib/toast';
import { SUCCESS_CODES } from '@/lib/errors/codes';

export interface LoginForm {
  email: string;
  password: string;
}

export function useLoginForm() {
  const router = useRouter();
  const setAuth = useAuthStore(state => state.setAuth);

  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateField = (field: keyof LoginForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }));
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
      if (loading) return; // 👈 جديد

    setError('');
    setFieldErrors({});

    const result = loginSchema.safeParse(form);
    if (!result.success) {
      setFieldErrors(flattenZodErrors(result.error));
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      setAuth(data.user);
      notify.success(SUCCESS_CODES.AUTH_LOGIN_OK);
      router.push('/dashboard');
    } catch (err) {
      handleFormError(err, setFieldErrors, setError);
    } finally {
      setLoading(false);
    }
  };

  return { form, fieldErrors, error, loading, updateField, handleSubmit };
}