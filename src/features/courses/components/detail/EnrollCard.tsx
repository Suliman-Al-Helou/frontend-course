"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Clock, CheckCircle, BookOpen, Play } from "lucide-react";
import type { CourseDetail } from "../../index";
import { useCurrentUser } from "@/features/auth";
import { useQueryClient } from "@tanstack/react-query";
import { studentCourseQueries } from "@/features/student-courses";
import api from "@/lib/api";
import { notify } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export interface EnrollCardProps {
  course: CourseDetail;
  isEnrolled?: boolean;
  enrollmentStatus?: "pending" | "approved" | "rejected" | null;
  onEnrollSuccess?: () => void;
}

// ─── Decomposed Enroll Card ─────────────────────────────────
export function EnrollCard({
  course,
  isEnrolled = false,
  enrollmentStatus = null,
  onEnrollSuccess,
}: EnrollCardProps) {
  const { isAuthenticated } = useCurrentUser();
  const queryClient = useQueryClient();
  const isSubmittingRef = useRef(false);
  const [loading, setLoading] = useState(false);

  const isFree = Number(course.price ?? 0) === 0 || Boolean(course.is_public);
  const firstLessonId = course.sections?.[0]?.lessons?.[0]?.id ?? course.next_lesson_id;
  const hasLessons = Boolean(firstLessonId);
  const learnHref = firstLessonId ? `/courses/${course.id}/lessons/${firstLessonId}` : null;

  const handleFreeStartLearning = () => {
    if (course.id && !isEnrolled && isAuthenticated) {
      api
        .post(`/courses/${course.id}/enroll`)
        .then(() => {
          onEnrollSuccess?.();
          void queryClient.invalidateQueries({
            queryKey: studentCourseQueries.enrolled().queryKey,
          });
        })
        .catch(() => {});
    }
  };

  const handleEnroll = async () => {
    if (!course?.id) return;
    if (isSubmittingRef.current || loading) return;

    if (!isAuthenticated) {
      notify.info("يجب تسجيل الدخول أولاً للتسجيل في الكورس");
      return;
    }

    isSubmittingRef.current = true;
    setLoading(true);
    try {
      await api.post(`/courses/${course.id}/enroll`);
      notify.success("تم إرسال طلب التسجيل — بانتظار موافقة الإدارة");
      onEnrollSuccess?.();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: { message?: string } } };
      if (axiosErr.response?.status === 409) {
        notify.info("أنت مسجل في هذا الكورس مسبقاً أو طلبك قيد المراجعة");
        onEnrollSuccess?.();
      } else {
        const msg = axiosErr.response?.data?.message || "حدث خطأ، حاول مجدداً";
        notify.error(msg);
      }
    } finally {
      isSubmittingRef.current = false;
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-2xl overflow-hidden border-border bg-card">
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

      <CardContent className="p-6">
        {/* 1. غير مسجل دخول في الموقع */}
        {!isAuthenticated ? (
          <>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
              <span className="text-sm text-success font-medium">
                {isFree ? "كورس مجاني 100%" : "ضمان استرداد ٧ أيام"}
              </span>
            </div>
            <Button href="/register" className="w-full mb-3">
              سجّل وابدأ الآن
            </Button>
            <Button href="/login" variant="outline" className="w-full">
              لديك حساب؟ سجّل دخولك
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-3">
              {isFree ? "سجّل الدخول للمشاهدة فوراً" : "الوصول الكامل بعد التسجيل والدفع"}
            </p>
          </>
        ) : isFree ? (
          /* 2. مسجل دخول والكورس مجاني: ابدأ المشاهدة فوراً */
          <>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
              <span className="text-sm text-success font-medium">كورس مجاني — متاح للمشاهدة</span>
            </div>
            {hasLessons ? (
              <Button
                href={learnHref!}
                onClick={handleFreeStartLearning}
                className="w-full mb-3"
              >
                <Play className="w-4 h-4 fill-current" />
                {isEnrolled ? "تابع التعلم" : "ابدأ المشاهدة"}
              </Button>
            ) : (
              <Button disabled variant="secondary" className="w-full mb-3">
                <BookOpen className="w-4 h-4" />
                الدروس قيد الإعداد
              </Button>
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
                  <Button href={learnHref!} className="w-full mb-3">
                    <Play className="w-4 h-4 fill-current" />
                    تابع التعلم
                  </Button>
                ) : (
                  <Button disabled variant="secondary" className="w-full mb-3">
                    <BookOpen className="w-4 h-4" />
                    الدروس قيد الإعداد
                  </Button>
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
                <Button
                  onClick={handleEnroll}
                  loading={loading}
                  className="w-full mb-3"
                >
                  {enrollmentStatus === "rejected"
                    ? "إعادة إرسال طلب التسجيل"
                    : "طلب التسجيل في الكورس"}
                </Button>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                  <span className="text-sm text-success font-medium">ضمان استرداد ٧ أيام</span>
                </div>
                <p className="text-center text-xs text-muted-foreground">
                  الوصول الكامل بعد موافقة الإدارة والدفع
                </p>
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
