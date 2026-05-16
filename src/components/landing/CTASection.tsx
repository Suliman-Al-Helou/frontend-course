'use client';

// 1. Imports
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';

// 2. Sub Components
function BackgroundEffects() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-deep via-blue-mid to-blue-light" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
    </>
  );
}

// 3. Main Component
export default function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <BackgroundEffects />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 text-white rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            ابدأ اليوم — الأول خطوة الأصعب
          </div>

          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
            لا تنتظر الوقت المثالي
            <br />
            <span className="text-blue-light">الوقت المثالي هو الآن</span>
          </h2>

          {/* Body */}
          <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            انضم لأكثر من ١٢,٠٠٠ طالب بدأوا رحلتهم معنا.
            أول ٧ أيام مع ضمان استرداد كامل — لا شيء تخسره.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary hover:bg-blue-50 rounded-xl px-10 py-4 text-base font-bold shadow-2xl hover:shadow-white/20 transition-all"
            >
              ابدأ رحلتك مجاناً
              <ArrowLeft className="w-5 h-5 mr-2" />
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center justify-center border-2 border-white/30 text-white hover:bg-white/10 rounded-xl px-10 py-4 text-base font-semibold transition-colors"
            >
              تصفح الكورسات
            </Link>
          </div>

          {/* Trust line */}
          <p className="text-white/50 text-sm mt-6">
            لا حاجة لبطاقة ائتمان • ٧ أيام ضمان استرداد • إلغاء في أي وقت
          </p>
        </motion.div>
      </div>
    </section>
  );
}