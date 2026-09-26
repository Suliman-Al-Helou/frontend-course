import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { sessionOptions, SessionData } from '@/lib/session';
import { laravelFetch } from '@/lib/laravel-fetch';
import type { LessonProgress, Task, TaskResult } from '@/types';

// دالة مساعدة لقراءة التوكن بأمان من الـ session على السيرفر
async function getAuthToken() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  return session.token;
}

export const lessonApi = {
  getProgress: async (lessonId: number) => {
    const token = await getAuthToken();
    const { data } = await laravelFetch(`/lessons/${lessonId}/progress`, { token });
    return data as LessonProgress;
  },

  saveProgress: async (lessonId: number, body: { watched_percent: number; last_position: number }) => {
    const token = await getAuthToken();
    const { data } = await laravelFetch(`/lessons/${lessonId}/progress`, { method: 'POST', body, token });
    return data;
  },

  getTask: async (lessonId: number) => {
    const token = await getAuthToken();
    const { data } = await laravelFetch(`/lessons/${lessonId}/task`, { token });
    return data as Task;
  },

  submitTask: async (lessonId: number, answers: Record<string, string>) => {
    const token = await getAuthToken();
    const { data } = await laravelFetch(`/lessons/${lessonId}/task`, { 
      method: 'POST', 
      body: { answers }, 
      token 
    });
    return data as TaskResult;
  },
};
