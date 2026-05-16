import { useState, useEffect } from 'react';
import api, { lessonApi } from '@/lib/api';
import type { Course, LessonDetail, LessonProgress } from '@/types';

interface UseLessonDataResult {
  course:    Course | null;
  lesson:    LessonDetail | null;
  progress:  LessonProgress | null;
  loading:   boolean;
  error:     string | null;
  refetchProgress: () => void;
}

export function useLessonData(courseId: string, lessonId: string): UseLessonDataResult {
  const [course,   setCourse]   = useState<Course | null>(null);
  const [lesson,   setLesson]   = useState<LessonDetail | null>(null);
  const [progress, setProgress] = useState<LessonProgress | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  useEffect(() => {
async function fetchData() {
  try {
    setLoading(true);

    const courseRes = await api.get<Course>(`/courses/${courseId}`);
    const courseData = courseRes.data;
    setCourse(courseData);

    // استخرج الدرس
    let foundLesson: LessonDetail | null = null;
    for (const section of courseData.sections ?? []) {
      const l = section.lessons.find(l => l.id === Number(lessonId));
      if (l) { foundLesson = l as LessonDetail; break; }
    }
    setLesson(foundLesson);

    // جلب الـ progress منفصلاً — لو فشل ما يوقف الصفحة
    try {
      const progressRes = await lessonApi.getProgress(Number(lessonId));
      setProgress(progressRes.data);
    } catch {
      // مش مسجل أو ما في progress بعد — عادي
      setProgress({ watched_percent: 0, completed: false, last_position: 0 });
    }

  } catch {
    setError('تعذّر تحميل بيانات الدرس');
  } finally {
    setLoading(false);
  }
}
    fetchData();
  }, [courseId, lessonId]);

  const refetchProgress = async () => {
    const res = await lessonApi.getProgress(Number(lessonId));
    setProgress(res.data);
  };

  return { course, lesson, progress, loading, error, refetchProgress };
}