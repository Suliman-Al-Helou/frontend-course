'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Video, Lock, CheckCircle } from 'lucide-react';
import api from '@/lib/api';

export default function VideosPage() {
  const [data, setData]     = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  api.get('/my-courses').then(async res => {
    const result: any[] = [];
    
    // فلتر approved فقط
    const approved = res.data.filter((e: any) => e.status === 'approved');
    
    for (const enrollment of approved) {
      const course = enrollment.course;
      
      // جيب تفاصيل الكورس مع الـ sections
      const { data: fullCourse } = await api.get(`/courses/${course.id}`);
      const sections = fullCourse?.sections ?? [];
      
      for (const section of sections) {
        for (const lesson of section.lessons ?? []) {
          let progress = { completed: false, watched_percent: 0 };
          try {
            const p = await api.get(`/lessons/${lesson.id}/progress`);
            progress = p.data;
          } catch {}
          result.push({ ...lesson, course: fullCourse, section, progress });
        }
      }
    }
    setData(result);
  }).finally(() => setLoading(false));
}, []);

  if (loading) return <div className="animate-pulse space-y-3">{[1,2,3,4].map(i => <div key={i} className="bg-card rounded-2xl h-16 border border-border" />)}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">الفيديوهات</h1>
      <div className="space-y-3">
        {data.map(lesson => (
          <Link key={lesson.id} href={`/courses/${lesson.course.id}/lessons/${lesson.id}`}
            className="flex items-center gap-4 bg-card p-4 rounded-2xl hover:shadow-md transition border border-border">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              lesson.progress.completed ? 'bg-green-500/10' : 'bg-primary/10'
            }`}>
              {lesson.progress.completed
                ? <CheckCircle className="w-5 h-5 text-green-500" />
                : <Video className="w-5 h-5 text-primary" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{lesson.title}</p>
              <p className="text-xs text-muted-foreground">{lesson.course.title} — {lesson.section.title}</p>
            </div>
            <span className="text-xs text-muted-foreground">{Math.round(Number(lesson.duration) / 60)} د</span>
          </Link>
        ))}
      </div>
    </div>
  );
}