'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, BookOpen, CheckCircle, Lock } from 'lucide-react';
import Image from 'next/image';
// ── Types ──────────────────────────────────────────
interface EnrolledCourse {
  id: number;
  title: string;
  image: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  currentLesson: string;
  status: 'active' | 'completed' | 'locked';
}

interface EnrolledCoursesProps {
  courses: EnrolledCourse[];
  isLoading?: boolean;
}

// ── Sub Components ─────────────────────────────────
function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full bg-muted rounded-full h-2">
      <div
        className="bg-primary h-2 rounded-full transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function StatusIcon({ status }: { status: EnrolledCourse['status'] }) {
  if (status === 'completed') return <CheckCircle className="w-5 h-5 text-green-500" />;
  if (status === 'locked')    return <Lock className="w-5 h-5 text-muted-foreground" />;
  return <Play className="w-5 h-5 text-primary" />;
}

function CourseCard({ course }: { course: EnrolledCourse }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex gap-4">
        {/* صورة الكورس */}
        <Image
          src={course.image}
          alt={course.title}
          className="w-24 h-16 rounded-xl object-cover flex-shrink-0"
        />

        {/* تفاصيل الكورس */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-2">
              {course.title}
            </h3>
            <StatusIcon status={course.status} />
          </div>

          {/* الدرس الحالي */}
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            <BookOpen className="w-3 h-3" />
            {course.currentLesson}
          </p>

          {/* Progress */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{course.completedLessons} / {course.totalLessons} درس</span>
              <span>{course.progress}%</span>
            </div>
            <ProgressBar value={course.progress} />
          </div>
        </div>
      </div>

      {/* زر المتابعة */}
      <Link
        href={`/learn/${course.id}`}
        className="mt-4 w-full flex items-center justify-center gap-2 bg-primary/10 text-primary py-2 rounded-xl text-sm font-medium hover:bg-primary/20 transition"
      >
        <Play className="w-4 h-4" />
        تابع من حيث توقفت
      </Link>
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <div key={i} className="bg-card border border-border rounded-2xl p-5 animate-pulse">
          <div className="flex gap-4">
            <div className="w-24 h-16 bg-muted rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
              <div className="h-2 bg-muted rounded w-full mt-3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Component ─────────────────────────────────
export default function EnrolledCourses({ courses = [], isLoading = false }: EnrolledCoursesProps) {
  if (isLoading) return <LoadingSkeleton />;

  if (courses.length === 0) {
    return (
      <div className="text-center py-12 bg-card rounded-2xl border border-border">
        <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground font-medium">لم تسجل في أي كورس بعد</p>
        <Link
          href="/courses"
          className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-xl text-sm hover:bg-primary/90 transition"
        >
          تصفح الكورسات
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-foreground mb-4">كورساتي</h2>
      <div className="space-y-4">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}