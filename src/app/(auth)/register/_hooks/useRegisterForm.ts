import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { registerSchema } from '@/lib/validations/auth';
import { flattenZodErrors } from '@/lib/validations/flattenZodErrors';
import { handleFormError } from '@/lib/errors/handleFormError';
import { notify } from '@/lib/toast';
import { SUCCESS_CODES } from '@/lib/errors/codes';

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirm: string;
}
// onOtpRequired: (email: string) => void
export function useRegisterForm() {
  const router = useRouter();
  const setAuth = useAuthStore(state => state.setAuth);

  const [form, setForm] = useState<RegisterForm>({ name: '', email: '', password: '', confirm: '' });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateField = (field: keyof RegisterForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }));
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
      if (loading) return; // 👈 جديد

    setError('');
    setFieldErrors({});

    const result = registerSchema.safeParse(form);
    if (!result.success) {
      setFieldErrors(flattenZodErrors(result.error));
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        password_confirmation: form.confirm,
      });
      setAuth(data.user);
      notify.success(SUCCESS_CODES.AUTH_REGISTER_OK);
    router.push('/dashboard'); // 👈 رجعناها مباشرة
    } catch (err) {
      handleFormError(err, setFieldErrors, setError);
    } finally {
      setLoading(false);
    }
  };

  return { form, fieldErrors, error, loading, updateField, handleRegister };
}