import { FormField } from '../../_components/FormField';
import { PasswordField } from '../../_components/PasswordField';
import { FormError } from '../../_components/FormError';
import { SubmitButton } from '../../_components/SubmitButton';
import { PasswordStrength } from './PasswordStrength';
import type { RegisterForm as RegisterFormType } from '../_hooks/useRegisterForm';

interface Props {
  form: RegisterFormType;
  fieldErrors: Record<string, string>;
  error: string;
  loading: boolean;
  updateField: (field: keyof RegisterFormType) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function RegisterForm({ form, fieldErrors, error, loading, updateField, onSubmit }: Props) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
  <FormField id="name" label="الاسم الكامل" type="text" autoComplete="name" placeholder="محمد أحمد"
  value={form.name} onChange={updateField('name')} error={fieldErrors.name} disabled={loading} />

<FormField id="email" label="البريد الإلكتروني" type="email" autoComplete="email" placeholder="example@email.com"
  value={form.email} onChange={updateField('email')} error={fieldErrors.email} disabled={loading} />

<PasswordField id="password" label="كلمة المرور" autoComplete="new-password" disabled={loading}
  value={form.password} onChange={updateField('password')} error={fieldErrors.password}
  extra={<PasswordStrength password={form.password} />} />

<PasswordField id="confirm" label="تأكيد كلمة المرور" autoComplete="new-password" disabled={loading}
  value={form.confirm} onChange={updateField('confirm')} error={fieldErrors.confirm} />

      <FormError message={error} />

      <SubmitButton loading={loading} loadingText="جارٍ إنشاء الحساب...">
        إنشاء الحساب مجاناً
      </SubmitButton>
    </form>
  );
}