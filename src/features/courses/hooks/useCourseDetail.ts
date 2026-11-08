"use client";

import { useQuery } from "@tanstack/react-query";
import { courseQueries } from "../queries/courses.queries";

export function useCourseDetail(courseId: string | number) {
  return useQuery({
    ...courseQueries.detail(courseId),
    enabled: Boolean(courseId),
  });
}
