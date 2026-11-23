"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Loader2, CheckCircle2, Lock } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/shared/states/ErrorState";
import { courseQueries } from "@/features/courses";
import {
  studentCourseQueries,
  saveLessonProgress,
  enrollInCourse,
  VideoPlayer,
  LessonSidebar,
  TaskSection,
} from "@/features/student-courses";

export default function LessonPage() {
  const params = useParams();
  const queryClient = useQueryClient();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;
  const numericLessonId = Number(lessonId);

  // 1. استعلام تفاصيل الكورس والأقسام
  const {
    data: course,
    isLoading: courseLoading,
    isError: courseError,
  } = useQuery(courseQueries.detail(courseId));

  // 1.1 استعلام بيانات الدرس المحمي ومصدر الفيديو المصرح به
  const {
    data: lessonDetail,
    isLoading: lessonLoading,
    isError: lessonError,
    error: lessonErrorObj,
  } = useQuery({
    ...studentCourseQueries.lesson(numericLessonId),
    enabled: Boolean(numericLessonId),
  });

  // 2. استعلام تقدم الدرس الحالي
  const { data: progressData } = useQuery(studentCourseQueries.lessonProgress(numericLessonId));

  // 3. استعلام مهمة الدرس الحالي إن وجدت
  const { data: task, isLoading: taskLoading } = useQuery(
    studentCourseQueries.lessonTask(numericLessonId),
  );

  // 4. استخراج جميع الدروس وتحديد الدرس الحالي والسابق والتالي
  const allLessons = useMemo(() => course?.sections?.flatMap((s) => s.lessons) ?? [], [course]);

  const allLessonIds = useMemo(() => allLessons.map((l) => l.id), [allLessons]);

  const currentIdx = allLessons.findIndex((l) => l.id === numericLessonId);
  const currentLesson = allLessons[currentIdx];
  const nextLesson = allLessons[currentIdx + 1];
  const prevLesson = allLessons[currentIdx - 1];

  // 5. استعلام الدروس المكتملة عبر الكاش الموحد
  const { data: cachedCompletedIds = [] } = useQuery({
    ...studentCourseQueries.completedLessons(courseId, allLessonIds),
    enabled: allLessonIds.length > 0,
  });

  const [localCompletedIds, setLocalCompletedIds] = useState<number[]>([]);

  const completedIds = useMemo(
    () => Array.from(new Set([...cachedCompletedIds, ...localCompletedIds])),
    [cachedCompletedIds, localCompletedIds],
  );

  // حالة إتمام الفيديو واجتياز المهمة للدرس الحالي
  const isInitiallyCompleted = progressData?.completed || completedIds.includes(numericLessonId);

  const [videoCompleted, setVideoCompleted] = useState<boolean>(false);
  const [taskPassed, setTaskPassed] = useState<boolean>(false);

  const isVideoDone = isInitiallyCompleted || videoCompleted;
  const isTaskDone = isInitiallyCompleted || taskPassed || !task;

  // تسجيل تلقائي صامت للكورسات المجانية عند دخول الدرس
  const hasAutoEnrolledRef = useRef(false);
  useEffect(() => {
    if (!course || hasAutoEnrolledRef.current) return;
    const isFree = Number(course.price ?? 0) === 0 || Boolean(course.is_public);
    if (isFree && course.id) {
      hasAutoEnrolledRef.current = true;
      enrollInCourse(course.id)
        .then(() => {
          void queryClient.invalidateQueries({
            queryKey: studentCourseQueries.enrolled().queryKey,
          });
        })
        .catch(() => {});
    }
  }, [course, queryClient]);

  // معالجة إتمام الفيديو وحفظ التقدم في السيرفر والكاش
  const handleVideoComplete = useCallback(async () => {
    setVideoCompleted(true);
    setLocalCompletedIds((prev) => [...prev, numericLessonId]);

    try {
      await saveLessonProgress(numericLessonId, {
        watched_percent: 100,
        last_position: 0,
      });

      // إبطال كاش تقدم الدرس لتحديث الواجهة فوراً
      void queryClient.invalidateQueries({
        queryKey: studentCourseQueries.lessonProgress(numericLessonId).queryKey,
      });
      void queryClient.invalidateQueries({
        queryKey: studentCourseQueries.lesson(numericLessonId).queryKey,
      });
      void queryClient.invalidateQueries({
        queryKey: [...studentCourseQueries.all(), "completed-lessons", String(courseId)],
      });
      void queryClient.invalidateQueries({
        queryKey: studentCourseQueries.enrolled().queryKey,
      });
    } catch {
      // حفظ صامت في حالة عدم توفر الاتصال
    }
  }, [numericLessonId, courseId, queryClient]);

  const hasInvalidatedEnrolledOnProgressRef = useRef(false);
  const handleVideoProgress = useCallback(
    (percent: number, position: number) => {
      saveLessonProgress(numericLessonId, {
        watched_percent: percent,
        last_position: position,
      })
        .then(() => {
          if (!hasInvalidatedEnrolledOnProgressRef.current) {
            hasInvalidatedEnrolledOnProgressRef.current = true;
            void queryClient.invalidateQueries({
              queryKey: studentCourseQueries.enrolled().queryKey,
            });
          }
        })
        .catch(() => {});
    },
    [numericLessonId, queryClient],
  );

  // شاشة التحميل الأولية
  if (courseLoading || lessonLoading) {
    return (
      <div
        role="status"
        aria-label="جارٍ تحميل بيانات الدرس"
        className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground"
      >
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" aria-hidden="true" />
        <span className="text-sm text-muted-foreground">جارٍ تحميل محتوى الدرس...</span>
      </div>
    );
  }

  // شاشة الخطأ في حال عدم وجود الكورس أو الدرس أو عدم امتلاك الصلاحية
  if (courseError || lessonError || !course || !currentLesson) {
    const isForbidden =
      (lessonErrorObj as { response?: { status?: number } })?.response?.status === 403;
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <ErrorState
          fullPage
          message={
            isForbidden
              ? "لا تملك صلاحية مشاهدة هذا الدرس. يرجى الاشتراك في الكورس أو التأكد من إكمال الدروس السابقة أولاً."
              : "تعذر العثور على بيانات هذا الدرس. تأكد من صحة الرابط أو عُد لصفحة الكورس."
          }
        >
          <Button asChild>
            <Link href={`/courses/${courseId}`}>
              {isForbidden ? "العودة لصفحة الكورس للاشتراك" : "العودة للكورس"}
            </Link>
          </Button>
        </ErrorState>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground" dir="rtl">
      {/* الشريط العلوي الثابت */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link
            href={`/courses/${courseId}`}
            className="min-h-[44px] inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowRight className="w-4 h-4 rtl:rotate-0" aria-hidden="true" />
            <span className="truncate max-w-[200px] sm:max-w-md">{course.title}</span>
          </Link>

          <nav aria-label="التنقل بين الدروس" className="flex items-center gap-2">
            {prevLesson && (
              <Button variant="outline" size="sm" asChild className="gap-1.5">
                <Link href={`/courses/${courseId}/lessons/${prevLesson.id}`}>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>السابق</span>
                </Link>
              </Button>
            )}

            {nextLesson &&
              (isVideoDone && isTaskDone ? (
                <Button size="sm" asChild className="gap-1.5">
                  <Link href={`/courses/${courseId}/lessons/${nextLesson.id}`}>
                    <span>التالي</span>
                    <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled
                  title="أكمل مشاهدة الدرس واجتز مهمته لفتح الدرس التالي"
                  className="gap-1.5 text-xs sm:text-sm font-semibold cursor-not-allowed opacity-60"
                  aria-label="الدرس التالي مغلق حتى إكمال الدرس الحالي"
                >
                  <span>التالي</span>
                  <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                </Button>
              ))}
          </nav>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-6">
        {/* منطقة الفيديو والمهام */}
        <div className="flex-1 min-w-0 space-y-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-snug">
              {currentLesson.title}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5">
              الدرس {currentIdx + 1} من {allLessons.length}
            </p>
          </div>

          {/* مشغل الفيديو المحصن */}
          <VideoPlayer
            key={numericLessonId}
            playback={lessonDetail?.playback ?? currentLesson?.playback ?? null}
            videoId={lessonDetail?.video_id || currentLesson?.video_id || ""}
            onProgress={handleVideoProgress}
            onComplete={handleVideoComplete}
            onTokenExpired={() => {
              void queryClient.invalidateQueries({
                queryKey: studentCourseQueries.lesson(numericLessonId).queryKey,
              });
            }}
          />

          {/* شريط تأكيد إكمال الدرس */}
          {isVideoDone && !task && !taskLoading && (
            <div
              role="alert"
              className="flex items-center gap-3 p-4 bg-success/10 border border-success/30 rounded-2xl text-success"
            >
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              <p className="text-sm font-semibold">
                أحسنت! لقد أكملت مشاهدة هذا الدرس، يمكنك الآن الانتقال للدرس التالي.
              </p>
            </div>
          )}

          {/* مؤشر تحميل المهمة */}
          {taskLoading && (
            <div className="flex items-center gap-3 p-4 bg-muted rounded-2xl">
              <Loader2
                className="w-5 h-5 text-primary animate-spin flex-shrink-0"
                aria-hidden="true"
              />
              <p className="text-sm text-muted-foreground">جارٍ تحميل المهمة التطبيقية للدرس...</p>
            </div>
          )}

          {/* نموذج المهمة إن وجد ولم يجتزه الطالب بعد */}
          {task && !isTaskDone && (
            <TaskSection
              task={task}
              lessonId={numericLessonId}
              onPassed={() => setTaskPassed(true)}
            />
          )}

          {/* شريط تأكيد اجتياز المهمة */}
          {task && isTaskDone && (
            <div
              role="alert"
              className="flex items-center gap-3 p-4 bg-success/10 border border-success/30 rounded-2xl text-success"
            >
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              <p className="text-sm font-semibold">
                ممتاز! لقد اجتزت المهمة بنجاح، وأصبح الدرس التالي متاحاً للمتابعة.
              </p>
            </div>
          )}
        </div>

        {/* الشريط الجانبي لفهرس الدروس */}
        <LessonSidebar
          courseId={courseId}
          courseTitle={course.title}
          sections={course.sections ?? []}
          currentLessonId={numericLessonId}
          completedIds={completedIds}
        />
      </main>
    </div>
  );
}
