'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Clock, Users } from 'lucide-react';
import api from '@/lib/api';
import Image from 'next/image';
export default function MyCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
api.get('/my-courses')
  .then(res => {
    const approved = res.data.filter((e: any) => e.status === 'approved');
    setCourses(approved);
  })
    .catch(() => setCourses([]))
    .finally(() => setLoading(false));
}, []);
  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1,2,3].map(i => (
        <div key={i} className="bg-card rounded-2xl p-5 animate-pulse h-40 border border-border" />
      ))}
    </div>
  );

  if (courses.length === 0) return (
    <div className="text-center py-20">
      <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
      <p className="text-muted-foreground mb-4">لم تسجل في أي كورس بعد</p>
      <Link href="/courses" className="bg-primary text-white px-6 py-2 rounded-xl text-sm hover:bg-primary/90 transition">
        تصفح الكورسات
      </Link>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">كورساتي</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((enrollment: any) => (
          <div key={enrollment.id} className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition border border-border">
            {enrollment.course?.cover_image && (
            <img src={enrollment.course.cover_image} alt={enrollment.course.title} className="w-full h-36 object-cover" />
            )}
            <div className="p-4">
              <h3 className="font-bold text-foreground mb-2">{enrollment.course?.title}</h3>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {Math.round(Number(enrollment.course?.total_duration) / 60)} ساعة
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {enrollment.course?.students_count} طالب
                </span>
              </div>
              <Link
               href={`/dashboard/videos?course=${enrollment.course?.id}`}
                className="w-full flex items-center justify-center bg-primary/10 text-primary py-2 rounded-xl text-sm font-medium hover:bg-primary/20 transition"
              >
                عرض الكورس
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}