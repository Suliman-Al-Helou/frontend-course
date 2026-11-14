"use client";

import { useMemo } from "react";
import { Users, DollarSign, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { adminCourseQueries, adminEnrollmentQueries } from "../../queries/adminCourses.queries";
import type { AdminCourse, CourseLevel } from "../../types";

const LEVEL_LABELS: Record<CourseLevel, string> = {
  beginner: "مبتدئ",
  intermediate: "متوسط",
  advanced: "متقدم",
};

export default function CoursesPriceOverview() {
  const { data: courses = [], isLoading } = useQuery(adminCourseQueries.list());
  const { data: enrollments = [] } = useQuery(adminEnrollmentQueries.list());

  const approvedCounts = useMemo(() => {
    const map = new Map<number, number>();
    for (const e of enrollments) {
      if (e.status === "approved") {
        map.set(e.course_id, (map.get(e.course_id) || 0) + 1);
      }
    }
    return map;
  }, [enrollments]);

  return (
    <Card className="shadow-xs overflow-hidden">
      <CardHeader className="border-b border-border p-5 sm:p-6">
        <CardTitle>نظرة عامة على الكورسات والأسعار</CardTitle>
        <CardDescription>إحصائيات فورية مشتقة من كاش المنصة مباشرة</CardDescription>
      </CardHeader>

      <div className="divide-y divide-border">
        {isLoading ? (
          <div className="py-12 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : courses.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-xs">
            <BookOpen className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            لا توجد أي بيانات كورسات حالياً.
          </div>
        ) : (
          courses.map((course: AdminCourse) => {
            const students = approvedCounts.get(course.id) ?? course.students_count ?? 0;
            const isFree = !course.price || course.price === 0 || course.is_public;

            return (
              <div
                key={course.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:px-6 hover:bg-muted/20 transition-colors"
              >
                <div>
                  <p className="font-semibold text-foreground text-sm leading-snug">
                    {course.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {LEVEL_LABELS[course.level] ?? course.level}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                  <Badge variant="primary" shape="rounded">
                    <Users className="w-3.5 h-3.5" />
                    {students} طالب
                  </Badge>
                  <Badge variant={isFree ? "info" : "success"} shape="rounded">
                    <DollarSign className="w-3.5 h-3.5" />
                    {isFree ? "مجاني" : `${course.price}$`}
                  </Badge>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
