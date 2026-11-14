"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronDown, Mail, Send, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useContactForm, SUPPORT_EMAIL, WHATSAPP_URL } from "@/features/contact";
import { faqQueries } from "@/features/faqs";

interface FAQItem {
  q: string;
  a: string;
}

const STATIC_FAQS: FAQItem[] = [
  {
    q: "هل التسجيل في المنصة مجاني بالكامل؟",
    a: "نعم، التسجيل مجاني تماماً. يمكنك إنشاء حسابك والوصول للمحتوى المفتوح فوراً.",
  },
  {
    q: "كيف يعمل نظام التقدم والمشغل المحكوم؟",
    a: "كل درس يُفتح بعد استيفاء شروط الدرس السابق واجتياز التحدي لضمان ترسيخ الفهم الهندسي الحقيقي.",
  },
  {
    q: "هل أحتاج خبرة سابقة في البرمجة للبدء في المسارات؟",
    a: "تتدرج المسارات من الأساسيات المعمارية الصلبة وحتى المستويات المتقدمة، مع اختبارات تحديد مستوى ومسارات تمهيدية تنطلق بك خطوة بخطوة مهما كانت خلفيتك السابقة.",
  },
  {
    q: "هل تتوفر مراجعات كود ولقاءات حية؟",
    a: "بالتأكيد، تُراجع الأكواد أسبوعياً مع لقاءات دورية مباشرة عبر Zoom لمناقشة المعماريات والحلول.",
  },
  {
    q: "ما هي الشهادات التي سأحصل عليها عند التخرج؟",
    a: "تحصل على شهادة إتمام رسمية موثقة برابط دائم يمكن إرفاقه في سيرتك الذاتية وملفك على LinkedIn.",
  },
  {
    q: "هل يوجد ضمان لاسترداد الاشتراك؟",
    a: "نعم، نقدم ضمان استرداد كامل بنسبة 100% خلال أول ٧ أيام بدون أي شروط معقدة.",
  },
  {
    q: "هل أحصل على وصول دائم وتحديثات للمحتوى؟",
    a: "نعم، بمجرد تسجيلك في أي مسار تحصل على وصول دائم مدى الحياة للدروس والتطبيقات، بالإضافة إلى كافة التحديثات والتحسينات المعمارية التي تُضاف مستقبلاً مجاناً.",
  },
];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.53c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08s.89 2.42 1.01 2.58c.13.17 1.75 2.67 4.24 3.75.59.26 1.05.41 1.41.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.17-.48-.29" />
    </svg>
  );
}

interface FAQSectionProps {
  initial?: { name?: string; email?: string };
  isDashboard?: boolean;
}

