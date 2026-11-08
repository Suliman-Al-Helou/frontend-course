import { useQuery } from "@tanstack/react-query";
import { courseQueries } from "@/features/courses/queries/courses.queries";

export interface SimpleCourseItem {
  id: number;
  title: string;
}

export function useCourses() {
  return useQuery({
    ...courseQueries.list(),
    select: (courses): SimpleCourseItem[] =>
      courses.slice(0, 5).map((course) => ({
        id: Number(course.id),
        title: String(course.title ?? ""),
      })),
  });
}
