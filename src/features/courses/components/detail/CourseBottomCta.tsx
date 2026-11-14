"use client";

import { Button } from "@/components/ui/button";

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
      className="mt-16 rounded-2xl border border-border bg-card p-8 sm:p-12 text-center shadow-md"
    >
      <h3 id="cta-heading" className="text-2xl font-bold text-foreground mb-3">
        مستعد تبدأ؟
      </h3>
      <p className="text-muted-foreground mb-6 max-w-xl mx-auto text-base">
        سجّل الآن وابدأ الكورس فوراً — الوصول الكامل بعد موافقة الإدارة
      </p>

      {isAuthenticated ? (
        <Button onClick={scrollToTop} size="lg" className="px-10">
          سجّل وابدأ الآن
        </Button>
      ) : (
        <Button href="/register" size="lg" className="px-10">
          أنشئ حساباً مجانياً
        </Button>
      )}
    </section>
  );
}
