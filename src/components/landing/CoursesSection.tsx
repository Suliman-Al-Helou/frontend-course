"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Users, Star, BookOpen, ArrowLeft, Zap, Lock } from "lucide-react";
import {
  useCoursesSection,
  useLevelStyle,
  CourseCard,
} from "@/components/landing/_hooks/Usecoursessection";
import { useMyEnrolledCourses } from "@/components/landing/_hooks/UseMyEnrolledCourses";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";

interface CourseCardProps {
  course: CourseCard;
  isEnrolled: boolean;
  isAuthenticated: boolean;
  index: number;
}

function SkeletonCard() {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-muted" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-muted rounded-lg w-3/4" />
        <div className="h-3 bg-muted rounded-lg w-1/3" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-3 bg-muted rounded-lg w-24" />
          <div className="h-3 bg-muted rounded-lg w-20" />
        </div>
        <div className="h-10 bg-muted rounded-xl mt-2" />
      </div>
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3.5 h-3.5 ${
            s <= Math.round(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground/30"
          }`}
        />
      ))}
      <span className="text-xs text-muted-foreground mr-1">{rating.toFixed(1)}</span>
    </div>
  );
}

function CourseCardItem({ course, isEnrolled, isAuthenticated, index }: CourseCardProps) {
  const { color, label } = useLevelStyle(course.level);
  const durationHours = Math.round(course.total_duration / 60);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="bg-card rounded-2xl border border-border shadow-sm hover:shadow-xl transition-shadow overflow-hidden group cursor-pointer flex flex-col"
    >
      {/* Thumbnail */}
      <div className="relative w-full h-48 overflow-hidden flex-shrink-0">
        {course.cover_image ? (
          <Image
            src={course.cover_image}
            alt={course.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-muted-foreground/30" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {isAuthenticated && !isEnrolled && (
          <div className="absolute inset-0 bg-black/40 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="flex items-center gap-1.5 bg-black/70 text-white text-xs font-medium px-3 py-1.5 rounded-full">
              <Lock className="w-3 h-3" />
              يحتاج تسجيل
            </span>
          </div>
        )}

        {course.hot && (
          <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Zap className="w-3 h-3" /> الأكثر طلباً
          </div>
        )}
        <div className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full ${color}`}>
          {label}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-foreground text-base leading-snug line-clamp-2 mb-1">
          {course.title}
        </h3>
        <p className="text-xs text-muted-foreground mb-3">{course.instructor}</p>

        <div className="flex items-center justify-between mb-4">
          <StarRating rating={course.rating ?? 0} />
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {durationHours} ساعة
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {course.students_count?.toLocaleString("ar-EG")}
            </span>
          </div>
        </div>

        <div className="mt-auto">
          {isEnrolled ? (
            <Link
              href="/dashboard/courses"
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors"
            >
              متابعة التعلم
            </Link>
          ) : (
            <Link
              href={isAuthenticated ? `/courses/${course.id}` : `/register`}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors"
            >
              عرض الكورس
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function CoursesSection() {
  const { courses, loading } = useCoursesSection();
  const { isAuthenticated } = useAuthStore();
  const { courses: enrolledCourses } = useMyEnrolledCourses();
  const enrolledIds = new Set(enrolledCourses.map((c) => c.id));

  return (
    <section id="courses" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
            <BookOpen className="w-4 h-4" />
            الكورسات المتاحة
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            ابدأ مساركَ التقني
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            كل كورس مُصمَّم بعناية ليضمن فهمك العميق وتطبيقك العملي — ليس مجرد مشاهدة
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? [1, 2, 3].map((i) => <SkeletonCard key={i} />)
            : courses.map((course, index) => (
                <CourseCardItem
                  key={course.id}
                  course={course}
                  index={index}
                  isEnrolled={enrolledIds.has(course.id)}
                  isAuthenticated={isAuthenticated}
                />
              ))}
        </div>

        {/* Footer link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-primary/20 hover:border-primary text-primary hover:bg-primary/5 px-10 py-3 text-base font-medium transition-colors"
          >
            عرض جميع الكورسات
            <ArrowLeft className="w-5 h-5 mr-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}