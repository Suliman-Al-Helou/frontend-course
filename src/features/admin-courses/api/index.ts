import api from "@/lib/api";
import type {
  AdminCourse,
  CourseFormData,
  AdminSection,
  AdminLesson,
  AdminTaskResponse,
  AdminTaskPayload,
  AdminEnrollment,
  CreateEnrollmentPayload,
  EnrollmentStatus,
  AdminVideoAsset,
  VideoAssetFormData,
  AdminZoomMeeting,
  ZoomMeetingFormData,
} from "../types";

/* ─── 1. Courses CRUD API ──────────────────────────────────── */

export async function getAdminCourses(): Promise<AdminCourse[]> {
  const { data } = await api.get<AdminCourse[] | { data: AdminCourse[] }>("/admin/courses");
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray((data as { data: AdminCourse[] }).data)) {
    return (data as { data: AdminCourse[] }).data;
  }
  return [];
}

export async function getAdminCourseById(id: number | string): Promise<AdminCourse> {
  const { data } = await api.get<AdminCourse | { data: AdminCourse }>(`/admin/courses/${id}`);
  if (data && typeof data === "object" && "data" in data) {
    return (data as { data: AdminCourse }).data;
  }
  return data as AdminCourse;
}

export async function createAdminCourse(payload: CourseFormData): Promise<AdminCourse> {
  const { data } = await api.post("/admin/courses", payload);
  return data;
}

export async function updateAdminCourse(
  id: number | string,
  payload: CourseFormData
): Promise<AdminCourse> {
  const { data } = await api.put(`/admin/courses/${id}`, payload);
  return data;
}

export async function deleteAdminCourse(id: number | string): Promise<void> {
  await api.delete(`/admin/courses/${id}`);
}

/* ─── 2. Sections API ──────────────────────────────────────── */

export async function getCourseSections(courseId: number | string): Promise<AdminSection[]> {
  const { data } = await api.get<{ sections: AdminSection[] }>(`/admin/courses/${courseId}/sections`);
  return data.sections ?? [];
}

export async function createCourseSection(
  courseId: number | string,
  payload: { title: string; order: number }
): Promise<AdminSection> {
  const { data } = await api.post(`/admin/courses/${courseId}/sections`, payload);
  return data;
}

export async function deleteCourseSection(sectionId: number | string): Promise<void> {
  await api.delete(`/admin/sections/${sectionId}`);
}

/* ─── 3. Lessons API ───────────────────────────────────────── */

export async function createCourseLesson(
  sectionId: number | string,
  payload: {
    title: string;
    video_id: string;
    duration: number;
    order: number;
    is_preview: boolean;
  }
): Promise<AdminLesson> {
  const { data } = await api.post(`/admin/sections/${sectionId}/lessons`, payload);
  return data;
}

export async function updateCourseLesson(
  lessonId: number | string,
  payload: Partial<AdminLesson>
): Promise<AdminLesson> {
  const { data } = await api.put(`/admin/lessons/${lessonId}`, payload);
  return data;
}

export async function deleteCourseLesson(lessonId: number | string): Promise<void> {
  await api.delete(`/admin/lessons/${lessonId}`);
}

/* ─── 4. Lesson Tasks API ──────────────────────────────────── */

export async function getAdminLessonTask(lessonId: number | string): Promise<AdminTaskResponse | null> {
  try {
    const { data } = await api.get<AdminTaskResponse>(`/admin/lessons/${lessonId}/task`);
    return data ?? null;
  } catch {
    return null;
  }
}

export async function saveAdminLessonTask(
  lessonId: number | string,
  payload: AdminTaskPayload,
  isUpdate: boolean
): Promise<AdminTaskResponse> {
  if (isUpdate) {
    const { data } = await api.put<AdminTaskResponse>(`/admin/lessons/${lessonId}/task`, payload);
    return data;
  }
  const { data } = await api.post<AdminTaskResponse>(`/admin/lessons/${lessonId}/task`, payload);
  return data;
}

/* ─── 5. Enrollments API ───────────────────────────────────── */

export async function getAdminEnrollments(): Promise<AdminEnrollment[]> {
  const { data } = await api.get<AdminEnrollment[] | { data: AdminEnrollment[] }>("/admin/enrollments");
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray((data as { data: AdminEnrollment[] }).data)) {
    return (data as { data: AdminEnrollment[] }).data;
  }
  return [];
}

export async function updateEnrollmentStatus(
  id: number | string,
  status: EnrollmentStatus,
  paymentConfirmed: boolean
): Promise<AdminEnrollment> {
  const { data } = await api.patch<AdminEnrollment>(`/admin/enrollments/${id}`, {
    status,
    payment_confirmed: paymentConfirmed,
  });
  return data;
}

