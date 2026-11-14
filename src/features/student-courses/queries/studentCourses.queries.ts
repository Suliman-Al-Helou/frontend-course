import { queryOptions } from "@tanstack/react-query";
import {
  getMyCourses,
  getLesson,
  getLessonProgress,
  getLessonTask,
  getInProgressLessons,
  getCourseProgressSummary,
} from "../api";
import type { InProgressLesson, LessonDetail } from "../types";

export const studentCourseQueries = {
  all: () => ["student-courses"] as const,

  // تفاصيل درس محدد مع رابط/معرّف الفيديو المحمي
  lesson: (lessonId: number | string) =>
    queryOptions({
      queryKey: [...studentCourseQueries.all(), "lesson", String(lessonId)] as const,
      queryFn: (): Promise<LessonDetail> => getLesson(lessonId),
      staleTime: 1000 * 60 * 5, // 5 minutes cache
    }),

  // قائمة الكورسات المسجل بها الطالب
  enrolled: () =>
    queryOptions({
      queryKey: [...studentCourseQueries.all(), "enrolled"] as const,
      queryFn: getMyCourses,
      staleTime: 1000 * 60 * 5, // 5 minutes fresh in cache
    }),

  // تقدم درس محدد
  lessonProgress: (lessonId: number | string) =>
    queryOptions({
      queryKey: [...studentCourseQueries.all(), "progress", String(lessonId)] as const,
      queryFn: () => getLessonProgress(lessonId),
      staleTime: 1000 * 60 * 2, // 2 minutes
    }),

  // مهمة درس محدد
  lessonTask: (lessonId: number | string) =>
    queryOptions({
      queryKey: [...studentCourseQueries.all(), "task", String(lessonId)] as const,
      queryFn: () => getLessonTask(lessonId),
      staleTime: 1000 * 60 * 10, // 10 minutes
    }),

  // معرفات الدروس المكتملة في الكورس عبر مسار التلخيص المجمّع
  completedLessons: (courseId: number | string, _lessonIds?: number[]) =>
    queryOptions({
      queryKey: [
        ...studentCourseQueries.all(),
        "completed-lessons",
        String(courseId),
      ] as const,
      queryFn: async (): Promise<number[]> => {
        try {
          const summary = await getCourseProgressSummary(courseId);
          return summary.completed_lesson_ids ?? [];
        } catch {
          return [];
        }
      },
      staleTime: 1000 * 60 * 5, // 5 minutes cache
    }),

  // الدروس الجاري تعلمها بطلب مفرد ومجمّع من الباك إند
  inProgressLessons: () =>
    queryOptions({
      queryKey: [...studentCourseQueries.all(), "in-progress-lessons"] as const,
      queryFn: (): Promise<InProgressLesson[]> => getInProgressLessons(),
      staleTime: 1000 * 60 * 2, // 2 minutes
    }),
};
