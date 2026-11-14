import Link from "next/link";
import { FormField } from "../../_components/FormField";
import { PasswordField } from "../../_components/PasswordField";
import { FormError } from "../../_components/FormError";
import { SubmitButton } from "../../_components/SubmitButton";
import type { LoginForm as LoginFormType } from "../_hooks/useLoginForm";

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
      <FormField
        id="email"
        label="البريد الإلكتروني"
        type="email"
        autoComplete="email"
        placeholder="example@email.com"
        value={form.email}
        onChange={updateField("email")}
        error={fieldErrors.email}
        disabled={loading}
      />

      <PasswordField
        id="password"
        label="كلمة المرور"
        autoComplete="current-password"
        disabled={loading}
        action={
          <Link
            href="/forgot-password"
            className="text-xs text-primary font-medium hover:underline inline-flex items-center min-h-[36px] py-1 px-1.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm transition-colors"
          >
            نسيت كلمة المرور؟
          </Link>
        }
        value={form.password}
        onChange={updateField("password")}
        error={fieldErrors.password}
      />

      <FormError message={error} />

      <SubmitButton loading={loading} loadingText="جارٍ الدخول...">
        تسجيل الدخول
      </SubmitButton>
    </form>
  );
}
