/**
 * Instructor Portal Pure API Layer
 * Pure Axios client functions calling backend /api/instructor/* endpoints
 */

import api from "@/lib/api";
import type { InstructorCourse, InstructorCoursesResponse } from "../types";

/**
 * جلب الكورسات الموكلة للمدرب الحالي
 */
export async function getInstructorCourses(): Promise<InstructorCourse[]> {
  const { data } = await api.get<InstructorCoursesResponse | InstructorCourse[]>(
    "/instructor/courses",
  );

  if (Array.isArray(data)) {
    return data;
  }

  if (data && typeof data === "object") {
    if (Array.isArray(data.data)) {
      return data.data;
    }
    if (Array.isArray(data.courses)) {
      return data.courses;
    }
  }

  return [];
}
