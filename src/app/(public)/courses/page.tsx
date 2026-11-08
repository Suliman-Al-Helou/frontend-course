"use client";

import { useState, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { useMyEnrolledCourses } from "@/components/landing/_hooks/UseMyEnrolledCourses";
import { useAuthStore } from "@/store/authStore";

import {
  courseQueries,
  CourseCard,
  SkeletonCard,
  CoursesHero,
  CourseLevelFilters,
  CoursesEmptyState,
  getCourseLinks,
} from "@/features/courses";

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("الكل");
  const { isAuthenticated } = useAuthStore();
  const { courses: enrolled } = useMyEnrolledCourses();
  const enrolledIds = new Set(enrolled.map((c) => c.id));
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
          c.description?.toLowerCase().includes(q),
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
          <div
            role="alert"
            className="text-center py-16 text-muted-foreground"
          >
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
