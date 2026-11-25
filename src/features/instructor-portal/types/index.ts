/**
 * Instructor Portal Types & Contracts
 * Compliant with CourseInstructorResource (Backend) and ADR 0014, 0016, 0017, 0022
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

export interface TaskQuestion {
  id: string;
  type: "mcq" | "true_false";
  question: string;
  options: string[];
  correct_answer: number;
  explanation?: string;
}

export interface InstructorTask {
  id?: number;
  lesson_id?: number;
  questions: TaskQuestion[];
  pass_percentage: number;
  max_attempts: number;
  attempts_count?: number;
}

export interface InstructorLesson {
  id: number;
  section_id?: number;
  title: string;
  duration: number | null;
  is_preview?: boolean;
  video_id: string | null;
  video_provider?: "youtube" | "hls";
  is_published: boolean;
  order: number;
  task?: InstructorTask | null;
}

export interface InstructorSection {
  id: number;
  course_id?: number;
  title: string;
  order: number;
  lessons: InstructorLesson[];
}

export interface CourseYouTubeVideoItem {
  id: string;
  title: string;
  thumbnail?: string;
  duration_minutes: number;
  is_already_added: boolean;
}

export interface CourseYouTubeVideosResponse {
  playlist_id: string | null;
  connected: boolean;
  videos: CourseYouTubeVideoItem[];
}

export interface InstructorCourseStudent {
  id: number;
  name: string;
  email?: string;
  enrolled_at: string;
  progress_percent: number;
  completed_lessons_count: number;
  total_lessons_count: number;
}

export interface InstructorCourseStudentsPaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface InstructorCourseStudentsResponse {
  data: InstructorCourseStudent[];
  meta?: InstructorCourseStudentsPaginationMeta;
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
}

export interface InstructorProfile {
  id: number;
  name: string;
  title: string | null;
  bio: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  specializations: string | null;
  years_experience: number | null;
  rating: number | null;
  total_reviews: number | null;
  students_count: number | null;
  achievements: string[];
  twitter: string | null;
  linkedin: string | null;
  youtube: string | null;
  user?: {
    name: string;
    email?: string | null;
  };
}

export interface UpdateInstructorProfilePayload {
  name?: string;
  title?: string | null;
  bio?: string | null;
  avatar_url?: string | null;
  cover_url?: string | null;
  specializations?: string | null;
  years_experience?: number | null;
  achievements?: string[] | null;
  twitter?: string | null;
  linkedin?: string | null;
  youtube?: string | null;
}
