'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp, BarChart3, Trophy, Video, MessageSquare, LucideIcon } from 'lucide-react';

interface Feature {
  icon:     LucideIcon;
  title:    string;
  desc:     string;
  gradient: string;
}

const FEATURES: Feature[] = [
  { icon: TrendingUp,   title: 'تقدم مقاس ومحكوم',    desc: 'لا يمكنك تخطي درس قبل إتمام السابق. نظام يضمن فهمك الحقيقي قبل الانتقال.',          gradient: 'from-blue-500 to-blue-600'   },
  { icon: Video,        title: 'فيديو محمي بالكامل',   desc: 'محتوى مؤمّن ضد التحميل والمشاركة غير المصرح بها. حقوق المدرب محفوظة دائماً.',         gradient: 'from-indigo-500 to-blue-500' },
  { icon: BarChart3,    title: 'اختبارات بعد كل درس',  desc: 'اختبر فهمك بعد كل وحدة. الاختبارات تُثبّت المعلومة وتكشف نقاط الضعف.',               gradient: 'from-sky-500 to-blue-500'    },
  { icon: Trophy,       title: 'شهادات معتمدة',         desc: 'احصل على شهادة إتمام رسمية تُثبت إنجازك وتُضيفها لملفك المهني.',                     gradient: 'from-yellow-400 to-orange-500'},
  { icon: MessageSquare,title: 'مجتمع تعليمي حي',      desc: 'تفاعل مع المدرب والطلاب، اطرح أسئلتك، وتبادل الخبرات مع مجتمع المتعلمين.',           gradient: 'from-blue-600 to-indigo-600' },
  { icon: ShieldCheck,  title: 'ضمان استرداد الأموال',  desc: '٧ أيام ضمان استرداد كامل بدون أسئلة. نثق بجودة محتوانا ونضمن رضاك.',                gradient: 'from-green-500 to-teal-500'  },
];

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const Icon = feature.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-lg transition-all group"
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="font-bold text-foreground text-lg mb-2">{feature.title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
    </motion.div>
  );
}

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            <ShieldCheck className="w-4 h-4" />
            لماذا تختارنا؟
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            نظام تعلّم لا مجرد محتوى
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            صُمّمت كل ميزة لضمان تعلمك الفعلي، وليس مجرد مشاهدة الفيديوهات
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => <FeatureCard key={i} feature={f} index={i} />)}
        </div>
      </div>
    </section>
  );
}