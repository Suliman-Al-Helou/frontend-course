"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  Users,
  Star,
  BookOpen,
  CheckCircle,
  ArrowLeft,
  Loader2,
  X,
} from "lucide-react";
import { CourseDetail } from "../_hooks/useCourseDetail";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import Image from "next/image";
const LEVEL_LABEL: Record<string, string> = {
  beginner: "مبتدئ",
  intermediate: "متوسط",
  advanced: "متقدم",
};

interface CourseHeroProps {
  course: CourseDetail;
}

// ─── Toast ───────────────────────────────────────────────
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-foreground text-background px-5 py-3 rounded-2xl shadow-xl text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-300">
      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
      {message}
      <button
        onClick={onClose}
        className="opacity-60 hover:opacity-100 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── CTA Card ────────────────────────────────────────────
function EnrollCard({ course }: { course: CourseDetail }) {
  const token = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !course?.id) {
      setChecking(false);
      return;
    }
    api
      .get(`/courses/${course.id}/enrollment`)
      .then((res) => setEnrolled(res.data.enrolled))
      .catch(() => {})
      .finally(() => setChecking(false));
  }, [token, course?.id]);
  if (checking) {
    return (
      <div className="bg-white dark:bg-card rounded-2xl shadow-2xl p-6">
        <div className="w-full h-12 bg-muted animate-pulse rounded-xl mb-3" />
        <div className="w-3/4 h-4 bg-muted animate-pulse rounded mx-auto" />
      </div>
    );
  }
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleEnroll = async () => {
    if (!course?.id) return;

    // لو غير مسجل دخول
    if (!token) {
      showToast("يجب تسجيل الدخول أولاً للتسجيل في الكورس");
      return;
    }

    setLoading(true);
    try {
      await api.post(`/courses/${course.id}/enroll`);
      setEnrolled(true);
      showToast("✅ تم التسجيل في الكورس — قم بالدفع للحصول على الوصول الكامل");
    } catch (err: any) {
      if (err.response?.status === 409) {
        showToast("أنت مسجل في هذا الكورس مسبقاً");
        setEnrolled(true);
      } else {
        showToast("حدث خطأ، حاول مجدداً");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    setLoading(true);
    try {
      await api.delete(`/courses/${course.id}/enroll`);
      setEnrolled(false);
      showToast("تم سحب تسجيلك من الكورس");
    } catch {
      showToast("حدث خطأ، حاول مجدداً");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-card rounded-2xl shadow-2xl overflow-hidden">
        {/* صورة الكورس */}
        {course.cover_image ? (
          <div className="relative w-full h-44">
            <Image
              src={course.cover_image}
              alt={course.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-44 bg-gradient-to-br from-blue-mid/30 to-blue-light/30 flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-primary/40" />
          </div>
        )}

        <div className="p-6">
          {/* إذا مسجل دخول */}
          {!!token ? (
            <>
              {!enrolled ? (
                // زر التسجيل
                <button
                  onClick={handleEnroll}
                  disabled={loading}
                  className="w-full h-12 mb-3 inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white rounded-xl font-bold text-base transition-all"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : null}
                  سجّل الآن
                </button>
              ) : (
                // زر سحب التسجيل (لون مختلف)
                <button
                  onClick={handleWithdraw}
                  disabled={loading}
                  className="w-full h-12 mb-3 inline-flex items-center justify-center gap-2 bg-muted hover:bg-destructive/10 border-2 border-border hover:border-destructive/40 disabled:opacity-60 text-muted-foreground hover:text-destructive rounded-xl font-bold text-base transition-all"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : null}
                  سحب التسجيل
                </button>
              )}

              {enrolled && (
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-green-700 dark:text-green-400 font-medium">
                    أنت مسجّل في هذا الكورس
                  </span>
                </div>
              )}

              {!enrolled && (
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-green-700 dark:text-green-400 font-medium">
                    ضمان استرداد ٧ أيام
                  </span>
                </div>
              )}

              <p className="text-center text-xs text-muted-foreground">
                الوصول الكامل بعد التسجيل والدفع
              </p>
            </>
          ) : (
            // غير مسجل دخول
            <>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm text-green-700 font-medium">
                  ضمان استرداد ٧ أيام
                </span>
              </div>
              <Link
                href="/register"
                className="w-full h-12 mb-3 inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-base transition-colors"
              >
                سجّل وابدأ الآن
              </Link>
              <Link
                href="/login"
                className="w-full h-10 inline-flex items-center justify-center border-2 border-input rounded-xl text-sm text-foreground/80 hover:bg-blue-50 dark:hover:bg-accent/10 transition-colors"
              >
                لديك حساب؟ سجّل دخولك
              </Link>
              <p className="text-center text-xs text-muted-foreground mt-3">
                الوصول الكامل بعد التسجيل
              </p>
            </>
          )}
        </div>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  );
}

// ─── Main Component ───────────────────────────────────────
export function CourseHero({ course }: CourseHeroProps) {
  return (
    <div className="bg-gradient-to-br from-blue-deep to-blue-mid pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/courses"
          className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> الكورسات
        </Link>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Info */}
          <div className="lg:col-span-2">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white rounded-full px-3 py-1 text-xs font-medium mb-4">
              {LEVEL_LABEL[course.level] ?? course.level}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
              {course.title}
            </h1>
            <p className="text-white/80 leading-relaxed mb-6">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                {course.rating} ({course.reviews} تقييم)
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {course.students} طالب
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {Math.round(Number(course.total_duration) / 60)} ساعة
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {course.lessons} درس
              </span>
            </div>

            <p className="text-white/60 text-sm mt-3">
              المدرب:{" "}
              <span className="text-white font-medium">
                {course.instructor}
              </span>{" "}
              — {course.instructorBio}
            </p>
          </div>

          {/* CTA Card */}
          <EnrollCard course={course} />
        </div>
      </div>
    </div>
  );
}
