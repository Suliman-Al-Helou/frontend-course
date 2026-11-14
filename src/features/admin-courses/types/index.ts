export type CourseLevel = "beginner" | "intermediate" | "advanced";
export type CourseStatus = "draft" | "published" | "coming_soon";
export type EnrollmentStatus = "pending" | "approved" | "rejected";

export interface AdminCourse {
  id: number;
  title: string;
  description: string;
  cover_image: string | null;
  level: CourseLevel;
  status: CourseStatus;
  total_duration: number;
  requirements: string | string[];
  what_you_learn: string[];
  target_audience: string | string[];
  students_count?: number;
  enrollments_count?: number;
  rating?: number;
  is_popular?: boolean;
  price?: number;
  is_public?: boolean;
  youtube_playlist_id?: string | null;
  hot?: boolean;
  instructor?: {
    id: number;
    name: string;
  } | null;
  instructor_id?: number | string;
  sections?: AdminSection[];
  created_at?: string;
  updated_at?: string;
}

export interface CourseFormData {
  title: string;
  description: string;
  cover_image: string;
  level: CourseLevel;
  status: CourseStatus;
  instructor_id?: string;
  rating: number;
  is_popular: boolean;
  total_duration: number;
  price: number;
  is_public: boolean;
  what_you_learn: string[];
  requirements: string[];
  target_audience: string[];
}

export interface AdminLesson {
  id: number;
  section_id?: number;
  title: string;
  video_id: string | null;
  duration: number;
  order: number;
  is_preview: boolean;
}

export interface AdminSection {
  id: number;
  course_id?: number;
  title: string;
  order: number;
  lessons: AdminLesson[];
}

export interface AdminQuestion {
  id: string;
  type: "mcq" | "true_false" | "open";
  text: string;
  options?: string[];
  correct_answer?: string;
  explanation?: string;
}

export interface AdminTaskPayload {
  questions: AdminQuestion[];
  pass_percentage: number;
  max_attempts: number;
}

export interface AdminTaskResponse extends AdminTaskPayload {
  id?: number;
  lesson_id?: number;
}

export interface AdminEnrollment {
  id: number;
  user_id: number;
  course_id: number;
  status: EnrollmentStatus;
  payment_confirmed?: boolean;
  created_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  course?: {
    id: number;
    title: string;
    price?: number;
    level?: CourseLevel;
  };
  student_name?: string;
  student_email?: string;
  course_title?: string;
}

export interface CreateEnrollmentPayload {
  student_name: string;
  student_email: string;
  course_id: number;
  status?: EnrollmentStatus;
  payment_confirmed?: boolean;
}

export interface AdminStats {
  totalStudents: number;
  totalCourses: number;
  totalInstructors: number;
  pendingEnrollments: number;
}

export interface AdminVideoAsset {
  id: number;
  course_id: number;
  zoom_meeting_id?: number | null;
  title: string;
  description?: string | null;
  provider: "youtube" | "bunny" | "cloudflare";
  provider_video_id: string;
  duration_seconds: number;
  type: "recording" | "lesson";
  status?: "uploading" | "processing" | "ready" | "failed";
  created_by?: number;
  course?: { id: number; title: string };
  zoom_meeting?: { id: number; title: string; starts_at: string } | null;
  creator?: { id: number; name: string };
  created_at?: string;
  updated_at?: string;
}

export interface VideoAssetFormData {
  course_id: number;
  zoom_meeting_id?: number | null;
  title: string;
  description?: string;
  provider: "youtube" | "bunny" | "cloudflare";
  provider_video_id: string;
  duration_seconds: number;
  type: "recording" | "lesson";
}

export interface AdminZoomMeeting {
  id: number;
  course_id: number;
  course_name?: string;
  title: string;
  description: string | null;
  zoom_link: string;
  starts_at: string;
  duration_minutes?: number;
  attendances_count?: number;
  course?: { id: number; title: string };
  created_at?: string;
}

export interface ZoomMeetingFormData {
  course_id: number;
  title: string;
  description?: string;
  zoom_link: string;
  starts_at: string;
  duration_minutes?: number;
}
