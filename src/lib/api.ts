import axios from 'axios';
import type { LessonProgress, Task, TaskResult } from '@/types';
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const storage = localStorage.getItem('auth-storage');
    const token   = storage ? JSON.parse(storage)?.state?.token : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default api;
// Lesson APIs
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