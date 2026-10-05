"use client";

import { motion } from "framer-motion";
import { Gift, Languages, GraduationCap } from "lucide-react";

const FEATURES = [
  {
    icon: Gift,
    title: "كورسات مجانية", // TODO: translate
    description: "ابدأ التعلم بحساب مجاني وبدون أي رسوم.", // TODO: translate
  },
  {
    icon: Languages,
    title: "محتوى عربي", // TODO: translate
    description: "شروحات بالعربية بالكامل، من الأساسيات حتى الاحتراف.", // TODO: translate
  },
  {
    icon: GraduationCap,
    title: "مدربون ذوو خبرة", // TODO: translate
    description: "يقدّم الكورسات مهندسون لديهم خبرة عملية في المجال.", // TODO: translate
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-20 bg-background py-24 ">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-foreground sm:text-4xl">
            لماذا Future House؟ {/* TODO: translate */}
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            كل ما تحتاجه لتتعلم البرمجة بالعربية. {/* TODO: translate */}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3   py-10">
          {FEATURES.map(({ icon: Icon, title, description }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-lg border border-border bg-card p-6 flex gap-5 items-center"
            >
              <div className="mb-4 flex size-15 items-center justify-center rounded-md bg-primary/15 text-primary">
                <Icon className="size-7" />
              </div>
              <div>
                
              <h3 className="mb-2 text-lg font-bold text-foreground">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}