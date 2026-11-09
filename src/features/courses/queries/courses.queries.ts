import { queryOptions } from "@tanstack/react-query";
import { getCourses, type GetCoursesParams } from "../api/getCourses";
import { getCourseById } from "../api/getCourseDetail";

export const courseQueries = {
  all: () => ["courses"] as const,
  lists: () => [...courseQueries.all(), "list"] as const,
  // مصنع استعلامات موحد يقبل المعاملات (مثل limit: 3 لصفحة الهبوط) ويعزل الكاش هرمياً
  list: (params?: GetCoursesParams) =>
    queryOptions({
      queryKey: [...courseQueries.lists(), params ?? {}] as const,
      queryFn: () => getCourses(params),
      staleTime: 1000 * 60 * 5, // 5 دقائق كاش طازج في المتصفح
      gcTime: 1000 * 60 * 60 * 24, // 24 ساعة احتفاظ في الذاكرة (Garbage Collection)
    }),
  details: () => [...courseQueries.all(), "detail"] as const,
  detail: (id: string | number) =>
    queryOptions({
      queryKey: [...courseQueries.details(), String(id)],
      queryFn: () => getCourseById(id),
      staleTime: 1000 * 60 * 60, // 1 hour cache
      gcTime: 1000 * 60 * 60 * 24, // 24 hours garbage collection
    }),
};
