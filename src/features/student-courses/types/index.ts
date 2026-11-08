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

export type { Course, Question, Task, TaskResult, LessonProgress };

