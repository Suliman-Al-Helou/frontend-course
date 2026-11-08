"use client";

import Link from "next/link";
import { Clock, Users, Star, BookOpen, ArrowLeft } from "lucide-react";
import type { CourseDetail } from "../../index";
import { EnrollCard } from "./EnrollCard";

const LEVEL_LABEL: Record<string, string> = {
  beginner: "مبتدئ",
  intermediate: "متوسط",
  advanced: "متقدم",
};

export interface CourseHeroProps {
  course: CourseDetail;
  isEnrolled?: boolean;
  enrollmentStatus?: "pending" | "approved" | "rejected" | null;
  onEnrollSuccess?: () => void;
}

export function CourseHero({
  course,
  isEnrolled,
  enrollmentStatus,
  onEnrollSuccess,
}: CourseHeroProps) {
  const durationHours = Math.round(Number(course.total_duration || 0) / 60);

  return (
    <header className="bg-gradient-to-br from-blue-deep to-blue-mid pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-6 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none rounded-lg p-1 -m-1"
        >
          <ArrowLeft className="w-4 h-4" /> الكورسات
        </Link>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Main Info */}
          <div className="lg:col-span-2">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white rounded-full px-3 py-1 text-xs font-medium mb-4">
              {LEVEL_LABEL[course.level] ?? course.level}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
              {course.title}
            </h1>
            <p className="text-white/80 leading-relaxed mb-6">{course.description}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {course.rating} ({course.reviews} تقييم)
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                {course.students} طالب
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {durationHours} ساعة
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                {course.lessons} درس
              </span>
            </div>

            <p className="text-white/60 text-sm mt-3">
              المدرب: <span className="text-white font-medium">{course.instructor}</span>
            </p>
          </div>

          {/* Decomposed CTA Card */}
          <EnrollCard
            course={course}
            isEnrolled={isEnrolled}
            enrollmentStatus={enrollmentStatus}
            onEnrollSuccess={onEnrollSuccess}
          />
        </div>
      </div>
    </header>
  );
}
