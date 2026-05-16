// src/app/(public)/contact/page.tsx
'use client';
import { motion } from 'framer-motion';
import Navbar  from '@/components/landing/Navbar';
import Footer  from '@/components/landing/Footer';
import { ContactInfo } from '@/app/(public)/contact/_components/ContactInfo';
import { ContactForm }  from '@/app/(public)/contact/_components/ContactForm';
import { ContactFAQ }   from '@/app/(public)/contact/_components/ContactFAQ';
import { CONTACT_FAQS } from '@/app/(public)/contact/_data/contactData';

// export const metadata = {
//   title:       'تواصل معنا — تِقنيار',
//   description: 'تواصل مع فريق دعم تِقنيار عبر واتساب أو البريد الإلكتروني',
// };

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background font-arabic" dir="rtl">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-deep to-blue-mid pt-28 pb-16 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            كيف يمكننا مساعدتك؟
          </h1>
          <p className="text-white/70 text-lg">فريقنا جاهز للرد على جميع استفساراتك</p>
        </motion.div>
      </div>

      {/* Body */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          <ContactInfo />
          <ContactForm />
        </div>

        <ContactFAQ faqs={CONTACT_FAQS} />
      </div>

      <Footer />
    </div>
  );
}