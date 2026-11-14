"use client";

// src/app/(auth)/forgot-password/page.tsx

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Code2, ArrowRight, Mail } from "lucide-react";
import { SubmitButton } from "../_components/SubmitButton";

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

function SuccessState({ email }: { email: string }) {
  return (
    <div className="text-center space-y-4 py-2 animate-in fade-in-50 duration-300">
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
        <Mail className="w-8 h-8" />
      </div>
      <div className="space-y-1">
        <h3 className="font-bold text-foreground text-lg">تم إرسال الرابط!</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          إذا كان البريد{" "}
          <span className="font-semibold text-foreground dir-ltr font-mono text-xs">{email}</span>{" "}
          مسجلاً لدينا، ستصلك رسالة تحتوي على تعليمات إعادة التعيين.
        </p>
      </div>
      <p className="text-xs text-muted-foreground/80 bg-muted/50 rounded-lg p-2.5">
        يرجى التحقق من مجلد الرسائل غير المرغوب فيها (Spam) إذا لم تصل الرسالة خلال دقائق.
      </p>
    </div>
  );
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const isSubmittingRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || isSubmittingRef.current || !email.trim()) return;

    isSubmittingRef.current = true;
    setLoading(true);
    try {
      // TODO: ربط مسار POST /api/auth/forgot-password في لارافيل عند جهوزيته
      await new Promise((res) => setTimeout(res, 800));
    } catch (_) {
      // الحفاظ على أمان البيانات: إظهار النجاح دائماً لعدم تمكين تخمين الحسابات المسجلة
    } finally {
      setSent(true);
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

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
        {/* Header */}
        <div className="text-center mb-6">
          <Logo />
          <h1 className="text-2xl font-bold text-foreground">إعادة تعيين كلمة المرور</h1>
          <p className="text-sm text-muted-foreground mt-1">
            أدخل بريدك الإلكتروني وسنرسل لك رابط استعادة الحساب
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="forgot-email" className="text-sm font-medium text-foreground">
                  البريد الإلكتروني
                </label>
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  dir="ltr"
                  autoCapitalize="none"
                  autoCorrect="off"
                  inputMode="email"
                  autoComplete="email"
                  disabled={loading}
                  className="w-full h-11 rounded-xl border border-border hover:border-foreground/30 bg-background px-4 text-sm text-left placeholder:text-right transition-colors focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                />
              </div>

              <SubmitButton loading={loading} loadingText="جارٍ الإرسال...">
                إرسال رابط الإعادة
              </SubmitButton>
            </form>
          ) : (
            <SuccessState email={email} />
          )}

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

        {/* Back home */}
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
