"use client";

import Link from "next/link";
import { BookOpen, GraduationCap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/states/EmptyState";
import { ErrorState } from "@/components/shared/states/ErrorState";
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
    refetch,
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
      <Card className="max-w-xl mx-auto border-destructive/20">
        <ErrorState
          message="تعذر تحميل الكورسات، يرجى المحاولة مرة أخرى لاحقاً."
          onRetry={() => refetch()}
        />
      </Card>
    );
  }

  if (!enrollments || enrollments.length === 0) {
    return (
      <Card className="max-w-xl mx-auto border-border">
        <EmptyState
          icon={GraduationCap}
          title="لم تسجل في أي كورس بعد"
          description="استكشف المسارات التعليمية المتاحة وابدأ رحلتك البرمجية الاحترافية اليوم."
        >
          <Button asChild className="px-6">
            <Link href="/courses">
              <BookOpen className="w-4 h-4 ml-2" aria-hidden="true" />
              <span>تصفح الكورسات المتاحة</span>
            </Link>
          </Button>
        </EmptyState>
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
