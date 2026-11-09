"use client";

import { Suspense } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Code2, ArrowRight } from "lucide-react";
import { LoginForm } from "./_components/LoginForm";
import { useLoginForm } from "./_hooks/useLoginForm";
import { GoogleAuthButton } from "../_components/GoogleAuthButton";

function LoginContent() {
  const loginForm = useLoginForm();

  return (
    <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
      <LoginForm
        form={loginForm.form}
        fieldErrors={loginForm.fieldErrors}
        error={loginForm.error}
        loading={loginForm.loading}
        updateField={loginForm.updateField}
        onSubmit={loginForm.handleSubmit}
      />
      <GoogleAuthButton mode="signin" />

      <p className="text-center text-sm text-muted-foreground mt-6">
        ليس لديك حساب؟{" "}
        <Link
          href="/register"
          className="text-primary font-semibold hover:underline inline-block py-1 px-1.5 -my-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm transition-colors"
        >
          سجّل الآن
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
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
          <h1 className="text-2xl font-bold text-foreground">أهلاً بعودتك!</h1>
          <p className="text-sm text-muted-foreground mt-1">سجّل دخولك لمتابعة رحلتك التعليمية</p>
        </div>

        <Suspense fallback={<div className="bg-card rounded-2xl p-8 h-[380px] animate-pulse border border-border" />}>
          <LoginContent />
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
  );
}
