'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Video, CheckCircle, ChevronDown } from 'lucide-react';
import api from '@/lib/api';

function VideosContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // جلب الكورسات
  useEffect(() => {
    api.get('/my-courses')
      .then(res => {
        const approved = res.data
          .filter((e: any) => e.status === 'approved')
          .map((e: any) => ({ id: e.course.id, title: e.course.title }));
        setEnrolledCourses(approved);

        const urlId = searchParams.get('course');
        const defaultId = urlId ? Number(urlId) : approved[0]?.id ?? null;
        setSelectedCourseId(defaultId);
      })
      .catch(() => {})
      .finally(() => setLoadingCourses(false));
  }, []);

  // جلب فيديوهات الكورس المحدد
  useEffect(() => {
    if (!selectedCourseId) return;
    setLoadingLessons(true);
    setLessons([]);

    api.get(`/courses/${selectedCourseId}`).then(async res => {
      const fullCourse = res.data;
      const result: any[] = [];
      for (const section of fullCourse?.sections ?? []) {
        for (const lesson of section.lessons ?? []) {
          let progress = { completed: false, watched_percent: 0 };
          try {
            const p = await api.get(`/lessons/${lesson.id}/progress`);
            progress = p.data;
          } catch {}
          result.push({ ...lesson, course: fullCourse, section, progress });
        }
      }
      setLessons(result);
    }).finally(() => setLoadingLessons(false));
  }, [selectedCourseId]);

  const handleSelect = (id: number) => {
    setSelectedCourseId(id);
    setDropdownOpen(false);
    router.replace(`?course=${id}`, { scroll: false });
  };

  const selectedCourse = enrolledCourses.find(c => c.id === selectedCourseId);

  if (loadingCourses) return (
    <div className="animate-pulse space-y-3">
      <div className="bg-card rounded-2xl h-12 border border-border" />
      {[1,2,3,4].map(i => <div key={i} className="bg-card rounded-2xl h-16 border border-border" />)}
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">الفيديوهات</h1>

      {/* Course Dropdown */}
      <div className="relative mb-6">
        <button
          onClick={() => setDropdownOpen(o => !o)}
          className="w-full flex items-center justify-between bg-card border border-border rounded-2xl px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/50 transition"
        >
          <span>{selectedCourse?.title ?? 'اختر كورساً'}</span>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {dropdownOpen && (
          <div className="absolute top-full mt-1 w-full bg-card border border-border rounded-2xl shadow-lg z-10 overflow-hidden">
            {enrolledCourses.map(course => (
              <button
                key={course.id}
                onClick={() => handleSelect(course.id)}
                className={`w-full text-right px-4 py-3 text-sm transition hover:bg-muted/60 ${
                  course.id === selectedCourseId
                    ? 'text-primary font-semibold bg-primary/5'
                    : 'text-foreground'
                }`}
              >
                {course.title}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lessons */}
      {loadingLessons ? (
        <div className="animate-pulse space-y-3">
          {[1,2,3,4].map(i => <div key={i} className="bg-card rounded-2xl h-16 border border-border" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson, index) => (
            <Link key={lesson.id} href={`/courses/${lesson.course.id}/lessons/${lesson.id}`}
              className="flex items-center gap-4 bg-card p-4 rounded-2xl hover:shadow-md transition border border-border group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                lesson.progress.completed ? 'bg-green-500/10' : 'bg-primary/10 group-hover:bg-primary/20'
              }`}>
                {lesson.progress.completed
                  ? <CheckCircle className="w-5 h-5 text-green-500" />
                  : <span className="text-sm font-bold text-primary">{index + 1}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{lesson.title}</p>
                <p className="text-xs text-muted-foreground">{lesson.section.title}</p>
              </div>
              <span className="text-xs text-muted-foreground">{Math.round(Number(lesson.duration) / 60)} د</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function VideosPage() {
  return (
    <Suspense fallback={<div className="animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="bg-card rounded-2xl h-16 border border-border" />)}</div>}>
      <VideosContent />
    </Suspense>
  );
}