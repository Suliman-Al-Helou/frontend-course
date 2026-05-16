'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react';

interface Step        { label: string; done: boolean; }
interface FloatingPill{ text: string; delay: number; x: string; y: string; }

const ROLES: string[] = ['مطوّر ويب', 'مهندس AI', 'مطوّر تطبيقات', 'مختص أمن سيبراني'];

const STEPS: Step[] = [
  { label: 'اختر مسارك التقني',  done: true  },
  { label: 'تعلّم مع مدرب خبير', done: true  },
  { label: 'ابنِ مشاريع حقيقية', done: false },
  { label: 'احصل على شهادتك',    done: false },
];

const FLOATING_PILLS: FloatingPill[] = [
  { text: 'Python 🐍',  delay: 0,   x: '5%',  y: '18%' },
  { text: 'React ⚛️',   delay: 0.6, x: '80%', y: '12%' },
  { text: 'AI & ML 🤖', delay: 1.2, x: '88%', y: '72%' },
  { text: 'SQL 🗄️',     delay: 0.3, x: '2%',  y: '78%' },
];

const AVATARS = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=36&h=36&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=36&h=36&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=36&h=36&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=36&h=36&fit=crop&crop=face',
];

function TypingRole({ roles }: { roles: string[] }) {
  const [index,     setIndex]     = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting,  setDeleting]  = useState(false);

  useEffect(() => {
    const current = roles[index];
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIndex(i => (i + 1) % roles.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, index, roles]);

  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary to-accent inline-block min-w-[200px]">
      {displayed}
      <span className="inline-block w-0.5 h-[0.9em] bg-primary align-middle mr-0.5 animate-pulse" />
    </span>
  );
}

function LearningPathCard() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.35, ease: 'easeOut' }}
      className="lg:col-span-2 hidden lg:block"
    >
      <div className="relative">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="bg-card rounded-2xl border border-border shadow-xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">مسارك الحالي</p>
              <h3 className="font-bold text-foreground">مطوّر Full-Stack</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg">🚀</div>
          </div>

          <div className="mb-5">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>تقدّمك</span>
              <span className="text-primary font-semibold">الخطوة ٢ من ٤</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '50%' }}
                transition={{ delay: 1.2, duration: 1.2, ease: 'easeOut' }}
                className="h-full bg-gradient-to-l from-primary to-accent rounded-full"
              />
            </div>
          </div>

          <div className="space-y-3">
            {STEPS.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.12 }}
                className={`flex items-center gap-3 rounded-xl p-3 transition-colors ${
                  step.done ? 'bg-primary/5' : 'bg-muted/40'
                }`}
              >
                {step.done
                  ? <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  : <Circle       className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
                <span className={`text-sm font-medium ${step.done ? 'text-primary' : 'text-muted-foreground'}`}>
                  {step.label}
                </span>
                {!step.done && i === 2 && (
                  <span className="mr-auto text-[10px] font-semibold bg-primary text-white rounded-full px-2 py-0.5">
                    التالي
                  </span>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }} className="mt-5">
            <Link
              href="/register"
              className="w-full inline-flex items-center justify-center rounded-xl bg-primary hover:bg-primary/90 text-white h-10 text-sm font-semibold transition-colors"
            >
              ابدأ مسارك الآن
            </Link>
          </motion.div>
        </motion.div>

        {/* Notification popup */}
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
          className="absolute -bottom-5 -right-5 bg-card border border-border rounded-xl shadow-lg px-4 py-3 flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-base">🎓</div>
          <div>
            <p className="text-xs font-bold text-foreground">أحمد أكمل الكورس!</p>
            <p className="text-[10px] text-muted-foreground">منذ دقيقتين</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20 bg-background">

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Orbs */}
      <div className="absolute top-10 right-1/4 w-[480px] h-[480px] rounded-full bg-primary/8 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[360px] h-[360px] rounded-full bg-accent/10 blur-[80px] pointer-events-none" />

      {/* Floating pills */}
      {FLOATING_PILLS.map((pill, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
          transition={{
            delay: pill.delay + 1,
            duration: 3.5,
            y: { repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: pill.delay },
          }}
          className="absolute hidden lg:flex items-center gap-1.5 bg-card border border-border shadow-sm rounded-full px-3 py-1.5 text-sm font-medium text-foreground select-none"
          style={{ left: pill.x, top: pill.y }}
        >
          {pill.text}
        </motion.div>
      ))}

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="grid lg:grid-cols-5 gap-16 items-center">

          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-3"
          >
            {/* Live badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-primary text-sm font-semibold">
                +٢٤٠ طالب انضموا لـ Future House هذا الشهر
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <h1 className="text-5xl sm:text-6xl font-bold text-foreground leading-[1.15] mb-3">
                تحوّل إلى
              </h1>
              <h1 className="text-5xl sm:text-6xl font-bold leading-[1.15]">
                <TypingRole roles={ROLES} />
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-10"
            >
              Future House هي المنصة التقنية العربية الأولى التي تأخذك من الفكرة إلى الوظيفة — بمسارات مهيكلة، مدربين خبراء، ومشاريع تُضيفها لـ CV.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 mb-12"
            >
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-xl px-8 h-12 text-base font-semibold shadow-lg shadow-primary/20 group transition-colors"
              >
                ابدأ مجاناً الآن
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center justify-center rounded-xl px-8 h-12 text-base font-medium border border-border hover:border-primary hover:text-primary transition-colors"
              >
                استعرض الكورسات
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
              className="flex items-center gap-3"
            >
              <div className="flex -space-x-3 space-x-reverse">
                {AVATARS.map((src, i) => (
                  <img key={i} src={src} alt="" className="w-9 h-9 rounded-full border-2 border-background object-cover" />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">+١٢,٠٠٠ طالب راضٍ</p>
              </div>
            </motion.div>
          </motion.div>

          <LearningPathCard />
        </div>
      </div>
    </section>
  );
}