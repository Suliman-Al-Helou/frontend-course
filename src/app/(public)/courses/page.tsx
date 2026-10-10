"use client";

// src/app/(public)/courses/page.tsx
import { useEffect, useState } from "react";
import {
  Search,
  BookOpen,
  Clock,
  Users,
  Star,
  Zap,
  Filter,
} from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import api from "@/lib/api";
import { Course } from "@/types";

import CourseCard from "@/components/courses/CourseCard";
import { SkeletonCard } from "@/components/courses/CourseCardSkeleton";
import { LEVELS, LEVEL_LABELS } from "@/components/courses/courseLevel";
import { useMyEnrolledCourses } from "@/components/landing/_hooks/UseMyEnrolledCourses";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
// Removed mock COURSE_EXTRAS object
import { getCourseLinks } from "@/components/courses/courseLinks";
// ─── Sub Components ───────────────────────────────────────
function HeroSection({
  search,
  onSearch,
}: {
  search: string;
  onSearch: (v: string) => void;
}) {
  return (
    <div className="bg-gradient-to-br from-blue-deep via-blue-mid to-blue-light pt-28 pb-16 px-4 text-center bg-primary dark:bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="inline-flex items-center gap-2 bg-white/10 text-white rounded-full px-4 py-1.5 text-sm font-medium mb-6">
          <BookOpen className="w-4 h-4" />
          جميع الكورسات
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
          اختر مسارك التقني
        </h1>
        <p className="text-white/70 text-lg mb-10">
          +60 كورس تقني عربي لكل المستويات
        </p>

        {/* Search */}
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="ابحث عن كورس أو مهارة..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-white rounded-2xl py-4 pr-12 pl-6 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-2xl"
          />
        </div>
      </motion.div>
    </div>
  );
}

function LevelFilters({
  level,
  onChange,
}: {
  level: string;
  onChange: (l: string) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2 flex-wrap py-6 px-4 border-b border-blue-50 dark:border-border">
      <Filter className="text-muted-foreground w-4 h-4 flex-shrink-0" />
      <span className="text-sm text-muted-foreground ml-1">المستوى:</span>
      {LEVELS.map((l) => (
        <Button
          variant={"outline"}
          key={l}
          onClick={() => onChange(l)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            level === l
              ? "bg-primary hover:bg-primary"
              : "bg-white dark:bg-muted border border-blue-100 dark:border-border text-foreground/70 hover:border-primary "
          }`}
        >
          {LEVEL_LABELS[l] ?? l}
        </Button>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────
export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filtered, setFiltered] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("الكل");
  const { isAuthenticated } = useAuthStore();
  const { courses: enrolled } = useMyEnrolledCourses();
  const enrolledIds = new Set(enrolled.map((c) => c.id));

  useEffect(() => {
    api
      .get("/courses")
      .then((res) => {
        const data = res.data.data ?? res.data;
        setCourses(data);
        setFiltered(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
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
    setFiltered(result);
  }, [search, level, courses]);

  return (
    <div className="min-h-screen bg-background font-arabic" dir="rtl">
      <Navbar />

      <HeroSection search={search} onSearch={setSearch} />
      <LevelFilters level={level} onChange={setLevel} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Count */}
        {!loading && (
          <p className="text-sm text-muted-foreground mb-6">
            {filtered.length} كورس
          </p>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <BookOpen className="w-14 h-14 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">لا توجد كورسات تطابق بحثك</p>
            <p className="text-sm mt-1">جرب كلمة بحث مختلفة أو غيّر الفلتر</p>
          </div>
        )}

        {/* Grid */}
        {!loading && filtered.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
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
      </div>

      <Footer />
    </div>
  );
}
