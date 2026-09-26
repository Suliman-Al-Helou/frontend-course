import Link from 'next/link';
import { FormField } from '../../_components/FormField';
import { PasswordField } from '../../_components/PasswordField';
import { FormError } from '../../_components/FormError';
import { SubmitButton } from '../../_components/SubmitButton';
import type { LoginForm as LoginFormType } from '../_hooks/useLoginForm';

interface Props {
  form: LoginFormType;
  fieldErrors: Record<string, string>;
  error: string;
  loading: boolean;
  updateField: (field: keyof LoginFormType) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function LoginForm({ form, fieldErrors, error, loading, updateField, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
   <FormField id="email" label="البريد الإلكتروني" type="email" autoComplete="email"
  placeholder="example@email.com" value={form.email} onChange={updateField('email')}
  error={fieldErrors.email} disabled={loading} />

<PasswordField
  id="password" autoComplete="current-password" disabled={loading}
  label={
    <div className="flex items-center justify-between">
      <span>كلمة المرور</span>
      <Link href="/forgot-password" className="text-xs text-primary hover:underline">نسيت كلمة المرور؟</Link>
    </div>
  }
  value={form.password} onChange={updateField('password')} error={fieldErrors.password}
/>

      <FormError message={error} />

      <SubmitButton loading={loading} loadingText="جارٍ الدخول...">
        تسجيل الدخول
      </SubmitButton>
    </form>
  );
}