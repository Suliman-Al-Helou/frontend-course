import type { Course, Question, Task, TaskResult, LessonProgress } from "@/types";

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

export type { Course, Question, Task, TaskResult, LessonProgress };
