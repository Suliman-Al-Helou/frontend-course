"use client";

import { useMemo, Suspense } from "react";
import Link from "next/link";
import { Video, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/states/EmptyState";
import { courseQueries } from "@/features/courses";
import {
  studentCourseQueries,
  CourseFilterDropdown,
  useEnrolledCourses,
} from "@/features/student-courses";

function VideosContent() {
  const { courses, selectedId, isLoading: loadingCourses, selectCourse } = useEnrolledCourses();

  const { data: course, isLoading: loadingCourse } = useQuery({
    ...courseQueries.detail(String(selectedId)),
    enabled: Boolean(selectedId),
  });

  const { data: summary, isLoading: loadingSummary } = useQuery({
    ...studentCourseQueries.courseSummary(String(selectedId)),
    enabled: Boolean(selectedId),
  });

  const loadingLessons = Boolean(selectedId) && (loadingCourse || loadingSummary);

  const lessons = useMemo(() => {
    if (!course?.sections) return [];
    const completedSet = new Set(summary?.completed_lesson_ids ?? []);

    return course.sections.flatMap((section) =>
      (section.lessons ?? []).map((lesson) => ({
        ...lesson,
        course,
        section,
        isCompleted: completedSet.has(lesson.id),
      })),
    );
  }, [course, summary]);

  if (loadingCourses)
    return (
      <div className="animate-pulse space-y-3">
        <div className="bg-card rounded-2xl h-12 border border-border" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-card rounded-2xl h-16 border border-border" />
        ))}
      </div>
    );

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">الفيديوهات</h1>

      {/* Course Dropdown */}
      <CourseFilterDropdown courses={courses} selectedId={selectedId} onSelect={selectCourse} />

      {loadingLessons ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card rounded-2xl h-20 border border-border animate-pulse" />
          ))}
        </div>
      ) : lessons.length === 0 ? (
        <Card className="rounded-2xl border-border">
          <EmptyState
            icon={Video}
            title="لا توجد دروس متاحة حالياً"
            description="لم يتم العثور على أي دروس منشورة لهذا الكورس حتى الآن."
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson) => {
            const isCompleted = lesson.isCompleted;

            return (
              <Card
                key={lesson.id}
                className="rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isCompleted
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Video className="w-5 h-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground truncate">
                      {lesson.section?.title}
                    </p>
                    <p className="text-sm font-semibold text-foreground truncate">{lesson.title}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <Button
                    asChild
                    size="sm"
                    variant={isCompleted ? "outline" : "default"}
                    className="font-semibold shadow-xs"
                  >
                    <Link href={`/courses/${lesson.course?.id}/lessons/${lesson.id}`}>
                      {isCompleted ? "مراجعة" : "مشاهدة"}
                    </Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function VideosPage() {
  return (
    <Suspense
      fallback={
        <div className="animate-pulse space-y-3">
          <div className="bg-card rounded-2xl h-12 border border-border" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card rounded-2xl h-16 border border-border" />
          ))}
        </div>
      }
    >
      <VideosContent />
    </Suspense>
  );
}
