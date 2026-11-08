"use clint";
import ContactPanel from "@/components/contact/ContactPanel";
import { motion } from "framer-motion";

export default function ContactSection() {
  return (
    <div
      // initial={{ opacity: 0, y: 30 }}
      // whileInView={{ opacity: 1, y: 0 }}
      // viewport={{ once: true }}
      // transition={{ duration: 0.7 }}
      id="contact"
      className="scroll-mt-20 bg-background py-24 "
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-foreground sm:text-4xl">
            تواصل معنا {/* TODO: translate */}
          </h2>
          <p className="text-muted-foreground">
            عندك سؤال أو اقتراح؟ راسلنا على واتساب أو البريد، أو اترك رسالة هنا.{" "}
            {/* TODO: translate */}
          </p>
        </div>
        <ContactPanel />
      </div>
    </div>
  );
}
