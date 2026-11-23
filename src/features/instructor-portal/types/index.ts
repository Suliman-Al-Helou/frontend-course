/**
 * Instructor Portal Types & Contracts
 * Compliant with CourseInstructorResource (Backend) and ADR 0014
 */

export interface InstructorCourse {
  id: number;
  title: string;
  description: string | null;
  cover_image: string | null;
  level: string | null;
  total_duration: string | null;
  requirements: string[];
  target_audience: string[];
  what_you_learn: string[];
  rating: number | null;
  students_count: number;
  instructor?: {
    id: number;
    name: string;
  } | null;
}

export interface InstructorCoursesResponse {
  data?: InstructorCourse[];
  courses?: InstructorCourse[];
}
