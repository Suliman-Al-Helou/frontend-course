"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface MethodologyItem {
  title: string;
  description: string;
  image: string;
  indicator: string;
}

const METHODOLOGY_PILLARS: MethodologyItem[] = [
  {
    title: "مسارات مهيكلة ومشغل فيديو متطور",
    description:
      "دروس برمجية متسلسلة خطوة بخطوة مع مشغل مخصص، وحفظ تلقائي لنقاط التوقف ونسبة الإنجاز الفعلية لكل درس.",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop",
    indicator: "مشغل ذكي • تتبع إنجاز تلقائي",
  },
  {
    title: "مهام واختبارات اجتياز بعد كل درس",
    description:
      "تطبيقات واختبارات تفاعلية بعد كل مفهوم لضمان ترسيخ المعلومة واجتياز التحدي قبل الانتقال للمرحلة التالية.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
    indicator: "مهام برمجية • قياس استيعاب فوري",
  },
  {
    title: "لقاءات حية وتوجيه هندسي مباشر",
    description:
      "جلسات تفاعلية دورية عبر Zoom لمناقشة المعماريات البرمجية، الإجابة عن التساؤلات، وتفكيك التحديات مع مدربين خبراء.",
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop",
    indicator: "جلسات Zoom • مراجعة وتوجيه حي",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="methodology"
      aria-labelledby="methodology-title"
      className="scroll-mt-20 border-y border-[#222939] bg-[#161b27] py-20 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* رأس السكشن الثنائي الصارم: عنوان عريض + سطر شفاف في الأسفل فقط */}
        <div className="mx-auto mb-14 max-w-xl text-center space-y-2">
          <h2
            id="methodology-title"
            className="text-2xl font-bold tracking-tight text-[#eff2f5] sm:text-3xl"
          >
            المنهجية الهندسية في التدريب
          </h2>
          <p className="text-sm leading-relaxed text-[#98a3b3]">
            ثلاث ركائز عملية تبني مهاراتك من الأساس النظري حتى قيادة المشاريع في بيئات العمل الواقعية.
          </p>
        </div>

        {/* شبكة الكروت البصرية الواقعية بنمط Campsite و Clerk */}
        <div className="grid gap-6 md:grid-cols-3">
          {METHODOLOGY_PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="group flex flex-col justify-between overflow-hidden rounded-lg border border-[#222939] bg-[#10141e] transition-all duration-200 hover:-translate-y-1 hover:border-[#323b50]"
            >
              <div>
                {/* الحاوية البصرية: صورة واقعية واضحة بنسبة أبعاد 16:10 */}
                <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-[#222939] bg-black">
                  <Image
                    src={pillar.image}
                    alt={pillar.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover opacity-85 transition-opacity duration-300 group-hover:opacity-100"
                  />
                </div>

                {/* المحتوى النصي: عنوان واضح وشرح واقعي لما تقدمه المنصة */}
                <div className="p-5 text-right space-y-2">
                  <h3 className="text-sm font-bold text-[#eff2f5]">{pillar.title}</h3>
                  <p className="text-xs leading-relaxed text-[#98a3b3]">{pillar.description}</p>
                </div>
              </div>

              {/* المؤشر التقني الصامت في الأسفل */}
              <div className="border-t border-[#222939] px-5 py-3 text-[11px] font-mono text-[#98a3b3]">
                {pillar.indicator}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
