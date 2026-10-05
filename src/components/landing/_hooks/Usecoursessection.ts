import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Course } from "@/types";

export type CourseListItem = Course & { hot: boolean };

export function useCoursesSection(): { courses: CourseListItem[]; loading: boolean } {
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<Course[]>("/courses")
      .then(({ data }) => {
        setCourses(
          data.map((course) => ({
            ...course,
            hot: course.hot ?? false,
          }))
        );
      })
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  return { courses, loading };
}