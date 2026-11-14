import api from "@/lib/api";

export interface CourseEnrollmentStatus {
  status: "pending" | "approved" | "rejected" | null;
  isEnrolled: boolean;
}

export async function getCourseEnrollment(
  courseId: string | number,
): Promise<CourseEnrollmentStatus> {
  const res = await api.get<{ status?: "pending" | "approved" | "rejected"; enrolled?: boolean }>(
    `/courses/${courseId}/enrollment`,
  );
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
