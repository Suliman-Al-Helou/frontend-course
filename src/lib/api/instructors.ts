import api from "@/lib/api";
import type { Instructor } from "@/types";

export interface InstructorWithCoursesCount extends Instructor {
  courses_count?: number;
}

/**
 * جلب قائمة المدربين العامة من الـ Backend
 */
export async function getInstructors(): Promise<InstructorWithCoursesCount[]> {
  const { data } = await api.get<
    { data: InstructorWithCoursesCount[] } | InstructorWithCoursesCount[]
  >("/instructors");
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray(data.data)) return data.data;
  return [];
}
