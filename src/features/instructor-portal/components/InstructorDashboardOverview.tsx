"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { BookOpen, LifeBuoy, AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { instructorPortalQueries } from "../queries/instructor-portal.queries";
import { calculateInstructorStats } from "../utils/stats";
import { InstructorQuickStats } from "./InstructorQuickStats";
import { InstructorCourseCard } from "./InstructorCourseCard";

export function InstructorDashboardOverview() {
  const {
    data: courses = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery(instructorPortalQueries.courses());

  const stats = useMemo(() => calculateInstructorStats(courses), [courses]);

  // 1. Loading State (Skeletons preventing CLS)
  if (isLoading) {
    return (
      <div
        role="status"
        aria-label="جاري تحميل بيانات لوحة التحكم"
        className="space-y-8 animate-pulse"
      >
        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((key) => (
            <div
              key={key}
              className="h-28 rounded-2xl border border-border bg-card/40 p-5 space-y-3"
            >
              <div className="h-4 w-1/3 rounded bg-muted/60" />
              <div className="h-8 w-1/2 rounded bg-muted/80" />
            </div>
          ))}
        </div>

        {/* Courses Grid Skeleton */}
        <div className="space-y-4">
          <div className="h-6 w-48 rounded bg-muted/60" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((key) => (
              <div key={key} className="rounded-2xl border border-border bg-card/40 p-4 space-y-4">
                <div className="aspect-video w-full rounded-xl bg-muted/60" />
                <div className="space-y-2">
                  <div className="h-4 w-3/4 rounded bg-muted/60" />
                  <div className="h-3 w-full rounded bg-muted/40" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. Error State
  if (isError) {
    return (
      <Card className="p-8 text-center border-destructive/20 bg-destructive/5 space-y-4">
        <div className="w-12 h-12 rounded-full bg-destructive/15 text-destructive flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-foreground">تعذّر جلب بيانات اللوحة الأكاديمية</h3>
          <p className="text-sm text-muted-foreground">
            حدث خطأ أثناء محاولة الاتصال بالخادم لجلب المقررات. يرجى المحاولة مرة ثانية.
          </p>
        </div>
        <Button
          onClick={() => refetch()}
          disabled={isFetching}
          variant="outline"
          className="min-h-[44px] gap-2 border-border"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
          <span>إعادة المحاولة</span>
        </Button>
      </Card>
    );
  }

  // 3. Empty State (Compliant with US 17 & DESIGN.md)
  if (!stats.hasCourses) {
    return (
      <div
        role="region"
        aria-label="حالة عدم وجود كورسات موكلة"
        className="rounded-2xl border border-dashed border-border bg-card/40 p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-4 animate-in fade-in duration-300 motion-reduce:animate-none"
      >
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          <BookOpen className="w-8 h-8" aria-hidden="true" />
        </div>
        <div className="max-w-md space-y-2">
          <h3 className="text-lg font-bold text-foreground">
            لم يتم تعيين مقررات دراسية لحسابك بعد
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            أهلاً بك في الهيئة التدريسية للأكاديمية. يتم إسناد المقررات الدراسية من قِبل إدارة المنصة.
            فور تكليفك بأي مقرر ستتمكن من تعديل المنهج والدروس والمهام مباشرة من هذه اللوحة.
          </p>
        </div>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Button asChild variant="outline" className="min-h-[44px] gap-2 border-border">
            <Link href="/instructor/support">
              <LifeBuoy className="w-4 h-4" aria-hidden="true" />
              <span>تواصل مع الإدارة للإسناد والدعم</span>
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // 4. Dynamic Dashboard: Stats KPIs + Recent Courses
  return (
    <div className="space-y-8 animate-in fade-in duration-300 motion-reduce:animate-none">
      {/* Quick Statistics Cards */}
      <InstructorQuickStats stats={stats} />

      {/* Recent Assigned Courses Grid */}
      <section className="space-y-4" aria-label="أحدث المقررات الموكلة">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-foreground">
              المقررات الموكلة إليك
            </h2>
            <p className="text-xs text-muted-foreground">
              عرض أحدث المقررات المكلف بإدارتها وتطوير محتواها
            </p>
          </div>
          <Link
            href="/instructor/courses"
            className="text-xs font-bold text-primary hover:text-primary-hover transition-colors inline-flex items-center gap-1 min-h-[44px]"
          >
            <span>عرض كل المقررات ({stats.assignedCoursesCount})</span>
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.recentCourses.map((course) => (
            <InstructorCourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
}
