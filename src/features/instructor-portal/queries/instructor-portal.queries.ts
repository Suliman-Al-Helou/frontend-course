/**
 * Instructor Portal TanStack Query v5 Factory
 */

import { queryOptions } from "@tanstack/react-query";
import { getInstructorCourses } from "../api";
import type { InstructorCourse } from "../types";

export const instructorPortalKeys = {
  all: ["instructor-portal"] as const,
  courses: () => [...instructorPortalKeys.all, "courses"] as const,
};

export const instructorPortalQueries = {
  all: () => instructorPortalKeys.all,

  courses: () =>
    queryOptions({
      queryKey: instructorPortalKeys.courses(),
      queryFn: (): Promise<InstructorCourse[]> => getInstructorCourses(),
      staleTime: 1000 * 60 * 5, // 5 minutes fresh
      gcTime: 1000 * 60 * 30, // 30 minutes in memory
    }),
};
