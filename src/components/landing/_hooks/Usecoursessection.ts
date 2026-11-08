import { useQuery } from "@tanstack/react-query";
import { courseQueries } from "@/features/courses";
import type { Course } from "@/types";

export type CourseListItem = Course & { hot: boolean };

export function useCoursesSection(): { courses: CourseListItem[]; loading: boolean } {
  const { data: courses = [], isLoading } = useQuery({
    ...courseQueries.list(),
    select: (list): CourseListItem[] =>
      list.map((course) => ({
        ...course,
        hot: course.hot ?? false,
      })),
  });

  return { courses, loading: isLoading };
}
