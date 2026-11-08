import { queryOptions } from "@tanstack/react-query";
import {
  getMyCourses,
  getLessonProgress,
  getLessonTask,
} from "../api";

export const studentCourseQueries = {
  all: () => ["student-courses"] as const,

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
};
