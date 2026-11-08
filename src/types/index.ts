export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "student";
}

export interface LessonProgress {
  watched_percent: number;
  completed: boolean;
  last_position: number;
}

export interface Task {
  id: number;
  questions: Question[];
  pass_percentage: number;
  max_attempts: number;
}
export interface Course {
  id: number;
  title: string;
  description: string;
  cover_image: string | null;
  level: "beginner" | "intermediate" | "advanced";
  status: "draft" | "published" | "coming_soon";
  total_duration: number;
  what_you_learn: string[];
  requirements: string;
  target_audience: string;
  students_count: number;
  sections?: Section[];
  is_public: Boolean;
  rating: number;
  reviews: number;
  students: number;
  instructor: string;
  instructorBio: string;
  lessons: number;
  duration?: string;
  tags: string[];
  price: number;
  hot?: boolean;
  next_lesson_id?: number | null;
}

export interface Section {
  id: number;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: number;
  title: string;
  duration: number;
  order: number;
  is_preview: boolean;
}

export interface LessonDetail extends Lesson {
  video_id: string;
  task?: Task;
}

export interface Question {
  id: string;
  type: "mcq" | "true_false" | "open";
  text: string;
  options?: string[];
  // correct_answer و explanation مخفيين عن الطالب — بيجوا بعد التسليم
}

export interface TaskResult {
  score: number;
  passed: boolean;
  pass_score: number;
  message?: string;
  // Backend returns results as object keyed by question_id
  results: Record<
    string,
    {
      correct: boolean;
      your_answer: string;
      correct_answer: string;
      explanation: string | null;
      type?: string;
      pending?: boolean;
    }
  >;
}

export interface CourseProgress {
  total_lessons: number;
  completed_count: number;
  percent: number;
  course_complete: boolean;
}
// أضف للـ types الموجودة
export interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  // من الـ Backend with('user', 'course')
  user?: {
    id: number;
    name: string;
    email: string;
  };
  course?: {
    id: number;
    title: string;
  };
  // للتوافق مع الكود القديم
  student_name?: string;
  student_email?: string;
  course_title?: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: "student" | "admin";
  created_at: string;
}

export interface Instructor {
  id: number;
  name: string;
  title?: string;
  bio?: string;
  avatar_url?: string;
  cover_url?: string;
  specializations?: string;
  years_experience?: number;
  rating?: number;
  total_reviews?: number;
  students_count?: number;
  achievements?: string[];
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  courses?: number[]; // IDs of assigned courses
}

export interface AdminStats {
  totalStudents: number;
  totalCourses: number;
  totalInstructors: number;
  pendingEnrollments: number;
}