export default function FAQSection({ initial, isDashboard = false }: FAQSectionProps = {}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { data: serverFaqs = [] } = useQuery(faqQueries.list());
  const { form, sent, loading, error, updateField, handleSubmit } = useContactForm(initial);
  const isSubmittingRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();

  const handleSafeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current || loading) return;
    isSubmittingRef.current = true;
    try {
      await handleSubmit(e);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const faqs =
    Array.isArray(serverFaqs) && serverFaqs.length > 0
      ? serverFaqs.slice(0, 7).map((f) => ({ q: f.question, a: f.answer }))
      : STATIC_FAQS;

  const handleToggle = (index: number) => {
    // فتح سؤال يغلق السؤال المفتوح حالياً لمنع تمدد الطول والـ scroll
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="faq"
      className={
        isDashboard
          ? "relative w-full py-4 sm:py-6"
          : "relative flex min-h-screen flex-col justify-center scroll-mt-20 border-t border-border bg-background py-16 md:py-24"
      }
    >
      <div
        className={`relative z-10 mx-auto w-full ${
          isDashboard ? "max-w-5xl px-0" : "max-w-6xl px-4 sm:px-6 lg:px-8"
        }`}
      >
        {/* شبكة متوازنة بمسافة واسعة: الشق الأيمن (الأسئلة الشائعة) والشق الأيسر (تواصل معنا) */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 lg:items-start">
          {/* الشق الأيمن: الأسئلة الشائعة */}
          <div className="lg:col-span-6">
            <div className="mb-6 text-center space-y-1.5">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                الأسئلة الشائعة
              </h2>
              <p className="text-xs text-muted-foreground sm:text-sm">
                إجابات فورية على أكثر الاستفسارات التي يطرحها طلابنا
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, i) => {
                const isOpen = openIndex === i;
                return (
                  <div
                    key={i}
                    className="overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-border/80"
                  >
                    <button
                      type="button"
                      id={`faq-question-${i}`}
                      aria-controls={`faq-answer-${i}`}
                      onClick={() => handleToggle(i)}
                      className="flex w-full items-center justify-between p-4 text-right transition-colors hover:bg-muted/40 sm:p-4.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                      aria-expanded={isOpen}
                    >
                      <span className="text-sm font-semibold text-foreground sm:text-base">
                        {faq.q}
                      </span>
                      <motion.div
                        animate={{ rotate: shouldReduceMotion ? 0 : isOpen ? 180 : 0 }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                        className="mr-3 shrink-0"
                      >
                        <ChevronDown
                          className={`size-4 transition-colors ${
                            isOpen ? "text-primary" : "text-muted-foreground"
                          }`}
                        />
                      </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-answer-${i}`}
                          role="region"
                          aria-labelledby={`faq-question-${i}`}
                          initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={shouldReduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                          transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                        >
                          <div className="border-t border-border px-4.5 pb-4.5 pt-3.5 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* الشق الأيسر: نموذج تواصل معنا الموسع والمريح */}
          <div id="contact" className="scroll-mt-24 lg:col-span-6">
            <div className="mb-6 text-center space-y-1.5">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                تواصل معنا
              </h2>
              <p className="text-xs text-muted-foreground sm:text-sm">
                راسلنا مباشرة وسنرد عليك في أقرب وقت ممكن
              </p>
            </div>

            {sent ? (
              <div
                role="status"
                aria-live="polite"
                className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-10 text-center shadow-xs"
              >
                <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-success/15 text-success">
                  <Check className="size-7" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-foreground">تم استلام رسالتك بنجاح</h3>
                <p className="text-sm text-muted-foreground">
                  سنعاود الرد عليك خلال أقل من 24 ساعة عبر البريد الإلكتروني.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSafeSubmit}
                className="space-y-4.5 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs"
              >
                <div className="space-y-1.5">
                  <label
                    htmlFor="c-name"
                    className="text-xs font-semibold text-foreground sm:text-sm"
                  >
                    الاسم الكامل
                  </label>
                  <Input
                    id="c-name"
                    required
                    value={form.name}
                    onChange={updateField("name")}
                    placeholder="مثال: أحمد عبد الله"
                    className="h-12 text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="c-email"
                    className="text-xs font-semibold text-foreground sm:text-sm"
                  >
                    البريد الإلكتروني
                  </label>
                  <Input
                    id="c-email"
                    type="email"
                    required
                    value={form.email}
                    onChange={updateField("email")}
                    placeholder="name@example.com"
                    dir="ltr"
                    className="h-12 text-right text-sm sm:text-base"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="c-msg"
                    className="text-xs font-semibold text-foreground sm:text-sm"
                  >
                    الرسالة أو الاستفسار
                  </label>
                  <textarea
                    id="c-msg"
                    rows={5}
                    required
                    value={form.message}
                    onChange={updateField("message")}
                    placeholder="اشرح استفسارك أو هدفك بالتفصيل... نرحب بأي سؤال حول المسارات، المشاريع، أو منهجية التدريب."
                    className="flex min-h-[130px] w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm leading-relaxed text-foreground transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
                  />
                </div>

                {error && <p className="text-xs text-destructive">{error}</p>}

                {/* أزرار الواتساب والبريد الإلكتروني جنباً إلى جنب قبل زر الإرسال */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <Button
                    variant="outline"
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="تواصل عبر واتساب"
                    className="h-12 w-full justify-center border-border bg-background hover:border-[#25D366]/50 hover:bg-[#25D366]/10 transition-colors"
                  >
                    <WhatsAppIcon className="size-5 text-[#25D366]" />
                  </Button>

                  <Button
                    variant="outline"
                    href={`mailto:${SUPPORT_EMAIL}`}
                    aria-label="راسلنا عبر البريد الإلكتروني"
                    className="h-12 w-full justify-center border-border bg-background hover:border-primary/50 hover:bg-primary/10 transition-colors"
                  >
                    <Mail className="size-5 text-primary" />
                  </Button>
                </div>

                {/* زر الإرسال الرئيسي */}
                <Button
                  type="submit"
                  loading={loading}
                  className="w-full h-12 text-sm sm:text-base font-semibold"
                  size="default"
                >
                  {!loading && <Send className="size-4.5 rtl:-scale-x-100" />}
                  {loading ? "جارٍ الإرسال..." : "إرسال الرسالة"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
