import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Course } from "@/types";
import {
  COURSE_UI_EXTRAS,
  CourseUIExtra,
} from "@/components/landing/_data/coursesData";

export type CourseCard = Omit<Course, 'hot'> & CourseUIExtra;

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

export function useCoursesSection(): CourseCard[] {
  const [courses, setCourses] = useState<CourseCard[]>([]);

  useEffect(() => {
    api
      .get<Course[]>("/courses")
      .then(({ data }) => {
        const merged = data.map((course) => ({
          ...course,
          ...(COURSE_UI_EXTRAS.find((e) => e.id === course.id) ?? {
            instructor: "",
            students: 0, // ✅ number
            rating: 0,
            price: 0,
            tags: [],
            hot: false,
          }),
        }));
        setCourses(merged);
      })
      .catch(() => setCourses([]));
  }, []);

  return courses;
}
