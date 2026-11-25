import api from "@/lib/api";
import type { paths } from "@/types/api.generated";

type RawCourseEnrollmentResponse =
  paths["/courses/{course}/enrollment"]["get"]["responses"][200]["content"]["application/json"];

export interface CourseEnrollmentStatus {
  status: "pending" | "approved" | "rejected" | null;
  isEnrolled: boolean;
}

export async function getCourseEnrollment(
  courseId: string | number,
): Promise<CourseEnrollmentStatus> {
  const res = await api.get<
    RawCourseEnrollmentResponse & {
      status?: "pending" | "approved" | "rejected";
      enrolled?: boolean;
    }
  >(`/courses/${courseId}/enrollment`);
  const status = (res.data?.status ?? (res.data?.enrolled ? "approved" : null)) as
    | "pending"
    | "approved"
    | "rejected"
    | null;
  return {
    status,
    isEnrolled: status === "approved" || Boolean(res.data?.enrolled),
  };
}
