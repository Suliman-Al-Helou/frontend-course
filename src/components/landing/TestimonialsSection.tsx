"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

interface Testimonial {
  name: string;
  role: string;
  rating: number;
  text: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "عبد الرحمن ابو العيس",
    role: "مطور Frontend — وظّف بعد ٦ أشهر",
    rating: 5,
    text: "كنت أبحث عن منصة تُعلّم البرمجة بالعربية بشكل جاد. وجدت ما أريد هنا. الكورسات منظمة، والاختبارات تُثبّت المعلومة، والمدربون يردون على كل سؤال.",
  },
  {
    name: "راوية مشتهى",
    role: "مهندسة بيانات — انتقلت من المحاسبة",
    rating: 5,
    text: "تغيير مساري المهني بدا مستحيلاً حتى وجدت المنصة. بعد سنة كاملة من التعلم المنتظم، أعمل الآن كمهندسة بيانات. الشهادة ساعدتني كثيراً في المقابلات.",
  },
  {
    name: "سليمان الحلو",
    role: "مطور مواقع — طالب جامعي",
    rating: 5,
    text: "أفضل استثمار في نفسي. الفيديوهات عالية الجودة، الشرح بالعربية الواضحة، وطريقة التقدم المحكوم جعلتني أفهم فعلاً لا مجرد أحفظ.",
  },
];

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.5,
        delay: shouldReduceMotion ? 0 : index * 0.12,
      }}
      className="relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-xs transition-colors hover:border-primary/30 motion-reduce:transition-none"
    >
      <Quote className="absolute top-5 end-5 size-7 text-primary/15" aria-hidden="true" />

      <div>
        <div
          className="flex items-center gap-1 mb-4"
          role="img"
          aria-label={`تقييم ${testimonial.rating} من 5 نجوم`}
        >
          {Array.from({ length: testimonial.rating }).map((_, j) => (
            <Star key={j} className="size-4 text-warning fill-warning" aria-hidden="true" />
          ))}
        </div>

        <p className="text-sm sm:text-base leading-relaxed text-muted-foreground mb-6">
          &ldquo;{testimonial.text}&rdquo;
        </p>
      </div>

      <div className="flex items-center gap-3 border-t border-border/60 pt-4">
        <Avatar name={testimonial.name} size="md" bordered className="shrink-0" />
        <div className="min-w-0">
          <p className="font-semibold text-foreground text-sm truncate">{testimonial.name}</p>
          <p className="text-xs text-muted-foreground truncate">{testimonial.role}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function TestimonialsSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      className="scroll-mt-20 bg-background py-20 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
          className="mx-auto mb-14 max-w-2xl text-center space-y-2"
        >
          <h2
            id="testimonials-title"
            className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            قصص نجاح طلابنا
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
            أكثر من 500 طالب وطالبة وثّقوا تجربتهم وبدأوا مسيرتهم الاحترافية في سوق العمل التقني.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.name} testimonial={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
