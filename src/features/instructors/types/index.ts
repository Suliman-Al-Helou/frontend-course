/**
 * Instructors Feature Domain Types
 */

export interface Instructor {
  id: number;
  user_id?: number | null;
  is_display_only?: boolean;
  user?: { id: number; name: string; email: string } | null;
  name: string;
  title?: string;
  bio?: string;
  avatar_url?: string;
  cover_url?: string;
  specializations?: string | string[];
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

/**
 * Safely parses specializations whether represented as a comma-separated string,
 * an array of strings, or null/undefined.
 */
export function parseSpecializations(specializations?: string | string[] | null): string[] {
  if (!specializations) return [];
  if (Array.isArray(specializations)) {
    return specializations.map((s) => String(s).trim()).filter(Boolean);
  }
  if (typeof specializations === "string") {
    return specializations
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
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
  user_id?: number | null;
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
