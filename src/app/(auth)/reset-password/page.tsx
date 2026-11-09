"use client";

import { useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { Code2, CheckCircle2, ArrowRight } from "lucide-react";
import { PasswordField } from "../_components/PasswordField";
import { SubmitButton } from "../_components/SubmitButton";
import { FormError } from "../_components/FormError";
import { PasswordStrength } from "../register/_components/PasswordStrength";

interface ResetForm {
  password: string;
  confirm: string;
}

function Logo() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5 mb-4 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
    >
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-mid to-blue-light flex items-center justify-center shadow-md shadow-primary/10 group-hover:scale-105 transition-transform">
        <Code2 className="w-5 h-5 text-white" />
      </div>
      <span className="text-xl font-bold tracking-tight text-foreground">
        Future <span className="text-primary">House</span>
      </span>
    </Link>
  );
}

function SuccessState() {
  return (
    <div className="text-center space-y-5 py-2 animate-in fade-in-50 duration-300">
      <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      <div className="space-y-1">
        <h3 className="font-bold text-foreground text-lg">تم تحديث كلمة المرور بنجاح!</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          يمكنك الآن تسجيل الدخول إلى حسابك ومتابعة مساراتك التعليمية.
        </p>
      </div>
      <Link
        href="/login"
        className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-semibold inline-flex items-center justify-center shadow-sm transition-all active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        تسجيل الدخول الآن
      </Link>
    </div>
  );
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [form, setForm] = useState<ResetForm>({ password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const isSubmittingRef = useRef(false);

  const updateField = (field: keyof ResetForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || isSubmittingRef.current) return;

    if (form.password.length < 8 || !/[A-Z]/.test(form.password) || !/\d/.test(form.password)) {
      setError("يرجى استيفاء كافة شروط كلمة المرور الموضحة");
      return;
    }

    if (form.password !== form.confirm) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    isSubmittingRef.current = true;
    setLoading(true);
    setError("");

    try {
      // TODO: استدعاء مسار POST /api/auth/reset-password مع token و email عند توفره
      await new Promise((res) => setTimeout(res, 800));
      setDone(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "حدث خطأ، يرجى التأكد من صلاحية الرابط";
      setError(message);
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  if (done) return <SuccessState />;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PasswordField
        id="new-password"
        label="كلمة المرور الجديدة"
        autoComplete="new-password"
        disabled={loading}
        value={form.password}
        onChange={updateField("password")}
        extra={<PasswordStrength password={form.password} />}
      />

      <PasswordField
        id="confirm-password"
        label="تأكيد كلمة المرور"
        autoComplete="new-password"
        disabled={loading}
        value={form.confirm}
        onChange={updateField("confirm")}
      />

      <FormError message={error} />

      <SubmitButton loading={loading} loadingText="جارٍ التحديث...">
        تحديث كلمة المرور
      </SubmitButton>
    </form>
  );
}

export default function ResetPasswordPage() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-background via-background to-muted/60 flex items-center justify-center p-4 font-arabic"
      dir="rtl"
    >
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: shouldReduceMotion ? 0.05 : 0.3,
          ease: "easeOut",
        }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-6">
          <Logo />
          <h1 className="text-2xl font-bold text-foreground">كلمة مرور جديدة</h1>
          <p className="text-sm text-muted-foreground mt-1">اختر كلمة مرور قوية لحماية حسابك التعليمي</p>
        </div>

        <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
          <Suspense fallback={<div className="h-[340px] bg-card animate-pulse rounded-2xl border border-border" />}>
            <ResetPasswordForm />
          </Suspense>

          <p className="text-center text-sm text-muted-foreground mt-6">
            تذكرت كلمة المرور؟{" "}
            <Link
              href="/login"
              className="text-primary font-semibold hover:underline inline-block py-1 px-1.5 -my-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm transition-colors"
            >
              العودة لتسجيل الدخول
            </Link>
          </p>
        </div>

        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center justify-center gap-1.5 py-1.5 px-3 -my-1.5 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-md"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للصفحة الرئيسية</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
