import { Course } from "@/types";

/* ─── Types ──────────────────────────────────────────────── */
export interface CourseLessonUI {
  id: number;
  title: string;
  duration: string;
  is_preview: boolean;
  video_id: string | null;
  order: number;
}

export interface CourseSectionUI {
  id: number;
  title: string;
  order: number;
  lessons: CourseLessonUI[];
}

export type CourseDetail = Omit<Course, "sections" | "requirements" | "target_audience"> & {
  sections: CourseSectionUI[];
  what_you_learn: string[];
  requirements: string[];
  target_audience: string[];
  instructor: string;
  instructorBio: string;
  students: number;
  reviews: number;
  lessons: number;
};

/* ─── API & Queries ─────────────────────────────────────── */
export * from "./api/getCourses";
export * from "./api/getCourseDetail";
export * from "./queries/courses.queries";
export * from "./hooks/useCourseDetail";

/* ─── UI Components (Phase 1: Public Courses) ───────────── */
export { default as CourseCard } from "./components/CourseCard";
export * from "./components/CourseCard";
export * from "./components/CourseCardSkeleton";
export { default as CourseLevelBadge } from "./components/CourseLevelBadge";
export { default as StarRating } from "./components/StarRating";
/* ─── Utilities ─────────────────────────────────────────── */
export * from "./utils/courseLevel";
export * from "./utils/courseLinks";
export * from "./components/catalog/CoursesHero";
export * from "./components/catalog/CourseLevelFilters";
export * from "./components/catalog/CoursesEmptyState";
export * from "./components/detail/CourseHero";
export * from "./components/detail/EnrollCard";
export * from "./components/detail/CourseCurriculum";
export * from "./components/detail/CourseOutcomes";
export * from "./components/detail/CourseBottomCta";
