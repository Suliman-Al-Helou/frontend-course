import React from "react";
import Link from "next/link";
import { BookOpen, Users, GraduationCap, ArrowLeft, LifeBuoy, Sparkles } from "lucide-react";
import { getIronSessionData } from "@/lib/session";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function InstructorDashboardPage() {
  const session = await getIronSessionData();
  const userName = session.user?.name ?? "المدرب";

  // في هذه المرحلة (Phase 5 - Shell & Contracts)، نقوم بتمثيل الحالة النموذجية والأولية
  // ويتم تفعيل جلب الكورسات الحية الموكلة في المرحلة 6 (Phase 6 - Assigned Courses & Syllabus CRUD)
  const assignedCoursesCount = 0;
  const totalStudentsCount = 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-primary/15 via-primary/5 to-transparent border border-primary/20 p-6 sm:p-8">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>بوابة الهيئة التدريسية المعتمدة</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
            مرحباً بك، {userName} 👋
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            من هنا يمكنك إدارة وتطوير المحتوى التعليمي للمقررات الموكلة إليك، ومتابعة تفاعل الطلاب،
            وبناء المهام التفاعلية.
          </p>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">الكورسات الموكلة</span>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <BookOpen className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{assignedCoursesCount}</p>
          <p className="text-xs text-muted-foreground">مقررات تدريبية نشطة</p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">إجمالي الطلاب</span>
            <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center text-success">
              <Users className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalStudentsCount}</p>
          <p className="text-xs text-muted-foreground">طالب مسجل في دوراتك</p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border space-y-2 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">حالة الحساب</span>
            <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center text-warning">
              <GraduationCap className="w-4 h-4" aria-hidden="true" />
            </div>
          </div>
          <p className="text-lg font-bold text-foreground">نشط ومعتمد</p>
          <p className="text-xs text-muted-foreground">صلاحيات مدرب معتمد</p>
        </div>
      </div>

      {/* Main Section: Assigned Courses / Empty State */}
      <section className="space-y-4" aria-label="الكورسات الموكلة">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-foreground">الكورسات الموكلة إليك</h2>
          <Link
            href="/instructor/courses"
            className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors inline-flex items-center gap-1 min-h-[44px]"
          >
            <span>عرض الكل</span>
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>

        {/* Empty State adhering to DESIGN.md */}
        <div
          role="region"
          aria-label="حالة عدم وجود كورسات موكلة"
          className="rounded-2xl border border-dashed border-border bg-card/50 p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-4"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <BookOpen className="w-7 h-7" aria-hidden="true" />
          </div>
          <div className="max-w-md space-y-1.5">
            <h3 className="text-base font-bold text-foreground">
              لم يتم تعيين مقررات دراسية لحسابك بعد
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              أهلاً بك في الهيئة التدريسية للأكاديمية. يتم إسناد المقررات الدراسية من قِبل إدارة المنصة.
              يمكنك التواصل مع الدعم الفني أو مراجعة الإدارة للبدء في رفع محتواك.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Button asChild variant="outline" className="min-h-[44px] gap-2 border-border">
              <Link href="/instructor/support">
                <LifeBuoy className="w-4 h-4" aria-hidden="true" />
                <span>تواصل مع الإدارة والدعم</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
