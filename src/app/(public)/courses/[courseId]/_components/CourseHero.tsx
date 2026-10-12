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
  Play,
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
  const [enrolled, setEnrolled] = useState(false);
  const [enrollmentStatus, setEnrollmentStatus] = useState<
    "pending" | "approved" | "rejected" | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const isFree = Number(course.price ?? 0) === 0 || Boolean(course.is_public);
  const firstLessonId =
    course.sections?.[0]?.lessons?.[0]?.id ?? course.next_lesson_id;
  const hasLessons = Boolean(firstLessonId);
  const learnHref = firstLessonId
    ? `/courses/${course.id}/lessons/${firstLessonId}`
    : null;

  useEffect(() => {
    if (!token || !course?.id) {
      setChecking(false);
      return;
    }
    api
      .get(`/courses/${course.id}/enrollment`)
      .then((res) => {
        const status =
          res.data.status ?? (res.data.enrolled ? "approved" : null);
        setEnrollmentStatus(status);
        setEnrolled(status === "approved" || !!res.data.enrolled);
      })
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

    if (!token) {
      showToast("يجب تسجيل الدخول أولاً للتسجيل في الكورس");
      return;
    }

    setLoading(true);
    try {
      await api.post(`/courses/${course.id}/enroll`);
      setEnrollmentStatus("pending");
      showToast("✅ تم إرسال طلب التسجيل — بانتظار موافقة الإدارة");
    } catch (err: any) {
      if (err.response?.status === 409) {
        showToast("أنت مسجل في هذا الكورس مسبقاً أو طلبك قيد المراجعة");
        setEnrollmentStatus("pending");
      } else {
        const msg = err.response?.data?.message || "حدث خطأ، حاول مجدداً";
        showToast(msg);
      }
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
          {/* 1. غير مسجل دخول في الموقع */}
          {!token ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm text-green-700 dark:text-green-400 font-medium">
                  {isFree ? "كورس مجاني 100%" : "ضمان استرداد ٧ أيام"}
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
                className="w-full h-10 inline-flex items-center justify-center border-2 border-input rounded-xl text-sm text-foreground/80 hover:bg-muted transition-colors"
              >
                لديك حساب؟ سجّل دخولك
              </Link>
              <p className="text-center text-xs text-muted-foreground mt-3">
                {isFree
                  ? "سجّل الدخول للمشاهدة فوراً"
                  : "الوصول الكامل بعد التسجيل والدفع"}
              </p>
            </>
          ) : isFree ? (
            /* 2. مسجل دخول والكورس مجاني: ابدأ المشاهدة فوراً */
            <>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm text-green-700 dark:text-green-400 font-medium">
                  كورس مجاني — متاح للمشاهدة
                </span>
              </div>
              {hasLessons ? (
                <Link
                  href={learnHref!}
                  className="w-full h-12 mb-3 inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-base transition-colors"
                >
                  <Play className="w-4 h-4 fill-current" />
                  ابدأ المشاهدة
                </Link>
              ) : (
                <div className="w-full h-12 mb-3 inline-flex items-center justify-center gap-2 bg-muted text-muted-foreground rounded-xl font-bold text-base cursor-not-allowed">
                  <BookOpen className="w-4 h-4" />
                  الدروس قيد الإعداد
                </div>
              )}
              <p className="text-center text-xs text-muted-foreground">
                {hasLessons ? "يمكنك مشاهدة جميع الدروس مباشرة" : "سيتم إضافة الدروس قريبًا"}
              </p>
            </>
          ) : (
            /* 3. مسجل دخول والكورس مدفوع */
            <>
              {/* حالة أ: مقبول ومسجل */}
              {enrolled || enrollmentStatus === "approved" ? (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-green-700 dark:text-green-400 font-medium">
                      أنت مسجّل في هذا الكورس ومقبول
                    </span>
                  </div>
                  {hasLessons ? (
                    <Link
                      href={learnHref!}
                      className="w-full h-12 mb-3 inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-base transition-colors"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      تابع التعلم
                    </Link>
                  ) : (
                    <div className="w-full h-12 mb-3 inline-flex items-center justify-center gap-2 bg-muted text-muted-foreground rounded-xl font-bold text-base cursor-not-allowed">
                      <BookOpen className="w-4 h-4" />
                      الدروس قيد الإعداد
                    </div>
                  )}
                </>
              ) : enrollmentStatus === "pending" ? (
                /* حالة ب: قيد المراجعة */
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400">
                    <Clock className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold">طلبك قيد المراجعة</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        تم إرسال طلبك للإدارة، وبانتظار الموافقة لتفعيل الكورس.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* حالة ج: لم يسجل بعد (أو تم رفضه) */
                <>
                  {enrollmentStatus === "rejected" && (
                    <div className="mb-3 p-2.5 bg-destructive/10 border border-destructive/20 rounded-xl text-xs text-destructive text-center">
                      تم رفض طلبك السابق، يمكنك إعادة إرسال الطلب.
                    </div>
                  )}
                  <button
                    onClick={handleEnroll}
                    disabled={loading}
                    className="w-full h-12 mb-3 inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white rounded-xl font-bold text-base transition-all"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : null}
                    {enrollmentStatus === "rejected"
                      ? "إعادة إرسال طلب التسجيل"
                      : "طلب التسجيل في الكورس"}
                  </button>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-green-700 dark:text-green-400 font-medium">
                      ضمان استرداد ٧ أيام
                    </span>
                  </div>
                  <p className="text-center text-xs text-muted-foreground">
                    الوصول الكامل بعد موافقة الإدارة والدفع
                  </p>
                </>
              )}
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
