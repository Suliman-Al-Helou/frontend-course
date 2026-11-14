import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLoginMutation } from "@/features/auth";
import { loginSchema } from "@/lib/validations/auth";
import { flattenZodErrors } from "@/lib/validations/flattenZodErrors";
import { handleFormError } from "@/lib/errors/handleFormError";
import { notify } from "@/lib/toast";
import { SUCCESS_CODES } from "@/lib/errors/codes";
import { resolvePostLoginRedirect } from "@/lib/auth-helpers";

export interface LoginForm {
  email: string;
  password: string;
}

export function useLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLoginMutation();

  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const isSubmittingRef = useRef(false);

  const updateField = (field: keyof LoginForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginMutation.isPending || isSubmittingRef.current) return;

    setError("");
    setFieldErrors({});

    const result = loginSchema.safeParse(form);
    if (!result.success) {
      setFieldErrors(flattenZodErrors(result.error));
      return;
    }

    isSubmittingRef.current = true;
    try {
      const data = await loginMutation.mutateAsync(form);
      notify.success(SUCCESS_CODES.AUTH_LOGIN_OK);

      // توجيه ذكي مع التحقق الأمني من مسار إعادة التوجيه
      const targetUrl = resolvePostLoginRedirect(searchParams.get("redirect"), data.user);
      router.push(targetUrl);
    } catch (err) {
      handleFormError(err, setFieldErrors, setError);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  return { form, fieldErrors, error, loading: loginMutation.isPending, updateField, handleSubmit };
}
