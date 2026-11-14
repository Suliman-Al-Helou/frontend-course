/**
 * Instructors Feature API
 * Pure Axios client functions interacting with instructor endpoints.
 */

import api from "@/lib/api";
import type {
  Instructor,
  InstructorWithCoursesCount,
  InstructorDetail,
  InstructorFormData,
} from "../types";

export async function getInstructors(): Promise<InstructorWithCoursesCount[]> {
  const { data } = await api.get<
    { data: InstructorWithCoursesCount[] } | InstructorWithCoursesCount[]
  >("/instructors");
  if (Array.isArray(data)) return data;
  if (
    data &&
    typeof data === "object" &&
    Array.isArray((data as { data: InstructorWithCoursesCount[] }).data)
  ) {
    return (data as { data: InstructorWithCoursesCount[] }).data;
  }
  return [];
}

export async function getInstructorDetail(id: number | string): Promise<InstructorDetail> {
  const { data } = await api.get<{ data: InstructorDetail } | InstructorDetail>(
    `/instructors/${id}`,
  );
  if (data && typeof data === "object" && "data" in data) {
    return (data as { data: InstructorDetail }).data;
  }
  return data as InstructorDetail;
}

export async function getAdminInstructors(): Promise<Instructor[]> {
  const { data } = await api.get<{ data: Instructor[] } | Instructor[]>("/admin/instructors");
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray((data as { data: Instructor[] }).data)) {
    return (data as { data: Instructor[] }).data;
  }
  return [];
}

export async function createAdminInstructor(payload: InstructorFormData): Promise<Instructor> {
  const { data } = await api.post<{ data: Instructor } | Instructor>("/admin/instructors", payload);
  if (data && typeof data === "object" && "data" in data) {
    return (data as { data: Instructor }).data;
  }
  return data as Instructor;
}

export async function updateAdminInstructor(
  id: number | string,
  payload: Partial<InstructorFormData>,
): Promise<Instructor> {
  const { data } = await api.put<{ data: Instructor } | Instructor>(
    `/admin/instructors/${id}`,
    payload,
  );
  if (data && typeof data === "object" && "data" in data) {
    return (data as { data: Instructor }).data;
  }
  return data as Instructor;
}

export async function deleteAdminInstructor(id: number | string): Promise<void> {
  await api.delete(`/admin/instructors/${id}`);
}
