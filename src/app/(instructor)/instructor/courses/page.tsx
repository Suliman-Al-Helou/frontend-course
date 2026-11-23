import React from "react";
import Link from "next/link";
import { BookOpen, LifeBuoy } from "lucide-react";
import { InstructorCourseList } from "@/features/instructor-portal";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "كورساتي الموكلة | Future House Academy",
  description: "إدارة المقررات الدراسية الموكلة للهيئة التدريسية بالأكاديمية",
};

export default function InstructorCoursesPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300 motion-reduce:animate-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/60 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
            <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
            <span>الهيئة التدريسية</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">كورساتي الموكلة</h1>
          <p className="text-sm text-muted-foreground">
            المقررات الدراسية الموكلة إليك لإدارتها وتطوير محتواها التعليمي ودروسها ومهامها.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild variant="outline" className="min-h-[44px] gap-2 border-border">
            <Link href="/instructor/support">
              <LifeBuoy className="w-4 h-4" aria-hidden="true" />
              <span>طلب إسناد مقرر</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Course List */}
      <section aria-label="قائمة الكورسات الموكلة">
        <InstructorCourseList />
      </section>
    </div>
  );
}
