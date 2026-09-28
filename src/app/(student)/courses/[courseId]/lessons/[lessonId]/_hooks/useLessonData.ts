// import { useState, useEffect } from 'react';
// import  { lessonApi } from '@/lib/axios';
// import type { Course, LessonDetail, LessonProgress } from '@/types';
// import api from '@/lib/api';

// interface UseLessonDataResult {
//   course:    Course | null;
//   lesson:    LessonDetail | null;
//   progress:  LessonProgress | null;
//   loading:   boolean;
//   error:     string | null;
//   refetchProgress: () => void;
// }

// export function useLessonData(courseId: string, lessonId: string): UseLessonDataResult {
//   const [course,   setCourse]   = useState<Course | null>(null);
//   const [lesson,   setLesson]   = useState<LessonDetail | null>(null);
//   const [progress, setProgress] = useState<LessonProgress | null>(null);
//   const [loading,  setLoading]  = useState(true);
//   const [error,    setError]    = useState<string | null>(null);

//   useEffect(() => {
// async function fetchData() {
//   try {
//     setLoading(true);

//     const courseRes = await api.get<Course>(`/courses/${courseId}`);
//     const courseData = courseRes.data;
//     setCourse(courseData);

//     // استخرج الدرس
//     let foundLesson: LessonDetail | null = null;
//     for (const section of courseData.sections ?? []) {
//       const l = section.lessons.find(l => l.id === Number(lessonId));
//       if (l) { foundLesson = l as LessonDetail; break; }
//     }
//     setLesson(foundLesson);

//     // جلب الـ progress منفصلاً — لو فشل ما يوقف الصفحة
//     try {
//       const progressRes = await lessonApi.getProgress(Number(lessonId));
//       setProgress(progressRes.data);
//     } catch {
//       // مش مسجل أو ما في progress بعد — عادي
//       setProgress({ watched_percent: 0, completed: false, last_position: 0 });
//     }

//   } catch {
//     setError('تعذّر تحميل بيانات الدرس');
//   } finally {
//     setLoading(false);
//   }
// }
//     fetchData();
//   }, [courseId, lessonId]);

//   const refetchProgress = async () => {
//     const res = await lessonApi.getProgress(Number(lessonId));
//     setProgress(res.data);
//   };

//   return { course, lesson, progress, loading, error, refetchProgress };
// }
import { useState, useEffect } from 'react';
import { lessonApi } from '@/lib/axios';
import type { Course, LessonContent, LessonProgress } from '@/types';
import api from '@/lib/api';

type AccessError = 'login' | 'locked' | null;

interface UseLessonDataResult {
  course:      Course | null;
  lesson:      LessonContent | null;
  progress:    LessonProgress | null;
  loading:     boolean;
  error:       string | null;
  accessError: AccessError;
  refetchProgress: () => void;
}

export function useLessonData(courseId: string, lessonId: string): UseLessonDataResult {
  const [course,      setCourse]      = useState<Course | null>(null);
  const [lesson,      setLesson]      = useState<LessonContent | null>(null);
  const [progress,    setProgress]    = useState<LessonProgress | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [accessError, setAccessError] = useState<AccessError>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setAccessError(null);

        // 1) الهيكل العام (للـ sidebar والعناوين)
        const courseRes = await api.get<Course>(`/courses/${courseId}`);
        setCourse(courseRes.data);

        // 2) محتوى الدرس (محمي بالـ Policy)
        try {
          const lessonRes = await lessonApi.getLesson(Number(lessonId));
          setLesson(lessonRes.data);
        } catch (err: any) {
          const status = err.response?.status;
          if (status === 401) setAccessError('login');
          else if (status === 403) setAccessError('locked');
          else if (status === 404) setLesson(null);
          else throw err;
          return; // ما في داعي نجيب التقدم
        }

        // 3) التقدم (لو فشل ما يوقف الصفحة)
        try {
          const progressRes = await lessonApi.getProgress(Number(lessonId));
          setProgress(progressRes.data);
        } catch {
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

  return { course, lesson, progress, loading, error, accessError, refetchProgress };
}