"use client";

import Link from "next/link";

export interface CourseBottomCtaProps {
  isFree: boolean;
  enrolled: boolean;
  isAuthenticated: boolean;
}

export function CourseBottomCta({ isFree, enrolled, isAuthenticated }: CourseBottomCtaProps) {
  // يختفي تماماً إذا كان الكورس مجانياً أو إذا كان المستخدم مسجلاً ومقبولاً
  if (isFree || enrolled) return null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section
      aria-labelledby="cta-heading"
      className="mt-16 bg-gradient-to-br from-primary to-primary/85 rounded-3xl p-8 sm:p-12 text-center text-primary-foreground shadow-xl"
    >
      <h3 id="cta-heading" className="text-2xl font-bold mb-3">
        مستعد تبدأ؟
      </h3>
      <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto text-base">
        سجّل الآن وابدأ الكورس فوراً — الوصول الكامل بعد موافقة الإدارة
      </p>

      {isAuthenticated ? (
        <button
          onClick={scrollToTop}
          className="inline-flex items-center justify-center bg-background text-foreground hover:bg-background/90 rounded-xl px-10 py-3 font-bold transition-colors cursor-pointer min-h-[44px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          سجّل وابدأ الآن
        </button>
      ) : (
        <Link
          href="/register"
          className="inline-flex items-center justify-center bg-background text-foreground hover:bg-background/90 rounded-xl px-10 py-3 font-bold transition-colors min-h-[44px] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          أنشئ حساباً مجانياً
        </Link>
      )}
    </section>
  );
}
