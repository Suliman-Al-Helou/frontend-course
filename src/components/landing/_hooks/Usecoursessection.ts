import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Course } from "@/types";

export type CourseCard = Course & { hot: boolean };

const LEVEL_COLOR: Record<Course["level"], string> = {
  beginner: "bg-green-100 text-green-700",
  intermediate: "bg-blue-100 text-blue-700",
  advanced: "bg-purple-100 text-purple-700",
};

const LEVEL_LABEL: Record<Course["level"], string> = {
  beginner: "مبتدئ",
  intermediate: "متوسط",
  advanced: "متقدم",
};

export function useLevelStyle(level: Course["level"]) {
  return {
    color: LEVEL_COLOR[level],
    label: LEVEL_LABEL[level],
  };
}

export function useCoursesSection(): { courses: CourseCard[]; loading: boolean } {
  const [courses, setCourses] = useState<CourseCard[]>([]);
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