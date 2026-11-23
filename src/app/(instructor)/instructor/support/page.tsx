import React from "react";
import { LifeBuoy, HelpCircle } from "lucide-react";
import { getIronSessionData } from "@/lib/session";
import { ContactForm, ContactInfo } from "@/features/contact";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "الدعم والمساعدة للمدربين | Future House Academy",
  description: "خدمات الدعم الفني والأكاديمي للهيئة التدريسية بالأكاديمية",
};

const INSTRUCTOR_FAQS = [
  {
    q: "كيف يتم إسناد المقررات الدراسية لحسابي كمدرب؟",
    a: "يتم إسناد المقررات من قِبل إدارة المنصة عبر لوحة الإدارة. إذا كنت بحاجة إلى إسناد مقرر معين لك، يمكنك إرسال طلب عبر النموذج أعلاه أو التواصل مباشرة مع الإدارة عبر الواتساب مع ذكر عنوان الكورس.",
  },
  {
    q: "هل يمكن للمدرب تغيير أسعار الكورسات أو نشرها للعامة؟",
    a: "تخضع أسعار المقررات وحالة النشر العام لسياسة التسويق وحوكمة إدارة الأكاديمية لضمان معايير الجودة والتسعير الموحد. صلاحيات المدرب تتركز في بناء المنهج التعليمي، وإعداد الفصول والدروس، وتصميم الاختبارات والتحديات.",
  },
  {
    q: "ما هي معايير تسجيل ورفع الفيديوهات المعتمدة؟",
    a: "يُشترط أن تكون الفيديوهات مسجلة بدقة 1080p عالية الوضوح على الأقل، مع صوت نقي وواضح وخلفية هادئة. تدعم المنصة ربط مقاطع YouTube (بحالة غير مدرج Unlisted) وبث HLS المشفر المقاوم للقرصنة.",
  },
  {
    q: "كيف يمكنني إضافة اختبارات ومهام للدروس؟",
    a: "من خلال صفحة تفاصيل المقرر الموكل إليك، يمكنك الدخول على أي درس وإضافة أسئلة اختيار من متعدد (MCQ) أو صح/خطأ (True/False) مع تحديد نسبة النجاح وعدد المحاولات وشرح الإجابة الصحيحة للطالب.",
  },
];

export default async function InstructorSupportPage() {
  const session = await getIronSessionData();
  const user = session.user;

  return (
    <div className="space-y-10 animate-in fade-in duration-300 motion-reduce:animate-none">
      {/* Page Header */}
      <div className="border-b border-border/60 pb-6 space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
          <LifeBuoy className="w-3.5 h-3.5" aria-hidden="true" />
          <span>مركز المساندة الأكاديمية</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          الدعم والمساعدة للأكاديميين
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          فريق إدارة الأكاديمية والدعم التقني جاهز لمساعدتك في إسناد المقررات، إعداد المناهج، وتجاوز
          أي صعوبات فنية.
        </p>
      </div>

      {/* Main Support Grid: Direct Channels & Form */}
      <section aria-label="قنوات التواصل والدعم" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <ContactInfo />
        </div>
        <div>
          <ContactForm
            initial={{ name: user?.name ?? "", email: user?.email ?? "" }}
            title="أرسل استفساراً لإدارة المنصة"
          />
        </div>
      </section>

      {/* Academic FAQ Section */}
      <section aria-label="الأسئلة الشائعة للمدربين" className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary" aria-hidden="true" />
          <h2 className="text-lg font-bold text-foreground">الأسئلة الشائعة للهيئة التدريسية</h2>
        </div>

        <Card className="p-4 sm:p-6 border-border bg-card">
          <Accordion type="single" className="w-full space-y-2">
            {INSTRUCTOR_FAQS.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="border-b border-border/60 last:border-0"
              >
                <AccordionTrigger className="text-right text-sm sm:text-base font-semibold text-foreground hover:text-primary transition-colors py-4">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-4">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </section>
    </div>
  );
}
