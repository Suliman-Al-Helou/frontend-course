"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  CheckCircle,
  BookOpen,
  Loader2,
  X,
  Play,
} from "lucide-react";
import type { CourseDetail } from "../../index";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";

export interface EnrollCardProps {
  course: CourseDetail;
  isEnrolled?: boolean;
  enrollmentStatus?: "pending" | "approved" | "rejected" | null;
  onEnrollSuccess?: () => void;
}

// ─── Accessible Feedback Toast ──────────────────────────────
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-foreground text-background px-5 py-3 rounded-2xl shadow-xl text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
      <span>{message}</span>
      <button
        onClick={onClose}
        aria-label="إغلاق التنبيه"
        className="opacity-70 hover:opacity-100 transition-opacity p-2 -m-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Decomposed Enroll Card ─────────────────────────────────
export function EnrollCard({
  course,
  isEnrolled = false,
  enrollmentStatus = null,
  onEnrollSuccess,
}: EnrollCardProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isSubmittingRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const isFree = Number(course.price ?? 0) === 0 || Boolean(course.is_public);
  const firstLessonId = course.sections?.[0]?.lessons?.[0]?.id ?? course.next_lesson_id;
  const hasLessons = Boolean(firstLessonId);
  const learnHref = firstLessonId ? `/courses/${course.id}/lessons/${firstLessonId}` : null;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const handleEnroll = async () => {
    if (!course?.id) return;
    if (isSubmittingRef.current || loading) return;

    if (!isAuthenticated) {
      showToast("يجب تسجيل الدخول أولاً للتسجيل في الكورس");
      return;
    }

    isSubmittingRef.current = true;
    setLoading(true);
    try {
      await api.post(`/courses/${course.id}/enroll`);
      showToast("✅ تم إرسال طلب التسجيل — بانتظار موافقة الإدارة");
      onEnrollSuccess?.();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: { message?: string } } };
      if (axiosErr.response?.status === 409) {
        showToast("أنت مسجل في هذا الكورس مسبقاً أو طلبك قيد المراجعة");
        onEnrollSuccess?.();
      } else {
        const msg = axiosErr.response?.data?.message || "حدث خطأ، حاول مجدداً";
        showToast(msg);
      }
    } finally {
      isSubmittingRef.current = false;
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-card rounded-2xl border border-border shadow-2xl overflow-hidden">
        {/* Course Cover */}
        {course.cover_image ? (
          <div className="relative w-full h-44 bg-muted">
            <Image
              src={course.cover_image}
              alt={course.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-44 bg-muted/60 flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-muted-foreground/40" />
          </div>
        )}

        <div className="p-6">
          {/* 1. غير مسجل دخول في الموقع */}
          {!isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                <span className="text-sm text-success font-medium">
                  {isFree ? "كورس مجاني 100%" : "ضمان استرداد ٧ أيام"}
                </span>
              </div>
              <Link
                href="/register"
                className="w-full min-h-[44px] mb-3 inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold text-base transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                سجّل وابدأ الآن
              </Link>
              <Link
                href="/login"
                className="w-full min-h-[44px] inline-flex items-center justify-center border border-border rounded-xl text-sm text-foreground/80 hover:bg-muted transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                لديك حساب؟ سجّل دخولك
              </Link>
              <p className="text-center text-xs text-muted-foreground mt-3">
                {isFree ? "سجّل الدخول للمشاهدة فوراً" : "الوصول الكامل بعد التسجيل والدفع"}
              </p>
            </>
          ) : isFree ? (
            /* 2. مسجل دخول والكورس مجاني: ابدأ المشاهدة فوراً */
            <>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                <span className="text-sm text-success font-medium">
                  كورس مجاني — متاح للمشاهدة
                </span>
              </div>
              {hasLessons ? (
                <Link
                  href={learnHref!}
                  className="w-full min-h-[44px] mb-3 inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold text-base transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <Play className="w-4 h-4 fill-current" />
                  ابدأ المشاهدة
                </Link>
              ) : (
                <div className="w-full min-h-[44px] mb-3 inline-flex items-center justify-center gap-2 bg-muted text-muted-foreground rounded-xl font-bold text-base cursor-not-allowed">
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
              {isEnrolled || enrollmentStatus === "approved" ? (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-sm text-success font-medium">
                      أنت مسجّل في هذا الكورس ومقبول
                    </span>
                  </div>
                  {hasLessons ? (
                    <Link
                      href={learnHref!}
                      className="w-full min-h-[44px] mb-3 inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold text-base transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      تابع التعلم
                    </Link>
                  ) : (
                    <div className="w-full min-h-[44px] mb-3 inline-flex items-center justify-center gap-2 bg-muted text-muted-foreground rounded-xl font-bold text-base cursor-not-allowed">
                      <BookOpen className="w-4 h-4" />
                      الدروس قيد الإعداد
                    </div>
                  )}
                </>
              ) : enrollmentStatus === "pending" ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-warning/10 border border-warning/20 rounded-xl text-warning">
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
                <>
                  {enrollmentStatus === "rejected" && (
                    <div className="mb-3 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-xs text-destructive text-center">
                      تم رفض طلبك السابق، يمكنك إعادة إرسال الطلب.
                    </div>
                  )}
                  <button
                    onClick={handleEnroll}
                    disabled={loading}
                    className="w-full min-h-[44px] mb-3 inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60 text-primary-foreground rounded-xl font-bold text-base transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none cursor-pointer"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {enrollmentStatus === "rejected"
                      ? "إعادة إرسال طلب التسجيل"
                      : "طلب التسجيل في الكورس"}
                  </button>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-sm text-success font-medium">
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

