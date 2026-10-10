'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { LoginForm } from './_components/LoginForm';
import { useLoginForm } from './_hooks/useLoginForm';

export default function LoginPage() {
  const loginForm = useLoginForm();

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4"
      dir="rtl"
    >
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">أهلاً بعودتك!</h1>
          <p className="text-muted-foreground mt-1">سجّل دخولك لمتابعة رحلة التعلم</p>
        </div>
      
        <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
          <LoginForm
            form={loginForm.form}
            fieldErrors={loginForm.fieldErrors}
            error={loginForm.error}
            loading={loginForm.loading}
            updateField={loginForm.updateField}
            onSubmit={loginForm.handleSubmit}
          />

          <p className="text-center text-sm text-muted-foreground mt-6">
            ليس لديك حساب؟{' '}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              سجّل الآن
            </Link>
          </p>
        </div>

        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-primary inline-flex items-center justify-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            العودة للصفحة الرئيسية
          </Link>
        </div>
      </motion.div>
    </div>
  );
}