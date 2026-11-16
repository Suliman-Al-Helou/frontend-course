import { useQuery } from "@tanstack/react-query";
import { courseQueries } from "@/features/courses";
import type { Course } from "@/types";

export type CourseListItem = Course & { hot: boolean };

export function useCoursesSection(): { courses: CourseListItem[]; loading: boolean } {
  const { data: courses = [], isLoading } = useQuery({
    // طلب أحدث 3 كورسات فقط من الـ Backend لصفحة الهبوط مع عزل كاشها
    ...courseQueries.list({ limit: 3 }),
    // حماية دفاعية لضمان ألا تزيد الكروت المعروضة عن 3 أبداً حتى في الحالات الحدية
    select: (list): CourseListItem[] =>
      list.slice(0, 3).map((course) => ({
        ...course,
        hot: course.hot ?? false,
      })),
  });

  return { courses, loading: isLoading };
}
