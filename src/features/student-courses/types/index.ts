import type {
  Course,
  Question,
  Task,
  TaskResult,
  LessonProgress,
  VideoPlaybackPayload,
} from "@/types";

export interface StudentEnrollment {
  id: number;
  status: "pending" | "approved" | "rejected" | "suspended";
  course_id: number;
  created_at?: string;
  course: Course;
}

export interface StudentTaskAnswer {
  questionId: string;
  answer: string;
}

export interface InProgressLesson {
  id: number;
  title: string;
  watched_percent: number;
  course: {
    id: number;
    title: string;
  };
  section: {
    id: number;
    title: string;
  };
}

export interface LessonDetail {
  id: number;
  title: string;
  description?: string;
  video_id?: string;
  playback?: VideoPlaybackPayload | null;
  video_provider?: "youtube" | "hls";
  duration?: number;
  order: number;
  is_preview?: boolean;
  is_published?: boolean;
}

export interface CourseProgressSummary {
  total_lessons: number;
  completed_count: number;
  completed_lesson_ids?: number[];
  percent: number;
  course_complete: boolean;
}

export type { Course, Question, Task, TaskResult, LessonProgress, VideoPlaybackPayload };
