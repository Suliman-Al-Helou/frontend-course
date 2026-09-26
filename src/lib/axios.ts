import axios from 'axios';
import type { LessonProgress, Task, TaskResult } from '@/types';

import api from '@/lib/api';
// الـ APIs الخاصة بالدروس والمهام (تستدعى داخل الـ Client Components)
export const lessonApi = {
  getProgress: (lessonId: number) =>
    api.get<LessonProgress>(`/lessons/${lessonId}/progress`),

  saveProgress: (lessonId: number, data: { watched_percent: number; last_position: number }) =>
    api.post(`/lessons/${lessonId}/progress`, data),

  getTask: (lessonId: number) =>
    api.get<Task>(`/lessons/${lessonId}/task`),

  submitTask: (lessonId: number, answers: Record<string, string>) =>
    api.post<TaskResult>(`/lessons/${lessonId}/task`, { answers }),
};
