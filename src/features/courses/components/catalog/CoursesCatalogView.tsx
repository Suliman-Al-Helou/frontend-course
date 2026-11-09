"use client";

import { useState, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { studentCourseQueries } from "@/features/student-courses";
import { useAuthStore } from "@/store/authStore";
import { courseQueries } from "../../queries/courses.queries";
import CourseCard from "../CourseCard";
import { SkeletonCard } from "../CourseCardSkeleton";
import { CoursesHero } from "./CoursesHero";
import { CourseLevelFilters } from "./CourseLevelFilters";
import { CoursesEmptyState } from "./CoursesEmptyState";
import { getCourseLinks } from "../../utils/courseLinks";

export default function CoursesCatalogView() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("الكل");
  const { isAuthenticated } = useAuthStore();

  const { data: enrolledIds = new Set<number>() } = useQuery({
    ...studentCourseQueries.enrolled(),
    enabled: isAuthenticated,
    select: (list) =>
      new Set(list.filter((e) => e.status === "approved").map((e) => e.course?.id)),
  });

  const shouldReduceMotion = useReducedMotion();

  const {
    data: courses = [],
    isLoading,
    isError,
    refetch,
  } = useQuery(courseQueries.list());

  const filtered = useMemo(() => {
    let result = courses;
    if (level !== "الكل") result = result.filter((c) => c.level === level);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [courses, level, search]);

  const handleResetFilters = () => {
    setSearch("");
    setLevel("الكل");
  };

  return (
    <div className="min-h-screen bg-background font-arabic" dir="rtl">
      <Navbar />

      <CoursesHero
        search={search}
        onSearch={setSearch}
        totalCourses={courses.length || 60}
      />

      <CourseLevelFilters level={level} onChange={setLevel} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Error State */}
        {isError && (
          <div role="alert" className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-medium text-destructive mb-3">
              تعذر تحميل الكورسات
            </p>
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="min-h-[44px] px-6"
            >
              إعادة المحاولة
            </Button>
          </div>
        )}

        {/* Count */}
        {!isLoading && !isError && (
          <p className="text-sm text-muted-foreground mb-6" aria-live="polite">
            {filtered.length} كورس متاح
          </p>
        )}

        {/* Loading Skeleton */}
        {isLoading && (
          <div
            aria-busy="true"
            aria-label="جاري تحميل الكورسات"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && filtered.length === 0 && (
          <CoursesEmptyState
            search={search}
            level={level}
            onReset={handleResetFilters}
          />
        )}

        {/* Catalog Grid */}
        {!isLoading && !isError && filtered.length > 0 && (
          <motion.div
            initial={shouldReduceMotion ? false : "hidden"}
            animate={shouldReduceMotion ? undefined : "visible"}
            variants={{
              visible: { transition: { staggerChildren: 0.06 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((course, i) => {
              const isEnrolled = enrolledIds.has(course.id);
              return (
                <CourseCard
                  key={course.id}
                  course={course}
                  index={i}
                  isEnrolled={isEnrolled}
                  {...getCourseLinks(course, isEnrolled, isAuthenticated)}
                />
              );
            })}
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}

