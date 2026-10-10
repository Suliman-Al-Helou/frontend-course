"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, ArrowLeft } from "lucide-react";
import { useCoursesSection } from "@/components/landing/_hooks/Usecoursessection";
import { useMyEnrolledCourses } from "@/components/landing/_hooks/UseMyEnrolledCourses";
import { useAuthStore } from "@/store/authStore";
import CourseCard from "@/components/courses/CourseCard";
import { SkeletonCard } from "@/components/courses/CourseCardSkeleton";
import { getCourseLinks } from "../courses/courseLinks";

export default function CoursesSection() {
  const { courses, loading } = useCoursesSection();
  const { isAuthenticated } = useAuthStore();
  const { courses: enrolledCourses } = useMyEnrolledCourses();
  const enrolledIds = new Set(enrolledCourses.map((c) => c.id));

  return (
    <section id="courses" className="scroll-mt-20 bg-background py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header: نفس الكود الحالي بدون تغيير */}
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-2 text-center">
          كورسات برمجة مجانية بالعربية {/* TODO: translate */}
        </h2>
        <p className="text-muted-foreground text-md max-w-2xl mx-auto text-center mb-5">
          ابدأ من الصفر وتعلّم مهارات تطبيقية مع مدربين ذوي خبرة.{" "}
          {/* TODO: translate */}
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

        {/* Footer link: نفس الكود الحالي، مع تغيير mr-2 إلى ms-2 */}
      </div>
    </section>
  );
}
