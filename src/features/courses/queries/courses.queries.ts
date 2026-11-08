import { queryOptions } from "@tanstack/react-query";
import { getCourses } from "../api/getCourses";
import { getCourseById } from "../api/getCourseDetail";

export const courseQueries = {
  all: () => ["courses"] as const,
  lists: () => [...courseQueries.all(), "list"] as const,
  list: () =>
    queryOptions({
      queryKey: courseQueries.lists(),
      queryFn: getCourses,
      // staleTime: 1000 * 60 * 60, // 1 hour cache
      // gcTime: 1000 * 60 * 60 * 24, // 24 hours garbage collection
    }),
  details: () => [...courseQueries.all(), "detail"] as const,
  detail: (id: string | number) =>
    queryOptions({
      queryKey: [...courseQueries.details(), String(id)],
      queryFn: () => getCourseById(id),
      // staleTime: 1000 * 60 * 60, // 1 hour cache
      // gcTime: 1000 * 60 * 60 * 24, // 24 hours garbage collection
    }),
};
