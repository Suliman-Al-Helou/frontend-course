"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, LifeBuoy, AlertCircle, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { instructorPortalQueries } from "../queries/instructor-portal.queries";
import { InstructorCourseCard } from "./InstructorCourseCard";

export function InstructorCourseList() {
  const {
    data: courses = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery(instructorPortalQueries.courses());

  // 1. Loading State (Skeletons preventing CLS)
  if (isLoading) {
    return (
      <div
        role="status"
        aria-label="جاري تحميل الكورسات الموكلة"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {[1, 2, 3].map((key) => (
          <div
            key={key}
            className="rounded-2xl border border-border bg-card/40 p-4 space-y-4 animate-pulse"
          >
            <div className="aspect-video w-full rounded-xl bg-muted/60" />
            <div className="space-y-2">
              <div className="h-4 w-3/4 rounded bg-muted/60" />
              <div className="h-3 w-full rounded bg-muted/40" />
            </div>
            <div className="h-10 w-full rounded-xl bg-muted/40" />
          </div>
        ))}
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
          <h3 className="font-bold text-foreground">تعذّر جلب قائمة الكورسات</h3>
          <p className="text-sm text-muted-foreground">
            حدث خطأ أثناء محاولة الاتصال بالخادم. يرجى المحاولة مرة ثانية.
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
  if (courses.length === 0) {
    return (
      <div
        role="region"
        aria-label="حالة عدم وجود كورسات موكلة"
        className="rounded-2xl border border-dashed border-border bg-card/40 p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-4"
      >
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          <BookOpen className="w-8 h-8" aria-hidden="true" />
        </div>
        <div className="max-w-md space-y-2">
          <h3 className="text-lg font-bold text-foreground">لا توجد كورسات موكلة لحسابك حالياً</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            يتم إسناد المقررات الدراسية إلى المدربين من قِبل إدارة الأكاديمية. فور تعيين مقرر لك،
            سيظهر هنا لتتمكن من إدارة محتواه التعليمي ودروسه ومهامه التفاعلية.
          </p>
        </div>
        <div className="pt-2">
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

  // 4. Populated State Grid
  return (
    <div
      role="region"
      aria-label="قائمة الكورسات الموكلة"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {courses.map((course) => (
        <InstructorCourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
