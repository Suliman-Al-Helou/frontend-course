// src/components/landing/_data/coursesData.ts

import { Course } from '@/types';

// ← مؤقت: بيانات ثابتة ريثما يُستخدم GET /api/courses
// لما API جاهز، احذف هذا الملف واستخدم مباشرة:
//   const { data } = await api.get<Course[]>('/courses')
export const FEATURED_COURSES: Course[] = [
  {
    id: 1,
    title: 'Python من الصفر إلى الاحتراف',
    description: '',
    cover_image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=220&fit=crop',
    level: 'beginner',
    status: 'published',
    total_duration: 2400,
    what_you_learn: [],
    requirements: '',
    target_audience: '',
    students_count: 0,
    rating: 0,
    reviews: 0,
    students: 0,
    instructor: '',
    instructorBio: '',
    lessons: 0,
    tags: [],
    price: 0,
  },
  {
    id: 2,
    title: 'تطوير تطبيقات الويب بـ React',
    description: '',
    cover_image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=220&fit=crop',
    level: 'intermediate',
    status: 'published',
    total_duration: 3300,
    what_you_learn: [],
    requirements: '',
    target_audience: '',
    students_count: 0,
    rating: 0,
    reviews: 0,
    students: 0,
    instructor: '',
    instructorBio: '',
    lessons: 0,
    tags: [],
    price: 0,
  },
  {
    id: 3,
    title: 'الذكاء الاصطناعي وتعلم الآلة',
    description: '',
    cover_image: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=220&fit=crop',
    level: 'advanced',
    status: 'published',
    total_duration: 4200,
    what_you_learn: [],
    requirements: '',
    target_audience: '',
    students_count: 0,
    rating: 0,
    reviews: 0,
    students: 0,
    instructor: '',
    instructorBio: '',
    lessons: 0,
    tags: [],
    price: 0,
  },
];

// بيانات UI إضافية غير موجودة في الـ API بعد
export interface CourseUIExtra {
  id: number;
  instructor: string;
  students: number;  // ✅ number بدل string
  rating: number;
  price: number;
  tags: string[];
  hot: boolean;
}

export const COURSE_UI_EXTRAS: CourseUIExtra[] = [
  { id: 1, instructor: 'أ. محمد الشمري', students: 3240, rating: 4.9, price: 299, tags: ['Python', 'برمجة'], hot: true  },
  { id: 2, instructor: 'أ. سارة العمري',  students: 2100, rating: 4.8, price: 349, tags: ['React', 'JavaScript'], hot: false },
  { id: 3, instructor: 'د. خالد البكر',   students: 1850, rating: 4.9, price: 499, tags: ['AI', 'ML', 'Python'], hot: true  },
];