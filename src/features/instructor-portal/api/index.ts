/**
 * Instructor Portal Pure API Layer
 * Pure Axios client functions calling backend /api/instructor/* endpoints
 */

import api from "@/lib/api";
import type {
  InstructorCourse,
  InstructorCoursesResponse,
  InstructorSection,
  InstructorLesson,
  InstructorTask,
  CourseYouTubeVideosResponse,
  InstructorCourseStudent,
  InstructorCourseStudentsResponse,
} from "../types";

/**
 * جلب الكورسات الموكلة للمدرب الحالي
 */
export async function getInstructorCourses(): Promise<InstructorCourse[]> {
  const { data } = await api.get<InstructorCoursesResponse | InstructorCourse[]>(
    "/instructor/courses",
  );

  if (Array.isArray(data)) {
    return data;
  }

  if (data && typeof data === "object") {
    if (Array.isArray(data.data)) {
      return data.data;
    }
    if (Array.isArray(data.courses)) {
      return data.courses;
    }
  }

  return [];
}

/**
 * جلب تفاصيل كورس معين للمدرب
 */
export async function getInstructorCourse(courseId: number | string): Promise<InstructorCourse> {
  const { data } = await api.get<InstructorCourse | { data: InstructorCourse }>(
    `/instructor/courses/${courseId}`,
  );

  if (data && typeof data === "object" && "data" in data && data.data) {
    return data.data;
  }

  return data as InstructorCourse;
}

/**
 * تحديث البيانات التعليمية للكورس
 */
export async function updateInstructorCourse(
  courseId: number | string,
  payload: Partial<InstructorCourse> | FormData,
): Promise<InstructorCourse> {
  const { data } =
    typeof FormData !== "undefined" && payload instanceof FormData
      ? await api.put<InstructorCourse | { data: InstructorCourse }>(
          `/instructor/courses/${courseId}`,
          payload,
          { headers: { "Content-Type": "multipart/form-data" } },
        )
      : await api.put<InstructorCourse | { data: InstructorCourse }>(
          `/instructor/courses/${courseId}`,
          payload,
        );

  if (data && typeof data === "object" && "data" in data && data.data) {
    return data.data;
  }

  return data as InstructorCourse;
}

/**
 * جلب أقسام الكورس ودروسها
 */
export async function getInstructorSections(
  courseId: number | string,
): Promise<InstructorSection[]> {
  const { data } = await api.get<InstructorSection[] | { data: InstructorSection[] }>(
    `/instructor/courses/${courseId}/sections`,
  );

  if (Array.isArray(data)) {
    return data;
  }

  if (data && typeof data === "object" && Array.isArray(data.data)) {
    return data.data;
  }

  return [];
}

/**
 * إنشاء قسم جديد داخل الكورس
 */
export async function createInstructorSection(
  courseId: number | string,
  payload: { title: string; order?: number },
): Promise<InstructorSection> {
  const { data } = await api.post<InstructorSection | { data: InstructorSection }>(
    `/instructor/courses/${courseId}/sections`,
    payload,
  );

  if (data && typeof data === "object" && "data" in data && data.data) {
    return data.data;
  }

  return data as InstructorSection;
}

/**
 * تحديث عنوان أو ترتيب القسم
 */
export async function updateInstructorSection(
  sectionId: number | string,
  payload: { title?: string; order?: number },
): Promise<InstructorSection> {
  const { data } = await api.put<InstructorSection | { data: InstructorSection }>(
    `/instructor/sections/${sectionId}`,
    payload,
  );

  if (data && typeof data === "object" && "data" in data && data.data) {
    return data.data;
  }

  return data as InstructorSection;
}

/**
 * حذف قسم
 */
export async function deleteInstructorSection(
  sectionId: number | string,
): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(`/instructor/sections/${sectionId}`);
  return data;
}

/**
 * إنشاء درس جديد داخل قسم
 */
export async function createInstructorLesson(
  sectionId: number | string,
  payload: Partial<InstructorLesson>,
): Promise<InstructorLesson> {
  const { data } = await api.post<InstructorLesson | { data: InstructorLesson }>(
    `/instructor/sections/${sectionId}/lessons`,
    payload,
  );

  if (data && typeof data === "object" && "data" in data && data.data) {
    return data.data;
  }

  return data as InstructorLesson;
}

/**
 * تحديث بيانات درس
 */
export async function updateInstructorLesson(
  lessonId: number | string,
  payload: Partial<InstructorLesson>,
): Promise<InstructorLesson> {
  const { data } = await api.put<InstructorLesson | { data: InstructorLesson }>(
    `/instructor/lessons/${lessonId}`,
    payload,
  );

  if (data && typeof data === "object" && "data" in data && data.data) {
    return data.data;
  }

  return data as InstructorLesson;
}

/**
 * حذف درس
 */
export async function deleteInstructorLesson(
  lessonId: number | string,
): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(`/instructor/lessons/${lessonId}`);
  return data;
}

/**
 * جلب مهمة الدرس
 */
export async function getInstructorLessonTask(lessonId: number | string): Promise<InstructorTask> {
  const { data } = await api.get<InstructorTask | { data: InstructorTask }>(
    `/instructor/lessons/${lessonId}/task`,
  );

  if (data && typeof data === "object" && "data" in data && data.data) {
    return data.data;
  }

  return data as InstructorTask;
}

/**
 * إنشاء أو تحديث مهمة الدرس
 */
export async function saveInstructorLessonTask(
  lessonId: number | string,
  payload: Partial<InstructorTask>,
): Promise<InstructorTask> {
  const { data } = await api.post<InstructorTask | { data: InstructorTask }>(
    `/instructor/lessons/${lessonId}/task`,
    payload,
  );

  if (data && typeof data === "object" && "data" in data && data.data) {
    return data.data;
  }

  return data as InstructorTask;
}

/**
 * حذف مهمة الدرس
 */
export async function deleteInstructorLessonTask(
  lessonId: number | string,
): Promise<{ message: string }> {
  const { data } = await api.delete<{ message: string }>(`/instructor/lessons/${lessonId}/task`);
  return data;
}

/**
 * جلب فيديوهات قائمة تشغيل الكورس على YouTube
 */
export async function getInstructorCourseYouTubeVideos(
  courseId: number | string,
): Promise<CourseYouTubeVideosResponse> {
  const { data } = await api.get<CourseYouTubeVideosResponse>(
    `/instructor/courses/${courseId}/youtube-videos`,
  );
  return data;
}

/**
 * جلب قائمة الطلاب المسجلين في الكورس مع نسب التقدم
 */
export async function getInstructorCourseStudents(
  courseId: number | string,
  page?: number,
): Promise<InstructorCourseStudentsResponse> {
  const url = `/instructor/courses/${courseId}/students`;
  const { data } =
    page !== undefined
      ? await api.get<InstructorCourseStudentsResponse | InstructorCourseStudent[]>(url, {
          params: { page },
        })
      : await api.get<InstructorCourseStudentsResponse | InstructorCourseStudent[]>(url);

  if (Array.isArray(data)) {
    return { data };
  }

  if (data && typeof data === "object" && Array.isArray(data.data)) {
    const meta =
      data.meta ??
      (data.current_page !== undefined
        ? {
            current_page: data.current_page,
            last_page: data.last_page ?? 1,
            per_page: data.per_page ?? data.data.length,
            total: data.total ?? data.data.length,
          }
        : undefined);

    return {
      data: data.data,
      ...(meta ? { meta } : {}),
    };
  }

  return { data: [] };
}
