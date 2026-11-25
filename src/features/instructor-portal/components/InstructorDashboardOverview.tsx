"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { instructorPortalQueries } from "../queries/instructor-portal.queries";
import { calculateInstructorStats } from "../utils/stats";
import { InstructorQuickStats } from "./InstructorQuickStats";
import { InstructorCourseCard } from "./InstructorCourseCard";
import {
  InstructorPortalSkeletonGrid,
  InstructorPortalErrorCard,
  InstructorPortalEmptyState,
} from "./InstructorPortalFeedback";

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
          <InstructorPortalSkeletonGrid count={3} />
        </div>
      </div>
    );
  }

  // 2. Error State
  if (isError) {
    return (
      <InstructorPortalErrorCard
        title="تعذّر جلب بيانات اللوحة الأكاديمية"
        message="حدث خطأ أثناء محاولة الاتصال بالخادم لجلب المقررات. يرجى المحاولة مرة ثانية."
        onRetry={() => refetch()}
        isRetrying={isFetching}
      />
    );
  }

  // 3. Empty State (Compliant with US 17 & DESIGN.md)
  if (!stats.hasCourses) {
    return (
      <InstructorPortalEmptyState
        title="لم يتم تعيين مقررات دراسية لحسابك بعد"
        description="أهلاً بك في الهيئة التدريسية للأكاديمية. يتم إسناد المقررات الدراسية من قِبل إدارة المنصة. فور تكليفك بأي مقرر ستتمكن من تعديل المنهج والدروس والمهام مباشرة من هذه اللوحة."
      />
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
