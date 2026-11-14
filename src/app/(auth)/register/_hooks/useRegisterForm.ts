import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRegisterMutation } from "@/features/auth";
import { registerSchema } from "@/lib/validations/auth";
import { flattenZodErrors } from "@/lib/validations/flattenZodErrors";
import { handleFormError } from "@/lib/errors/handleFormError";
import { notify } from "@/lib/toast";
import { SUCCESS_CODES } from "@/lib/errors/codes";
import { resolvePostLoginRedirect } from "@/lib/auth-helpers";

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirm: string;
}
// onOtpRequired: (email: string) => void
export function useRegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registerMutation = useRegisterMutation();

  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const isSubmittingRef = useRef(false);

  const updateField = (field: keyof RegisterForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerMutation.isPending || isSubmittingRef.current) return;

    setError("");
    setFieldErrors({});

    const result = registerSchema.safeParse(form);
    if (!result.success) {
      setFieldErrors(flattenZodErrors(result.error));
      return;
    }

    isSubmittingRef.current = true;
    try {
      const data = await registerMutation.mutateAsync({
        name: form.name,
        email: form.email,
        password: form.password,
        password_confirmation: form.confirm,
      });
      notify.success(SUCCESS_CODES.AUTH_REGISTER_OK);

      // توجيه ذكي: قراءة باراميتر redirect إن وُجد أو التوجيه للوحة الطالب
      const targetUrl = resolvePostLoginRedirect(searchParams.get("redirect"), data.user);
      router.push(targetUrl);
    } catch (err) {
      handleFormError(err, setFieldErrors, setError);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  return {
    form,
    fieldErrors,
    error,
    loading: registerMutation.isPending,
    updateField,
    handleRegister,
  };
}
