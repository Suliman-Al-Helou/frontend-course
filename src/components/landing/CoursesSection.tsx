"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useCoursesSection } from "@/components/landing/_hooks/Usecoursessection";
import { studentCourseQueries } from "@/features/student-courses";
import { useCurrentUser } from "@/features/auth";
import { CourseCard, SkeletonCard, getCourseLinks } from "@/features/courses";

export default function CoursesSection() {
  const { courses, loading } = useCoursesSection();
  const { isAuthenticated } = useCurrentUser();
  const { data: enrolledIds = new Set<number>() } = useQuery({
    ...studentCourseQueries.enrolled(),
    enabled: isAuthenticated,
    select: (list) => new Set(list.filter((e) => e.status === "approved").map((e) => e.course?.id)),
  });

  return (
    <section id="courses" className="scroll-mt-20 bg-background py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header: نفس الكود الحالي بدون تغيير */}
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 text-center">
          كورسات برمجة مجانية بالعربية {/* TODO: translate */}
        </h2>
        <p className="text-muted-foreground text-md max-w-2xl mx-auto text-center mb-5">
          ابدأ من الصفر وتعلّم مهارات تطبيقية مع مدربين ذوي خبرة. {/* TODO: translate */}
        </p>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {loading
            ? [1, 2, 3].map((i) => <SkeletonCard key={i} />)
            : courses.map((course, index) => {
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
              })}
        </div>

        {/* زر الانتقال لكتالوج الكورسات الكامل لعرض وتصفح باقي الكورسات */}
        <div className="text-center mt-12">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-xl border border-primary/30 hover:border-primary text-primary hover:bg-primary/5 px-8 py-3 text-base font-medium transition-colors"
          >
            عرض جميع الكورسات
            <ArrowLeft className="w-5 h-5 ms-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
