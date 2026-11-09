"use client";

import { useMemo } from "react";
import { Users, DollarSign, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
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
    <div className="bg-card border border-border rounded-2xl shadow-xs overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-border">
        <h2 className="text-base sm:text-lg font-bold text-foreground">
          نظرة عامة على الكورسات والأسعار
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          إحصائيات فورية مشتقة من كاش المنصة مباشرة
        </p>
      </div>

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
                  <span className="flex items-center gap-1.5 text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full text-xs font-semibold">
                    <Users className="w-3.5 h-3.5" />
                    {students} طالب
                  </span>
                  <span
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      isFree
                        ? "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20"
                        : "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                    }`}
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    {isFree ? "مجاني" : `${course.price}$`}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

