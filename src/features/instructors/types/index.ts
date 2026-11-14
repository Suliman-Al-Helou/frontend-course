/**
 * Instructors Feature Domain Types
 */

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
  courses_count?: number;
  achievements?: string[];
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  courses?: number[];
  created_at?: string;
  updated_at?: string;
}

export interface InstructorWithCoursesCount extends Instructor {
  courses_count?: number;
}

export interface InstructorCourseItem {
  id: number;
  title: string;
  cover_image?: string;
  level: string;
  total_duration: number;
  students_count: number;
  rating: number;
  price?: number;
}

export interface InstructorDetail extends Omit<Instructor, "courses"> {
  courses?: InstructorCourseItem[];
}

export interface InstructorFormData {
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
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  achievements?: string[];
  courses?: number[];
}
