// باقي الصفحة تحمّل lazy لأنها تحت الـ fold
import Navbar               from '@/components/landing/Navbar';
import HeroSection          from '@/components/landing/HeroSection';
import CoursesSection       from '@/components/landing/CoursesSection';
import FeaturesSection      from '@/components/landing/FeaturesSection';
import TestimonialsSection  from '@/components/landing/TestimonialsSection';
import FAQSection           from '@/components/landing/FAQSection';
import CTASection           from '@/components/landing/CTASection';
import Footer               from '@/components/landing/Footer';
export const metadata = {
  title: 'Future House — منصة التعلم التقني الأولى بالعربية',
  description: 'منصة تعليمية محكومة لتعلم البرمجة والتقنية باحترافية.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen font-arabic" dir="rtl">
      <Navbar />
      <main>
        <HeroSection />
        <CoursesSection />
        <FeaturesSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}