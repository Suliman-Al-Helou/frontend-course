"use client";

import { useQuery } from "@tanstack/react-query";
import { courseQueries } from "../queries/courses.queries";

export function useCourseDetail(courseId: string | number) {
  const num = Number(courseId);
  const isValid = Boolean(courseId) && !Number.isNaN(num) && num > 0;

  return useQuery({
    ...courseQueries.detail(isValid ? num : String(courseId)),
    enabled: isValid,
  });
}