export async function createAdminEnrollment(
  payload: CreateEnrollmentPayload
): Promise<AdminEnrollment> {
  const { data } = await api.post<AdminEnrollment>("/admin/enrollments", payload);
  return data;
}

/* ─── 6. Zoom Meetings API ─────────────────────────────────── */

export async function getAdminZoomMeetings(): Promise<AdminZoomMeeting[]> {
  const { data } = await api.get<AdminZoomMeeting[] | { data: AdminZoomMeeting[] }>("/admin/zoom-meetings");
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray((data as { data: AdminZoomMeeting[] }).data)) {
    return (data as { data: AdminZoomMeeting[] }).data;
  }
  return [];
}

export async function createAdminZoomMeeting(payload: ZoomMeetingFormData): Promise<AdminZoomMeeting> {
  const { data } = await api.post<AdminZoomMeeting>("/admin/zoom-meetings", payload);
  return data;
}

export async function updateAdminZoomMeeting(
  id: number | string,
  payload: Partial<ZoomMeetingFormData>
): Promise<AdminZoomMeeting> {
  const { data } = await api.put<AdminZoomMeeting>(`/admin/zoom-meetings/${id}`, payload);
  return data;
}

export async function deleteAdminZoomMeeting(id: number | string): Promise<void> {
  await api.delete(`/admin/zoom-meetings/${id}`);
}

/* ─── 7. Video Assets API ──────────────────────────────────── */

export async function getAdminVideoAssets(params?: {
  course_id?: number | string;
  zoom_meeting_id?: number | string;
}): Promise<AdminVideoAsset[]> {
  const { data } = await api.get<AdminVideoAsset[] | { data: AdminVideoAsset[] }>("/admin/video-assets", {
    params,
  });
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray((data as { data: AdminVideoAsset[] }).data)) {
    return (data as { data: AdminVideoAsset[] }).data;
  }
  return [];
}

export async function createAdminVideoAsset(payload: VideoAssetFormData): Promise<AdminVideoAsset> {
  const { data } = await api.post<AdminVideoAsset>("/admin/video-assets", payload);
  return data;
}

export async function updateAdminVideoAsset(
  id: number | string,
  payload: Partial<VideoAssetFormData>
): Promise<AdminVideoAsset> {
  const { data } = await api.put<AdminVideoAsset>(`/admin/video-assets/${id}`, payload);
  return data;
}

export async function deleteAdminVideoAsset(id: number | string): Promise<void> {
  await api.delete(`/admin/video-assets/${id}`);
}

/* ─── 8. YouTube Integration API ──────────────────────────── */

export async function getYouTubeStatus(): Promise<{ connected: boolean; channel_title: string }> {
  const { data } = await api.get<{ connected: boolean; channel_title: string }>("/admin/youtube/status");
  return data;
}

export async function getYouTubeAuthUrl(): Promise<{ url: string }> {
  const { data } = await api.get<{ url: string }>("/admin/youtube/auth-url");
  return data;
}

export async function sendYouTubeCallback(code: string): Promise<{ status: string; channel_title: string }> {
  const { data } = await api.post<{ status: string; channel_title: string }>("/admin/youtube/callback", { code });
  return data;
}

export async function disconnectYouTube(): Promise<{ status: string }> {
  const { data } = await api.post<{ status: string }>("/admin/youtube/disconnect");
  return data;
}

/* ─── 9. Chunked Video File Upload ─────────────────────────── */

export async function uploadVideoChunk(params: {
  chunk: Blob;
  chunkIndex: number;
  totalChunks: number;
  uploadId: string;
  fileName: string;
  courseId: number;
  zoomMeetingId?: number | null;
  title: string;
  description?: string;
  type?: "recording" | "lesson";
}): Promise<{ completed: boolean; progress: number; video_asset?: AdminVideoAsset }> {
  const formData = new FormData();
  formData.append("chunk", params.chunk);
  formData.append("chunk_index", String(params.chunkIndex));
  formData.append("total_chunks", String(params.totalChunks));
  formData.append("upload_id", params.uploadId);
  formData.append("file_name", params.fileName);
  formData.append("course_id", String(params.courseId));
  if (params.zoomMeetingId) {
    formData.append("zoom_meeting_id", String(params.zoomMeetingId));
  }
  formData.append("title", params.title);
  if (params.description) {
    formData.append("description", params.description);
  }
  if (params.type) {
    formData.append("type", params.type);
  }

  const { data } = await api.post("/admin/video-assets/upload-chunk", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}



