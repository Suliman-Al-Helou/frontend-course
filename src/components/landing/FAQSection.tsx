'use client';

// 1. Imports
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

// 2. Types & Data
interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  { q: 'هل التسجيل في المنصة مجاني؟',      a: 'نعم، التسجيل مجاني تماماً. يمكنك إنشاء حسابك والوصول للكورسات فور التسجيل.' },
  { q: 'كيف يعمل نظام التقدم المحكوم؟',    a: 'كل درس يُفتح فقط بعد إتمام الدرس السابق — يجب مشاهدة ≥٨٠٪ من الفيديو واجتياز المهمة للانتقال للدرس التالي. هذا يضمن فهمك الحقيقي قبل المضي قدماً.' },
  { q: 'هل يمكنني التعلم من الجوال؟',       a: 'بالتأكيد! المنصة مصممة بالكامل للموبايل وتعمل بكفاءة على جميع الأجهزة — هاتف، تابلت، أو كمبيوتر.' },
  { q: 'ما هي الشهادات التي سأحصل عليها؟', a: 'عند إكمال أي كورس بنجاح، تحصل على شهادة إتمام رسمية من المنصة يمكن إضافتها لملفك على LinkedIn وسيرتك الذاتية.' },
  { q: 'ماذا لو لم أفهم درساً معيناً؟',    a: 'يمكنك إعادة مشاهدة الدرس أي عدد من المرات، وطرح سؤالك في مجتمع المنصة أو التواصل مع المدرب مباشرة.' },
  { q: 'هل يوجد ضمان استرداد الأموال؟',    a: 'نعم، نضمن استرداد كامل خلال ٧ أيام من الشراء بدون أي أسئلة أو شروط.' },
  { q: 'كم من الوقت يستغرق إكمال الكورس؟', a: 'يعتمد على الكورس ووتيرة دراستك. معظم طلابنا يكملون الكورس بتخصيص ساعة إلى ساعتين يومياً.' },
];

// 3. Sub Components
interface FAQItemProps {
  faq: FAQItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItemCard({ faq, index, isOpen, onToggle }: FAQItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-right hover:bg-muted/50 transition-colors"
      >
        <span className="font-semibold text-foreground text-sm sm:text-base">{faq.q}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 mr-3"
        >
          <ChevronDown className={`w-5 h-5 transition-colors ${isOpen ? 'text-primary' : 'text-muted-foreground'}`} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed border-t border-border pt-4">
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// 4. Main Component
export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) =>
    setOpenIndex(prev => (prev === index ? null : index));

  return (
    <section id="faq" className="py-24 bg-gradient-to-b from-background to-secondary/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            <HelpCircle className="w-4 h-4" />
            الأسئلة الشائعة
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            عندك سؤال؟ جاوبناك
          </h2>
          <p className="text-muted-foreground text-lg">
            إجابات على أكثر الأسئلة التي يطرحها طلابنا
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <FAQItemCard
              key={i}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => handleToggle(i)}
            />
          ))}
        </div>

      </div>
    </section>
  );
}