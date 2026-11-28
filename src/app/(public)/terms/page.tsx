import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "الشروط والأحكام | Future House",
  description: "الشروط والأحكام المنظمة لاستخدام منصة Future House التعليمية.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground py-16 px-4 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-3 border-b border-border pb-6">
          <h1 className="text-3xl font-bold tracking-tight">الشروط والأحكام</h1>
          <p className="text-sm text-muted-foreground">آخر تحديث: نوفمبر 2026</p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">1. قبول الشروط</h2>
          <p className="text-muted-foreground leading-relaxed">
            باستخدامك لمنصة Future House أو تسجيلك في أي من دوراتها، فإنك توافق على الالتزام بهذه
            الشروط والأحكام وسياسة الخصوصية الخاصة بالمنصة.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">2. الحساب والاستخدام الشخصي</h2>
          <p className="text-muted-foreground leading-relaxed">
            الحساب المسجّل مخصص للاستخدام الشخصي فقط. يُمنع مشاركة بيانات الدخول مع أشخاص آخرين أو
            محاولة الوصول غير المصرح به إلى أنظمة المنصة أو محتواها.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">3. الملكية الفكرية وحماية المحتوى</h2>
          <p className="text-muted-foreground leading-relaxed">
            جميع الفيديوهات، الدروس، الأكواد، والملفات التعليمية محمية بحقوق الملكية الفكرية لمنصة
            Future House ومدربيها. يُحظر تماماً تحميل أو تسجيل أو إعادة نشر أو توزيع أي محتوى دون إذن
            كتابي مسبق.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">4. الاشتراكات والمدفوعات</h2>
          <p className="text-muted-foreground leading-relaxed">
            يُمنح الوصول إلى الدورات المدفوعة بعد إتمام عملية الدفع وتأكيدها. تخضع أي طلبات استرداد
            أو تعديل للسياسة المعلنة لكل دورة عبر فريق الدعم.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">5. التواصل</h2>
          <p className="text-muted-foreground leading-relaxed">
            لأي استفسارات حول هذه الشروط، يمكنك مراسلتنا عبر{" "}
            <Link href="/contact" className="text-primary hover:underline">
              صفحة التواصل
            </Link>
            .
          </p>
        </section>
      </article>
    </main>
  );
}
