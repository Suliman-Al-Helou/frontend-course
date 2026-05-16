"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { CourseHero } from "./_components/CourseHero";
import { CourseCurriculum } from "./_components/CourseCurriculum";
import { CourseOutcomes } from "./_components/CourseOutcomes";
import { useCourseDetail } from "./_hooks/useCourseDetail";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params?.courseId as string;
  const { course, loading, error } = useCourseDetail(Number(courseId));
  const { isAuthenticated } = useAuthStore();
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !courseId) return;
    api.get(`/courses/${courseId}/enrollment`)
      .then(res => setEnrolled(res.data.status === 'approved'))
      .catch(() => {});
  }, [isAuthenticated, courseId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
    </div>
  );

  if (error || !course) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
      <p className="text-muted-foreground">{error ?? "الكورس غير موجود"}</p>
      <Link href="/courses" className="text-primary hover:underline text-sm">
        العودة للكورسات
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-background font-arabic" dir="rtl">
      <Navbar />
      <CourseHero course={course} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <CourseOutcomes
              outcomes={course.what_you_learn ?? []}
              requirements={course.requirements ?? []}
              target={course.target_audience ?? []}
            />
            <CourseCurriculum
              sections={course.sections}
              courseId={courseId}
              enrolled={enrolled}
            />
          </div>
        </div>

        {/* Bottom CTA — يختفي لو مسجل ومقبول */}
        {!enrolled && (
          <div className="mt-16 bg-gradient-to-br from-primary to-primary/70 rounded-3xl p-8 sm:p-12 text-center">
            <h3 className="text-2xl font-bold text-white mb-3">مستعد تبدأ؟</h3>
            <p className="text-white/70 mb-6">
              سجّل الآن وابدأ الكورس فوراً — الوصول الكامل بعد التسجيل
            </p>
            <Link
              href={isAuthenticated ? `/courses/${courseId}/enroll` : "/register"}
              className="inline-flex items-center justify-center bg-white text-primary hover:bg-white/90 rounded-xl px-10 py-3 font-bold transition-colors"
            >
              سجّل وابدأ الآن
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}