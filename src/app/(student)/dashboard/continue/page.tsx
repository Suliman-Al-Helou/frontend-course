"use client";

import Link from "next/link";
import { Play, BookOpen, AlertCircle, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { studentCourseQueries } from "@/features/student-courses";

export default function ContinuePage() {
  const {
    data: lessons = [],
    isLoading,
    isError,
    refetch,
  } = useQuery(studentCourseQueries.inProgressLessons());

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">تابع التعلم</h1>
          <p className="text-sm text-muted-foreground mt-1">
            الدروس التي بدأت بمشاهدتها ولم تكملها بعد
          </p>
        </div>
        <div role="status" aria-label="جارٍ تحميل الدروس الجاري تعلمها" className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-2xl h-20 p-4 animate-pulse flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-xl bg-muted shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-3 bg-muted rounded w-1/4" />
              </div>
              <div className="w-10 h-4 bg-muted rounded shrink-0" />
            </div>
          ))}
          <span className="sr-only">جارٍ تحميل الدروس...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">تابع التعلم</h1>
          <p className="text-sm text-muted-foreground mt-1">
            الدروس التي بدأت بمشاهدتها ولم تكملها بعد
          </p>
        </div>
        <div
          role="alert"
          className="bg-card border border-destructive/20 rounded-2xl p-8 text-center max-w-lg mx-auto"
        >
          <div className="w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-6 h-6" aria-hidden="true" />
          </div>
          <h2 className="text-base font-semibold text-foreground mb-1">تعذر تحميل تقدم الدروس</h2>
          <p className="text-sm text-muted-foreground mb-4">
            حدث خطأ أثناء جلب قائمة الدروس، يرجى المحاولة ثانية.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-semibold text-sm transition"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            <span>إعادة المحاولة</span>
          </button>
        </div>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">تابع التعلم</h1>
          <p className="text-sm text-muted-foreground mt-1">
            الدروس التي بدأت بمشاهدتها ولم تكملها بعد
          </p>
        </div>
        <div className="text-center py-16 bg-card border border-border rounded-2xl p-8 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
            <Play className="w-8 h-8 fill-current" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-bold text-foreground mb-2">لا توجد دروس قيد المتابعة حالياً</h2>
          <p className="text-sm text-muted-foreground mb-6">
            لقد أكملت جميع الدروس التي بدأتها! يمكنك استكشاف كورساتك والبدء في درس جديد.
          </p>
          <Link
            href="/dashboard/courses"
            className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
          >
            <BookOpen className="w-4 h-4 me-2" aria-hidden="true" />
            <span>الذهاب إلى كورساتي</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">تابع التعلم</h1>
        <p className="text-sm text-muted-foreground mt-1">
          لديك {lessons.length}{" "}
          {lessons.length === 1
            ? "درس"
            : lessons.length === 2
              ? "درسان"
              : lessons.length <= 10
                ? "دروس"
                : "درساً"}{" "}
          قيد المتابعة
        </p>
      </div>

      <div className="space-y-3">
        {lessons.map((lesson) => (
          <Link
            key={lesson.id}
            href={`/courses/${lesson.course.id}/lessons/${lesson.id}`}
            className="min-h-[44px] flex items-center gap-4 bg-card p-4 rounded-2xl hover:border-primary/40 hover:shadow-md transition duration-200 border border-border group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 motion-reduce:transition-none"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center shrink-0 transition-colors">
              <Play className="w-5 h-5 text-primary fill-current" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate text-sm sm:text-base leading-snug">
                {lesson.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1 mb-2 truncate">
                {lesson.course.title} — {lesson.section.title}
              </p>
              <div
                role="progressbar"
                aria-valuenow={lesson.watched_percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`نسبة تقدم درس ${lesson.title}`}
                className="w-full bg-muted rounded-full h-1.5 overflow-hidden"
              >
                <div
                  className="bg-primary h-1.5 rounded-full transition-all duration-300 motion-reduce:transition-none"
                  style={{ width: `${lesson.watched_percent}%` }}
                />
              </div>
            </div>
            <span className="text-xs font-mono font-semibold tabular-nums text-primary shrink-0 ms-2">
              {lesson.watched_percent}%
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
