'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Play } from 'lucide-react';
import api from '@/lib/api';

export default function ContinuePage() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/my-courses');
        const approved = res.data.filter((e: any) => e.status === 'approved');
        const incomplete: any[] = [];

        for (const enrollment of approved) {
          const course = enrollment.course;

          // جيب تفاصيل الكورس مع الـ sections
          const { data: fullCourse } = await api.get(`/courses/${course.id}`);
          const sections = fullCourse?.sections ?? [];

          for (const section of sections) {
            for (const lesson of section.lessons ?? []) {
              try {
                const prog = await api.get(`/lessons/${lesson.id}/progress`);
                if (!prog.data.completed && prog.data.watched_percent > 0) {
                  incomplete.push({
                    ...lesson,
                    course: fullCourse,
                    section,
                    watched_percent: prog.data.watched_percent,
                  });
                }
              } catch {}
            }
          }
        }

        setLessons(incomplete);
      } catch {}
      finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  if (loading) return (
    <div className="animate-pulse space-y-4">
      {[1,2,3].map(i => <div key={i} className="bg-card rounded-2xl h-20 border border-border" />)}
    </div>
  );

  if (lessons.length === 0) return (
    <div className="text-center py-20">
      <Play className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
      <p className="text-muted-foreground">لا توجد دروس غير مكتملة</p>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">تابع التعلم</h1>
      <div className="space-y-3">
        {lessons.map(lesson => (
          <Link key={lesson.id} href={`/courses/${lesson.course.id}/lessons/${lesson.id}`}
            className="flex items-center gap-4 bg-card p-4 rounded-2xl hover:shadow-md transition border border-border group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center flex-shrink-0 transition-colors">
              <Play className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{lesson.title}</p>
              <p className="text-xs text-muted-foreground mb-1.5">
                {lesson.course.title} — {lesson.section.title}
              </p>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div className="bg-primary h-1.5 rounded-full transition-all"
                  style={{ width: `${lesson.watched_percent}%` }} />
              </div>
            </div>
            <span className="text-xs text-primary font-bold flex-shrink-0">
              {lesson.watched_percent}%
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}