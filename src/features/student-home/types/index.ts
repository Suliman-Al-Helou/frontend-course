import type { LucideIcon } from "lucide-react";

// Mirrors DashboardController@stats (raw JSON, no API Resource exists yet).
export interface DashboardStats {
  enrolled_courses: number;
  completed_lessons: number;
  learning_hours: number;
  completed_courses: number;
  streak: number;
}

export interface ExamResult {
  lesson: string;
  course: string;
  score: number;
  passed: boolean;
  date: string; // formatted server-side as "Y/n/j"
}

export interface StudentHomeResponse {
  stats: DashboardStats;
  exam_results: ExamResult[];
  pass_rate: number;
}

// Mirrors ZoomMeetingController@index.
// `joined` = clicked "join"; `attended` = attendance CONFIRMED (code or manual).
export interface ZoomMeeting {
  id: number;
  course_id: number;
  course_name: string;
  title: string;
  description: string | null;
  starts_at: string; // ISO (UTC)
  ends_at: string; // ISO (UTC)
  can_join: boolean;
  joined: boolean;
  attended: boolean;
  code_open: boolean;
}

export interface JoinZoomResponse {
  zoom_link: string;
}

export interface StatCardView {
  key: keyof DashboardStats;
  label: string;
  value: string;
  icon: LucideIcon;
}
