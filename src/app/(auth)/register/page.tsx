"use client";

import { Suspense } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Code2, ArrowRight } from "lucide-react";
import { BrandSide } from "./_components/BrandSide";
import { RegisterForm } from "./_components/RegisterForm";
import { useRegisterForm } from "./_hooks/useRegisterForm";
import { GoogleAuthButton } from "../_components/GoogleAuthButton";

function RegisterContent() {
  const registerForm = useRegisterForm();

  return (
    <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
      <RegisterForm
        form={registerForm.form}
        fieldErrors={registerForm.fieldErrors}
        error={registerForm.error}
        loading={registerForm.loading}
        updateField={registerForm.updateField}
        onSubmit={registerForm.handleRegister}
      />

      <GoogleAuthButton mode="signup" />

      <p className="text-center text-sm text-muted-foreground mt-6">
        لديك حساب بالفعل؟{" "}
        <Link
          href="/login"
          className="text-primary font-semibold hover:underline inline-block py-1 px-1.5 -my-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm transition-colors"
        >
          سجّل دخولك
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="min-h-screen flex font-arabic" dir="rtl">
      <BrandSide />

      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 bg-background">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: shouldReduceMotion ? 0.05 : 0.3,
            ease: "easeOut",
          }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden text-center mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 mb-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-mid to-blue-light flex items-center justify-center shadow-md shadow-primary/10 group-hover:scale-105 transition-transform">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">
                Future <span className="text-primary">House</span>
              </span>
            </Link>
          </div>

          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-foreground">إنشاء حساب جديد</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              انضم مجاناً وابدأ مسارك البرمجي اليوم
            </p>
          </div>

          <Suspense
            fallback={
              <div className="h-[560px] animate-pulse bg-card rounded-2xl border border-border" />
            }
          >
            <RegisterContent />
          </Suspense>

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
    </div>
  );
}
