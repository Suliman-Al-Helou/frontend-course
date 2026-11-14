"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { Video, CheckCircle } from "lucide-react";
import api from "@/lib/api";
import CourseFilterDropdown, {
  useEnrolledCourses,
} from "@/components/dashboard/CourseFilterDropdown";

function VideosContent() {
  const { courses, selectedId, isLoading: loadingCourses, selectCourse } = useEnrolledCourses();
  const [lessons, setLessons] = useState<any[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(false);

  // جلب فيديوهات الكورس المحدد
  useEffect(() => {
    if (!selectedId) return;
    setLoadingLessons(true);
    setLessons([]);

    api
      .get(`/courses/${selectedId}`)
      .then(async (res) => {
        const fullCourse = res.data;
        const result: any[] = [];
        for (const section of fullCourse?.sections ?? []) {
          for (const lesson of section.lessons ?? []) {
            let progress = { completed: false, watched_percent: 0 };
            try {
              const p = await api.get(`/lessons/${lesson.id}/progress`);
              progress = p.data;
            } catch {}
            result.push({ ...lesson, course: fullCourse, section, progress });
          }
        }
        setLessons(result);
      })
      .finally(() => setLoadingLessons(false));
  }, [selectedId]);

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
        <div className="text-center py-16 text-muted-foreground bg-card rounded-2xl border border-border">
          <Video className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm font-medium">لا توجد دروس متاحة حالياً</p>
        </div>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson) => {
            const isCompleted = lesson.progress?.completed;
            const percent = lesson.progress?.watched_percent ?? 0;

            return (
              <div
                key={lesson.id}
                className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between gap-4 hover:border-primary/50 transition"
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
                  {percent > 0 && !isCompleted && (
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      %{percent}
                    </span>
                  )}
                  <Link
                    href={`/courses/${lesson.course?.id}/lessons/${lesson.id}`}
                    className="text-xs font-semibold px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition"
                  >
                    {isCompleted ? "مراجعة" : percent > 0 ? "متابعة" : "مشاهدة"}
                  </Link>
                </div>
              </div>
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
