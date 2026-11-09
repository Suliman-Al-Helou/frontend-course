import api from "@/lib/api";
import type { Course } from "@/types";

/**
 * خيارات استعلام الكورسات العامة (الحد الأقصى أو تصفية المستوى)
 */
export interface GetCoursesParams {
  limit?: number;
  level?: string;
}

export async function getCourses(params?: GetCoursesParams): Promise<Course[]> {
  // تمرير params لـ Axios لتطبيق الـ limit أو الـ filter على الـ API
  const { data } = await api.get<Course[] | { data: Course[] }>("/courses", { params });
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray(data.data)) return data.data;
  return [];
}
