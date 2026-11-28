import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "سياسة الخصوصية | Future House",
  description: "سياسة الخصوصية وحماية البيانات الشخصية في منصة Future House التعليمية.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground py-16 px-4 sm:px-6 lg:px-8">
      <article className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-3 border-b border-border pb-6">
          <h1 className="text-3xl font-bold tracking-tight">سياسة الخصوصية</h1>
          <p className="text-sm text-muted-foreground">آخر تحديث: نوفمبر 2026</p>
        </header>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">1. البيانات التي نجمعها</h2>
          <p className="text-muted-foreground leading-relaxed">
            نجمع البيانات الأساسية اللازمة لتقديم خدماتنا التعليمية، وتشمل: الاسم، البريد الإلكتروني،
            ومعلومات الحساب عند التسجيل المباشر أو عبر Google OAuth، بالإضافة إلى بيانات التقدم في
            الدروس والمهام التعليمية.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">2. كيفية استخدام البيانات</h2>
          <p className="text-muted-foreground leading-relaxed">
            نستخدم بياناتك لإدارة حسابك، تمكينك من الوصول إلى الدورات المسجّل بها، حفظ تقدمك التعليمي،
            التواصل معك بشأن التحديثات أو الدعم الفني، وحماية المنصة من الاستخدام غير المصرح به.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">3. ملفات تعريف الارتباط (Cookies)</h2>
          <p className="text-muted-foreground leading-relaxed">
            تستخدم المنصة ملفات تعريف ارتباط آمنة (HttpOnly Cookies) لحفظ جلسة تسجيل الدخول وتفضيلات
            المظهر، ولا نستخدمها لبيع بياناتك أو مشاركتها مع أطراف إعلانية خارجية.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">4. حماية البيانات ومشاركتها</h2>
          <p className="text-muted-foreground leading-relaxed">
            نلتزم بحماية بياناتك باستخدام تقنيات التشفير وضوابط الوصول المناسبة. لا نبيع أو نؤجر
            بياناتك الشخصية لأي طرف ثالث، ولا نشاركها إلا بالقدر اللازم لتشغيل خدمات الدفع أو المصادقة
            أو الامتثال للمتطلبات القانونية.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">5. حقوقك والتواصل معنا</h2>
          <p className="text-muted-foreground leading-relaxed">
            يحق لك طلب الاطلاع على بياناتك أو تعديلها أو حذف حسابك في أي وقت عبر{" "}
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
