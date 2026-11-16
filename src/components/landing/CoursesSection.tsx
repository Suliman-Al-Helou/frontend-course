"use client";

import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useCoursesSection } from "@/components/landing/_hooks/useCoursesSection";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/features/auth";
import { CourseCard, CourseCardSkeleton, getCourseLinks } from "@/features/courses";
import { studentCourseQueries } from "@/features/student-courses";

export default function CoursesSection() {
  const { courses, loading } = useCoursesSection();
  const { isAuthenticated } = useCurrentUser();
  const { data: enrolledIds = new Set<number>() } = useQuery({
    ...studentCourseQueries.enrolled(),
    enabled: isAuthenticated,
    select: (list) =>
      new Set(list.filter((e) => e.status === "approved").map((e) => e.course?.id)),
  });

  return (
    <section
      id="courses"
      aria-labelledby="courses-section-title"
      className="scroll-mt-20 bg-background py-20 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center space-y-2">
          <h2
            id="courses-section-title"
            className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            دورات برمجية تطبيقية بالعربية
          </h2>
          <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
            ابدأ من الصفر وتعلّم مهارات هندسية حقيقية مع مدربين ذوي خبرة ميدانية.
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            [1, 2, 3].map((i) => <CourseCardSkeleton key={i} />)
          ) : courses.length > 0 ? (
            courses.map((course, index) => {
              const isEnrolled = enrolledIds.has(course.id);
              return (
                <CourseCard
                  key={course.id}
                  course={course}
                  index={index}
                  isEnrolled={isEnrolled}
                  {...getCourseLinks(course, isEnrolled, isAuthenticated)}
                />
              );
            })
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-border p-12 text-center">
              <p className="text-sm text-muted-foreground">
                لا توجد دورات تدريبية متاحة حالياً على هذه الواجهة. تفضل بزيارة الكتالوج للاطلاع على كامل المسارات.
              </p>
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <Button
            href="/courses"
            variant="outlinePrimary"
            size="lg"
            className="gap-2 font-semibold"
          >
            عرض جميع الكورسات
            <ArrowLeft className="size-4 rtl:rotate-0" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
}
