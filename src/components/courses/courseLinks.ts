import type { Course } from "@/types";

export function getCourseLinks(
  course: Course,
  isEnrolled: boolean,
  isAuthenticated: boolean,
) {
  const detailsHref = `/courses/${course.id}`;

  return {
    href: isEnrolled || isAuthenticated ? detailsHref : "/register",
    learnHref: course.next_lesson_id
      ? `/courses/${course.id}/lessons/${course.next_lesson_id}`
      : detailsHref,
    ctaLabel: isEnrolled ? "متابعة التعلم" : "عرض الكورس", // TODO: translate
  };
}