import { queryOptions } from "@tanstack/react-query";
import {
  getAdminCourses,
  getAdminCourseById,
  getCourseSections,
  getAdminLessonTask,
  getAdminEnrollments,
} from "../api";

export const adminCourseQueries = {
  all: () => ["admin-courses"] as const,

  // قائمة جميع الكورسات للوحة الأدمن
  list: () =>
    queryOptions({
      queryKey: [...adminCourseQueries.all(), "list"] as const,
      queryFn: getAdminCourses,
      staleTime: 1000 * 60 * 2, // 2 minutes
    }),

  // تفاصيل كورس محدد مع الأقسام والبيانات الكاملة للأدمن
  detail: (id: number | string) =>
    queryOptions({
      queryKey: [...adminCourseQueries.all(), "detail", String(id)] as const,
      queryFn: () => getAdminCourseById(id),
      staleTime: 1000 * 60 * 2,
    }),

  // أقسام كورس محدد
  sections: (courseId: number | string) =>
    queryOptions({
      queryKey: [...adminCourseQueries.all(), "sections", String(courseId)] as const,
      queryFn: () => getCourseSections(courseId),
      staleTime: 1000 * 60 * 2,
    }),

  // مهمة / أسئلة درس محدد
  task: (lessonId: number | string) =>
    queryOptions({
      queryKey: [...adminCourseQueries.all(), "task", String(lessonId)] as const,
      queryFn: () => getAdminLessonTask(lessonId),
      staleTime: 1000 * 60 * 5,
    }),
};

export const adminEnrollmentQueries = {
  all: () => ["admin-enrollments"] as const,

  // قائمة طلبات وتأكيدات التسجيل للأدمن
  list: () =>
    queryOptions({
      queryKey: [...adminEnrollmentQueries.all(), "list"] as const,
      queryFn: getAdminEnrollments,
      staleTime: 1000 * 60 * 2,
    }),
};

