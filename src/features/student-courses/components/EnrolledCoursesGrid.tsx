"use client";

import Link from "next/link";
import { BookOpen, GraduationCap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { studentCourseQueries } from "../queries/studentCourses.queries";
import { EnrolledCourseCard } from "./EnrolledCourseCard";
import type { StudentEnrollment } from "../types";

interface EnrolledCoursesGridProps {
  initialEnrollments?: StudentEnrollment[];
}

export function EnrolledCoursesGrid({ initialEnrollments }: EnrolledCoursesGridProps) {
  const {
    data: enrollments,
    isLoading,
    isError,
  } = useQuery({
    ...studentCourseQueries.enrolled(),
    select: (list) => list.filter((e) => e.status === "approved"),
    initialData: initialEnrollments,
  });

  if (isLoading) {
    return (
      <div
        role="status"
        aria-label="جارٍ تحميل الكورسات"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-2xl overflow-hidden animate-pulse h-80 flex flex-col justify-between p-5"
          >
            <div className="w-full h-40 bg-muted rounded-xl mb-4" />
            <div className="space-y-3">
              <div className="h-5 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
            <div className="h-11 bg-muted rounded-xl mt-4" />
          </div>
        ))}
        <span className="sr-only">جارٍ تحميل الكورسات المسجل بها...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <Card
        role="alert"
        className="text-center py-16 border-destructive/20 p-6"
      >
        <p className="text-destructive font-semibold mb-2">تعذر تحميل الكورسات</p>
        <p className="text-muted-foreground text-sm">يرجى المحاولة مرة أخرى لاحقاً</p>
      </Card>
    );
  }

  if (!enrollments || enrollments.length === 0) {
    return (
      <Card className="text-center py-16 p-8 max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-8 h-8" aria-hidden="true" />
        </div>
        <h2 className="text-lg font-bold text-foreground mb-2">لم تسجل في أي كورس بعد</h2>
        <p className="text-sm text-muted-foreground mb-6">
          استكشف المسارات التعليمية المتاحة وابدأ رحلتك البرمجية الاحترافية اليوم.
        </p>
        <Button asChild className="px-6">
          <Link href="/courses">
            <BookOpen className="w-4 h-4 ml-2" aria-hidden="true" />
            <span>تصفح الكورسات المتاحة</span>
          </Link>
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {enrollments.map((enrollment) => (
        <EnrolledCourseCard key={enrollment.id} enrollment={enrollment} />
      ))}
    </div>
  );
}
