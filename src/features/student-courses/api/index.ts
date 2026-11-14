import api from "@/lib/api";
import type {
  StudentEnrollment,
  LessonProgress,
  Task,
  TaskResult,
  LessonDetail,
  InProgressLesson,
  CourseProgressSummary,
} from "../types";

/**
 * جلب تفاصيل درس معين والفيديو المحمي
 */
export async function getLesson(lessonId: number | string): Promise<LessonDetail> {
  const { data } = await api.get<LessonDetail>(`/lessons/${lessonId}`);
  return data;
}

/**
 * جلب الدروس قيد المتابعة للطالب بطلب مفرد ومجمّع
 */
export async function getInProgressLessons(): Promise<InProgressLesson[]> {
  const { data } = await api.get<InProgressLesson[]>("/lessons/in-progress");
  return Array.isArray(data) ? data : [];
}

/**
 * جلب ملخص تقدم الكورس والدروس المكتملة دفعة واحدة
 */
export async function getCourseProgressSummary(
  courseId: number | string,
): Promise<CourseProgressSummary> {
  const { data } = await api.get<CourseProgressSummary>(`/courses/${courseId}/progress-summary`);
  return data;
}

/**
 * تسجيل اشتراك الطالب في كورس
 */
export async function enrollInCourse(courseId: number | string): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>(`/courses/${courseId}/enroll`);
  return data;
}

/**
 * جلب جميع الكورسات المسجل بها الطالب الحالي
 */
export async function getMyCourses(): Promise<StudentEnrollment[]> {
  const { data } = await api.get<StudentEnrollment[] | { data: StudentEnrollment[] }>(
    "/my-courses",
  );
  if (Array.isArray(data)) return data;
  if (
    data &&
    typeof data === "object" &&
    Array.isArray((data as { data: StudentEnrollment[] }).data)
  ) {
    return (data as { data: StudentEnrollment[] }).data;
  }
  return [];
}

/**
 * جلب حالة تقدم الدرس للطالب الحالي
 */
export async function getLessonProgress(lessonId: number | string): Promise<LessonProgress> {
  try {
    const { data } = await api.get<LessonProgress>(`/lessons/${lessonId}/progress`);
    return data ?? { watched_percent: 0, completed: false, last_position: 0 };
  } catch {
    return { watched_percent: 0, completed: false, last_position: 0 };
  }
}

/**
 * حفظ وتحديث نسبة ونقطة تقدم مشاهدة الفيديو
 */
export async function saveLessonProgress(
  lessonId: number | string,
  payload: { watched_percent: number; last_position: number },
): Promise<LessonProgress> {
  const { data } = await api.post<LessonProgress>(`/lessons/${lessonId}/progress`, payload);
  return data;
}

/**
 * جلب مهمة / اختبار الدرس
 */
export async function getLessonTask(lessonId: number | string): Promise<Task | null> {
  try {
    const { data } = await api.get<Task>(`/lessons/${lessonId}/task`);
    return data ?? null;
  } catch {
    return null;
  }
}

/**
 * إرسال إجابات مهمة الدرس واستلام النتيجة
 */
export async function submitLessonTask(
  lessonId: number | string,
  answers: Record<string, string>,
): Promise<TaskResult> {
  const { data } = await api.post<TaskResult>(`/lessons/${lessonId}/task`, { answers });
  return data;
}
