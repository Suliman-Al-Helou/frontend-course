import api from "@/lib/api";
import type { Course } from "@/types";

export async function getCourses(): Promise<Course[]> {
  const { data } = await api.get<Course[] | { data: Course[] }>("/courses");
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray(data.data)) return data.data;
  return [];
}