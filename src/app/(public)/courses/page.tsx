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
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import api from "@/lib/api";
import { Course } from "@/types";
import Image from "next/image";
// ─── Constants ───────────────────────────────────────────
const LEVELS = ["الكل", "beginner", "intermediate", "advanced"] as const;

const LEVEL_LABELS: Record<string, string> = {
  beginner: "مبتدئ",
  intermediate: "متوسط",
  advanced: "متقدم",
};

const LEVEL_COLORS: Record<string, string> = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-blue-100 text-blue-700",
  advanced: "bg-purple-100 text-purple-700",
};

// Removed mock COURSE_EXTRAS object

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// ─── Sub Components ───────────────────────────────────────
function HeroSection({
  search,
  onSearch,
}: {
  search: string;
  onSearch: (v: string) => void;
}) {
  return (
    <div className="bg-gradient-to-br from-blue-deep via-blue-mid to-blue-light pt-28 pb-16 px-4 text-center">
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
        <button
          key={l}
          onClick={() => onChange(l)}
className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
  level === l
    ? 'bg-primary text-white shadow-md shadow-primary/30 dark:shadow-primary/20'
    : 'bg-white dark:bg-muted border border-blue-100 dark:border-border text-foreground/70 hover:border-primary hover:text-primary'
}`}
        >
          {LEVEL_LABELS[l] ?? l}
        </button>
      ))}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-blue-100 animate-pulse">
      <div className="h-48 bg-blue-50" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-blue-50 rounded w-3/4" />
        <div className="h-3 bg-blue-50 rounded w-full" />
        <div className="h-3 bg-blue-50 rounded w-2/3" />
        <div className="h-10 bg-blue-50 rounded-xl mt-4" />
      </div>
    </div>
  );
}

function CourseCard({ course, index }: { course: Course; index: number }) {
  const level = LEVEL_LABELS[course.level ?? ""] ?? course.level;
  const color = LEVEL_COLORS[course.level ?? ""] ?? "bg-gray-100 text-gray-600";
  const hours = course.total_duration
    ? Math.round(Number(course.total_duration) / 60)
    : null;

  // Use values from API, with fallbacks if needed
  const instructor = (course as any).instructor ?? "";
  const rating = (course as any).rating;
  const students = (course as any).students_count;
  const hot = (course as any).hot;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white dark:bg-card rounded-2xl overflow-hidden border border-blue-100 dark:border-border shadow-sm hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-black/30 transition-shadow group flex flex-col"
    >
      {/* Cover */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
        {course.cover_image ? (
          <Image
            src={course.cover_image}
            alt={course.title}
            width={400}
            height={225}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <BookOpen className="w-16 h-16 text-blue-200" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-deep/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Hot badge */}
        {hot && (
          <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Zap className="w-3 h-3" /> الأكثر طلباً
          </div>
        )}

        {/* Level badge */}
        {course.level && (
          <span
            className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${color}`}
          >
            {level}
          </span>
        )}

        {/* Lock — يحتاج تسجيل */}
        <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          يحتاج تسجيل
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-blue-deep dark:text-foreground text-base mb-1 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
          {course.title}
        </h3>

        {instructor && (
          <p className="text-sm text-muted-foreground mb-3">{instructor}</p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-6 text-xs text-muted-foreground mb-4">
          {rating ? (
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              {rating}
            </span>
          ) : null}
          {students ? (
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-blue-light" />
              {students}
            </span>
          ) : null}
          {hours && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-light" />
              {hours} ساعة
            </span>
          )}
        </div>

        {/* CTA */}
        <Link
          href={`/courses/${course.id}`}
          className="mt-auto w-full inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors"
        >
          عرض الكورس
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────
export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filtered, setFiltered] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("الكل");

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
            {filtered.map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} />
            ))}
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}
