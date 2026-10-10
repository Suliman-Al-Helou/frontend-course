'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Code2, ArrowLeft } from 'lucide-react';
import { BrandSide } from './_components/BrandSide';
import { RegisterForm } from './_components/RegisterForm';
import { useRegisterForm } from './_hooks/useRegisterForm';

export default function RegisterPage() {
  const registerForm = useRegisterForm();

  return (
    <div className="min-h-screen flex font-arabic" dir="rtl">
      <BrandSide />

      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-background">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-mid to-blue-light flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-blue-deep">
                Future <span className="text-primary">House</span>
              </span>
            </Link>
          </div>

          <div className="mb-8 text-center md:text-start">
            <h1 className="text-2xl font-bold text-foreground">إنشاء حساب جديد</h1>
            <p className="text-muted-foreground mt-1 text-sm">انضم مجاناً وابدأ التعلم فوراً</p>
          </div>

          <RegisterForm
            form={registerForm.form}
            fieldErrors={registerForm.fieldErrors}
            error={registerForm.error}
            loading={registerForm.loading}
            updateField={registerForm.updateField}
            onSubmit={registerForm.handleRegister}
          />

          <p className="text-center text-sm text-muted-foreground mt-6">
            لديك حساب؟{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">سجّل دخولك</Link>
          </p>

          <div className="text-center mt-4">
            <Link href="/" className="text-xs text-muted-foreground hover:text-primary inline-flex items-center justify-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              العودة للرئيسية
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}