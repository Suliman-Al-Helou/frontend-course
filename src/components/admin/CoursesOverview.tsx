'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign } from 'lucide-react';
import api from '@/lib/api';
import type { Enrollment } from '@/types';

export default function CoursesOverview({ enrollments }: { enrollments: Enrollment[] }) {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    // admin/courses بترجع price بعكس public /courses
    api.get('/admin/courses').then(res => {
      setCourses(res.data.data ?? res.data);
    }).catch(console.error);
  }, []);

  const getCount = (id: number) =>
    enrollments.filter(e => e.course_id === id && e.status === 'approved').length;

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-bold text-foreground">الكورسات والأسعار</h2>
        <p className="text-xs text-muted-foreground mt-1">هذه المعلومات تظهر للأدمن فقط</p>
      </div>
      <div className="divide-y divide-border">
        {courses.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.06 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 hover:bg-muted/30 transition-colors"
          >
            <div>
              <p className="font-semibold text-foreground text-sm">{course.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{course.level}</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="flex items-center gap-1.5 text-primary bg-primary/10 px-3 py-1 rounded-full text-xs font-semibold">
                <Users className="w-3.5 h-3.5" />
                {getCount(course.id)} طالب
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full text-xs font-semibold">
                <DollarSign className="w-3.5 h-3.5" />
                {Number(course.price) > 0 ? `${course.price}$` : 'مجاني'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}