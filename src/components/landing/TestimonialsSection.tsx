'use client';

// 1. Imports
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import Image from 'next/image';
// 2. Types & Data
interface Testimonial {
  name: string;
  role: string;
  // avatar: string;
  rating: number;
  text: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name:   'عبدالله الحربي',
    role:   'مطور Frontend — وظّفه بعد ٦ أشهر',
    // avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    rating: 5,
    text:   'كنت أبحث عن منصة تُعلّم البرمجة بالعربية بشكل جاد. وجدت ما أريد هنا. الكورسات منظمة، والاختبارات تُثبّت المعلومة، والمدربون يردون على كل سؤال.',
  },
  {
    name:   'ريم القحطاني',
    role:   'مهندسة بيانات — انتقلت من المحاسبة',
    // avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
    rating: 5,
    text:   'تغيير مساري المهني بدا مستحيلاً حتى وجدت المنصة. بعد سنة كاملة من التعلم المنتظم، أعمل الآن كمهندسة بيانات. الشهادة ساعدتني كثيراً في المقابلات.',
  },
  {
    name:   'أحمد السالم',
    role:   'مطور تطبيقات — طالب جامعي',
    // avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
    rating: 5,
    text:   'أفضل استثمار في نفسي. الفيديوهات عالية الجودة، الشرح بالعربية الواضحة، وطريقة التقدم المحكوم جعلتني أفهم فعلاً لا مجرد أحفظ.',
  },
];

// 3. Sub Components
interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      className="bg-card rounded-2xl p-6 border border-border relative"
    >
      <Quote className="absolute top-4 left-4 w-8 h-8 text-primary/50" />

      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: testimonial.rating }).map((_, j) => (
          <Star key={j} className="w-4 h-4 text-warning text-yellow-400  fill-yellow-400" />
        ))}
      </div>

      <p className="text-foreground/80 leading-relaxed mb-6 text-sm">{testimonial.text}</p>

      <div className="flex items-center gap-3">
        {/* <Image
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-11 h-11 rounded-full object-cover border-2 border-border"
       width={48} height={48} 
       /> */}
        <div>
          <div className="font-bold text-foreground text-sm">{testimonial.name}</div>
          <div className="text-xs text-muted-foreground">{testimonial.role}</div>
        </div>
      </div>
    </motion.div>
  );
}

// 4. Main Component
export default function TestimonialsSection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            <Star className="w-4 h-4  text-yellow-400 fill-yellow-400" />
            قصص نجاح حقيقية
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            طلابنا يتحدثون
          </h2>
          <p className="text-muted-foreground text-lg">
            +١٢,٠٠٠ طالب وثّقوا رحلتهم معنا
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.name} testimonial={t} index={i} />
          ))}
        </div>

      </div>
    </section>
  );
}