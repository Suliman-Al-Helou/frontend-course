"use client";

import Link from "next/link";
import { Play, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { studentCourseQueries } from "@/features/student-courses";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/states/EmptyState";
import { ErrorState } from "@/components/shared/states/ErrorState";

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
        <Card className="max-w-lg mx-auto border-destructive/20">
          <ErrorState
            message="حدث خطأ أثناء جلب قائمة الدروس، يرجى المحاولة ثانية."
            onRetry={() => refetch()}
          />
        </Card>
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
        <Card className="max-w-xl mx-auto border-border">
          <EmptyState
            icon={Play}
            title="لا توجد دروس قيد المتابعة حالياً"
            description="لقد أكملت جميع الدروس التي بدأتها! يمكنك استكشاف كورساتك والبدء في درس جديد."
          >
            <Button asChild className="px-6">
              <Link href="/dashboard/courses">
                <BookOpen className="w-4 h-4 me-2" aria-hidden="true" />
                <span>الذهاب إلى كورساتي</span>
              </Link>
            </Button>
          </EmptyState>
        </Card>
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
          <Card key={lesson.id} interactive className="p-0 overflow-hidden">
            <Link
              href={`/courses/${lesson.course.id}/lessons/${lesson.id}`}
              className="min-h-[44px] flex items-center gap-4 p-4 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
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
          </Card>
        ))}
      </div>
    </div>
  );
}
