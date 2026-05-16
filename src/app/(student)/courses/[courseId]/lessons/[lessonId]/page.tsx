"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useLessonData } from "./_hooks/useLessonData";
import { useVideoProgress } from "./_hooks/useVideoProgress";
import VideoPlayer from "./_components/VideoPlayer";
import LessonSidebar from "./_components/LessonSidebar";
import TaskSection from "./_components/TaskSection";
import type { Task } from "@/types";
import api from "@/lib/api";
import { useEffect } from "react";
export default function LessonPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;

  const { course, lesson, progress, loading, error, refetchProgress } =
    useLessonData(courseId, lessonId);

  const [videoCompleted, setVideoCompleted] = useState(false);
  const [taskPassed, setTaskPassed] = useState(false);
  const [task, setTask] = useState<Task | null>(null);
  const [loadingTask, setLoadingTask] = useState(false);

  const handleVideoComplete = useCallback(async () => {
    setVideoCompleted(true);
    refetchProgress();

    // أضف الدرس الحالي للمكتملين فوراً
    setCompletedIds((prev) => [...prev, Number(lessonId)]);

    try {
      setLoadingTask(true);
      const { lessonApi } = await import("@/lib/api");
      const res = await lessonApi.getTask(Number(lessonId));
      setTask(res.data);
    } catch {
      setTaskPassed(true);
    } finally {
      setLoadingTask(false);
    }
  }, [lessonId, refetchProgress]);

  const allLessons = course?.sections?.flatMap((s) => s.lessons) ?? [];
  const currentIdx = allLessons.findIndex((l) => l.id === Number(lessonId));
  const nextLesson = allLessons[currentIdx + 1];
  const prevLesson = allLessons[currentIdx - 1];
  const [completedIds, setCompletedIds] = useState<number[]>([]);
  useEffect(() => {
    if (!course) return;
    const allLessons = course.sections?.flatMap((s) => s.lessons) ?? [];
    Promise.all(
      allLessons.map(
        (l) =>
          api
            .get(`/lessons/${l.id}/progress`)
            .then((r) => (r.data.completed ? l.id : null))
            .catch(() => null), // 500 = مش مكتمل — تجاهل
      ),
    ).then((results) => {
      setCompletedIds(results.filter(Boolean) as number[]);
    });
  }, [course]);
  const { playerRef } = useVideoProgress({
    lessonId: Number(lessonId),
    onCompleted: handleVideoComplete,
  });

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );

  if (error || !course || !lesson)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <p className="text-muted-foreground">{error ?? "الدرس غير موجود"}</p>
        <Link
          href={`/courses/${courseId}`}
          className="text-primary hover:underline text-sm"
        >
          العودة للكورس
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href={`/courses/${courseId}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            {course.title}
          </Link>

          <div className="flex items-center gap-2">
            {prevLesson && (
              <Link
                href={`/courses/${courseId}/lessons/${prevLesson.id}`}
                className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-muted/80 transition-colors text-foreground"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                السابق
              </Link>
            )}
            {nextLesson && (taskPassed || !task) && videoCompleted && (
              <Link
                href={`/courses/${courseId}/lessons/${nextLesson.id}`}
                className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                التالي
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            )}
            
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* Video + Task */}
        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {lesson.title}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              الدرس {currentIdx + 1} من {allLessons.length}
            </p>
          </div>

          <VideoPlayer
            videoId={lesson.video_id ?? "dQw4w9WgXcQ"}
            onProgress={() => {}}
            onComplete={handleVideoComplete}
          />

          {videoCompleted && !task && !loadingTask && (
            <div className="flex items-center gap-3 p-4 bg-success/10 border border-success/20 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
              <p className="text-sm text-success font-medium">
                أكملت هذا الدرس! يمكنك الانتقال للدرس التالي.
              </p>
            </div>
          )}

          {loadingTask && (
            <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-xl">
              <Loader2 className="w-5 h-5 text-primary animate-spin flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                جاري تحميل مهمة الدرس...
              </p>
            </div>
          )}

          {task && !taskPassed && (
            <TaskSection
              task={task}
              lessonId={Number(lessonId)}
              onPassed={() => setTaskPassed(true)}
            />
          )}

          {task && taskPassed && (
            <div className="flex items-center gap-3 p-4 bg-success/10 border border-success/20 rounded-xl">
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
              <p className="text-sm text-success font-medium">
                أحسنت! اجتزت المهمة. الدرس التالي متاح الآن 🎉
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <LessonSidebar
          course={course}
          currentLessonId={Number(lessonId)}
          completedIds={completedIds}
        />
      </div>
    </div>
  );
}
