"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Mail, Send, Check } from "lucide-react";
import api from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useContactForm } from "@/components/contact/useContactForm";
import { SUPPORT_EMAIL, WHATSAPP_URL } from "@/lib/contact";

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
];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.53c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08s.89 2.42 1.01 2.58c.13.17 1.75 2.67 4.24 3.75.59.26 1.05.41 1.41.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.1-.23-.17-.48-.29" />
    </svg>
  );
}

function BackgroundDecorations() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -left-20 size-[28rem] rounded-full bg-slate-400/[0.05] blur-3xl dark:bg-white/[0.05]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -right-20 size-[28rem] rounded-full bg-slate-400/[0.05] blur-3xl dark:bg-white/[0.05]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 text-foreground opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
    </>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [dynamicFaqs, setDynamicFaqs] = useState<FAQItem[]>([]);
  const { form, sent, loading, error, updateField, handleSubmit } = useContactForm();

  useEffect(() => {
    api
      .get("/faqs")
      .then((res) => {
        const data = res.data.data ?? res.data;
        if (Array.isArray(data) && data.length > 0) {
          setDynamicFaqs(data.slice(0, 5).map((f: any) => ({ q: f.question, a: f.answer })));
        }
      })
      .catch(() => {});
  }, []);

  const faqs = dynamicFaqs.length > 0 ? dynamicFaqs : STATIC_FAQS;

  const handleToggle = (index: number) => {
    // فتح سؤال يغلق السؤال المفتوح حالياً لمنع تمدد الطول والـ scroll
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="faq"
      className="relative scroll-mt-20 overflow-hidden border-t border-border bg-background py-20 md:py-24"
    >
      <BackgroundDecorations />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* الترويسة الثنائية الصارمة */}
        <div className="mx-auto mb-14 max-w-xl text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            الأسئلة الشائعة والتواصل المباشر
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            إجابات فورية على أكثر الاستفسارات شيوعاً، أو تواصل مع فريقنا الهندسي مباشرة.
          </p>
        </div>

        {/* شبكة العمودين: الشق الأيمن (الأسئلة الشائعة) والشق الأيسر (النموذج) */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
          {/* الشق الأيمن: الأسئلة الشائعة (متطابقة الطول ومحكومة الأكورديون) */}
          <div className="space-y-3 lg:col-span-7">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-border/80"
                >
                  <button
                    type="button"
                    onClick={() => handleToggle(i)}
                    className="flex w-full items-center justify-between p-4 text-right transition-colors hover:bg-muted/40"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-semibold text-foreground sm:text-base">
                      {faq.q}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
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
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="border-t border-border px-4 pb-4 pt-3 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* الشق الأيسر: نموذج تواصل معنا وزري الواتساب والبريد */}
          <div id="contact" className="scroll-mt-24 lg:col-span-5">
            {sent ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 text-center shadow-xs">
                <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-success/15 text-success">
                  <Check className="size-6" />
                </div>
                <h3 className="mb-1 text-base font-bold text-foreground">تم استلام رسالتك بنجاح</h3>
                <p className="text-xs text-muted-foreground">
                  سنرد عليك في أقرب وقت عبر البريد الإلكتروني.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-xs"
              >
                <div className="space-y-1.5">
                  <label htmlFor="c-name" className="text-xs font-semibold text-foreground">
                    الاسم الكامل
                  </label>
                  <Input
                    id="c-name"
                    required
                    value={form.name}
                    onChange={updateField("name")}
                    placeholder="مثال: أحمد عبد الله"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="c-email" className="text-xs font-semibold text-foreground">
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
                    className="text-right"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="c-msg" className="text-xs font-semibold text-foreground">
                    الرسالة
                  </label>
                  <textarea
                    id="c-msg"
                    rows={3}
                    required
                    value={form.message}
                    onChange={updateField("message")}
                    placeholder="اكتب استفسارك بالتفصيل..."
                    className="flex min-h-[85px] w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
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
                    className="h-11 w-full justify-center border-border bg-background hover:border-[#25D366]/50 hover:bg-[#25D366]/10 transition-colors"
                  >
                    <WhatsAppIcon className="size-5 text-[#25D366]" />
                  </Button>

                  <Button
                    variant="outline"
                    href={`mailto:${SUPPORT_EMAIL}`}
                    aria-label="راسلنا عبر البريد الإلكتروني"
                    className="h-11 w-full justify-center border-border bg-background hover:border-primary/50 hover:bg-primary/10 transition-colors"
                  >
                    <Mail className="size-5 text-primary" />
                  </Button>
                </div>

                {/* زر الإرسال الرئيسي */}
                <Button type="submit" disabled={loading} className="w-full h-11" size="default">
                  <Send className="size-4 rtl:-scale-x-100" />
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
