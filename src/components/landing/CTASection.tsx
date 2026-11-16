"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

function BackgroundDecorations() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* توهج إنديجو ناعم يبرز البطاقة المؤطرة */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[280px] bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute top-0 end-8 w-64 h-64 bg-primary/5 rounded-full blur-2xl" />
    </div>
  );
}

export default function CTASection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="join"
      aria-labelledby="cta-section-title"
      className="relative scroll-mt-20 overflow-hidden bg-background py-20 md:py-24"
    >
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card p-8 sm:p-12 md:p-16 text-center shadow-xl shadow-primary/5"
        >
          <BackgroundDecorations />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            {/* شارة توجيهية خفيفة */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" aria-hidden="true" />
              <span>انضم إلى نخبة مهندسي المستقبل</span>
            </div>

            {/* العنوان الرئيسي */}
            <h2
              id="cta-section-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight"
            >
              لا تنتظر الوقت المثالي
              <br />
              <span className="text-primary">الوقت المثالي هو الآن</span>
            </h2>

            {/* النص التوضيحي */}
            <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto">
              انضم لأكثر من 500 طالب بدأوا رحلتهم البرمجية معنا. تعلّم مهارات هندسية تطبيقية بدون مخاطرة، مع توجيه مباشر وضمان استرداد كامل خلال أول 7 أيام.
            </p>

            {/* أزرار الحث على اتخاذ إجراء */}
            <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                href="/register"
                size="lg"
                className="w-full sm:w-auto gap-2 font-semibold shadow-md px-8"
              >
                <span>ابدأ رحلتك مجاناً</span>
                <ArrowLeft className="size-4 rtl:rotate-0" aria-hidden="true" />
              </Button>
              <Button
                href="/courses"
                size="lg"
                variant="outline"
                className="w-full sm:w-auto font-semibold px-8"
              >
                تصفح الكورسات
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
