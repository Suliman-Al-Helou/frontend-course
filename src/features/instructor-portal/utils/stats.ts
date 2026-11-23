/**
 * Instructor Dashboard Statistics Utilities (Phase 5.2 / Ticket 10)
 */

import type { InstructorCourse } from "../types";

export interface InstructorDashboardStats {
  assignedCoursesCount: number;
  totalStudentsEnrolled: number;
  averageRating: number | null;
  recentCourses: InstructorCourse[];
  hasCourses: boolean;
}

export function calculateInstructorStats(courses: InstructorCourse[]): InstructorDashboardStats {
  if (!courses || courses.length === 0) {
    return {
      assignedCoursesCount: 0,
      totalStudentsEnrolled: 0,
      averageRating: null,
      recentCourses: [],
      hasCourses: false,
    };
  }

  const assignedCoursesCount = courses.length;

  const totalStudentsEnrolled = courses.reduce(
    (sum, course) => sum + (Number(course.students_count) || 0),
    0,
  );

  const ratedCourses = courses.filter(
    (course) => course.rating !== null && course.rating !== undefined && Number(course.rating) > 0,
  );

  const averageRating =
    ratedCourses.length > 0
      ? Number(
          (
            ratedCourses.reduce((sum, c) => sum + Number(c.rating), 0) / ratedCourses.length
          ).toFixed(1),
        )
      : null;

  const recentCourses = courses.slice(0, 3);

  return {
    assignedCoursesCount,
    totalStudentsEnrolled,
    averageRating,
    recentCourses,
    hasCourses: true,
  };
}
