import api from "@/lib/api";
import type { LessonProgress, Task, TaskResult } from "@/types";

/**
 * واجهات استدعاء خدمات الدروس والمهام المرتبطة بحساب الطالب
 */
export const lessonApi = {
  getProgress: (lessonId: number) => api.get<LessonProgress>(`/lessons/${lessonId}/progress`),

  saveProgress: (lessonId: number, data: { watched_percent: number; last_position: number }) =>
    api.post(`/lessons/${lessonId}/progress`, data),

  getTask: (lessonId: number) => api.get<Task>(`/lessons/${lessonId}/task`),

  submitTask: (lessonId: number, answers: Record<string, string>) =>
    api.post<TaskResult>(`/lessons/${lessonId}/task`, { answers }),
};

export default lessonApi;

