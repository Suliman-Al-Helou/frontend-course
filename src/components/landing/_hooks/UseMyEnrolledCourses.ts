import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Course } from '@/types';

export interface Enrollment {
  id: number;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  course: Course;
}

export function useMyEnrolledCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  api.get<Enrollment[]>('/my-courses')
      .then(({ data }) => {
        const approved = data
          .filter(e => e.status === 'approved')
          .map(e => e.course);
        setCourses(approved);
      })
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  return { courses, loading };
}