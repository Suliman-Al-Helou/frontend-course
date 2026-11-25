/**
 * Admin Courses Feature API
 * Pure Axios client functions normalized via Boundary Adapters backed by OpenAPI contracts (ADR 0023).
 */

import api from "@/lib/api";
import type { operations } from "@/types/api.generated";
import {
  getAdminZoomMeetings,
  createAdminZoomMeeting,
  updateAdminZoomMeeting,
  deleteAdminZoomMeeting,
  getAdminVideoAssets,
  createAdminVideoAsset,
  updateAdminVideoAsset,
  deleteAdminVideoAsset,
  getYouTubeStatus,
  getYouTubeAuthUrl,
  sendYouTubeCallback,
  disconnectYouTube,
  uploadVideoChunk,
} from "@/features/media-pipeline/api";
import type {
  AdminCourse,
  CourseFormData,
  CourseLevel,
  CourseStatus,
  AdminSection,
  AdminLesson,
  AdminQuestion,
  AdminTaskResponse,
  AdminTaskPayload,
  AdminEnrollment,
  CreateEnrollmentPayload,
  EnrollmentStatus,
  CourseYouTubeVideosResponse,
  RawCourseAdmin,
  RawStoreCourseRequest,
  RawUpdateCourseRequest,
  RawAdminSection,
  RawSectionRequest,
  RawAdminLesson,
  RawLessonRequest,
  RawUpdateLessonRequest,
  RawAdminTask,
  RawEnrollment,
  RawCreateEnrollmentRequest,
  RawUpdateEnrollmentRequest,
} from "../types";

/* ─── Boundary Helpers & Adapters ──────────────────────────── */

function unwrapData<T>(raw: T | { data: T }): T {
  if (raw && typeof raw === "object" && "data" in raw && (raw as { data: unknown }).data) {
    return (raw as { data: T }).data;
  }
  return raw as T;
}

function toStringArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(String);
  if (typeof val === "string" && val.trim()) {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed.map(String) : [val];
    } catch {
      return val.split("\n").filter(Boolean);
    }
  }
  return [];
}

function normalizeLevel(val?: string | null): CourseLevel {
  if (val === "intermediate" || val === "advanced") return val;
  return "beginner";
}

function normalizeStatus(val?: string | null): CourseStatus {
  if (val === "published" || val === "coming_soon") return val;
  return "draft";
}

function normalizeEnrollmentStatus(val?: string | null): EnrollmentStatus {
  if (val === "approved" || val === "rejected") return val;
  return "pending";
}

function toBool(val: unknown): boolean {
  return val === true || val === 1 || val === "1" || val === "true";
}

export function toAdminLesson(raw: RawAdminLesson | AdminLesson): AdminLesson {
  return {
    id: Number(raw.id),
    section_id: raw.section_id !== undefined ? Number(raw.section_id) : undefined,
    title: raw.title || "",
    video_id: raw.video_id ?? null,
    duration: Number(raw.duration ?? 0),
    order: Number(raw.order ?? 0),
    is_preview: Boolean(raw.is_preview),
  };
}

export function toAdminSection(
  rawResponse: RawAdminSection | { data: RawAdminSection } | AdminSection,
): AdminSection {
  const raw = unwrapData(rawResponse as RawAdminSection | AdminSection);
  return {
    id: Number(raw.id),
    course_id: raw.course_id !== undefined ? Number(raw.course_id) : undefined,
    title: raw.title || "",
    order: Number(raw.order ?? 0),
    lessons: Array.isArray(raw.lessons) ? raw.lessons.map((l) => toAdminLesson(l)) : [],
  };
}

export function toAdminCourse(
  rawResponse: RawCourseAdmin | { data: RawCourseAdmin } | AdminCourse,
): AdminCourse {
  const raw = unwrapData(rawResponse as RawCourseAdmin | AdminCourse);
  const rawRecord = raw as unknown as Record<string, unknown>;
  const rawSections = Array.isArray(rawRecord.sections) ? rawRecord.sections : undefined;

  return {
    id: Number(raw.id),
    title: raw.title || "",
    description: raw.description || "",
    cover_image: raw.cover_image ?? null,
    level: normalizeLevel(raw.level),
    status: normalizeStatus(raw.status),
    total_duration: Number(raw.total_duration ?? 0),
    requirements: raw.requirements,
    what_you_learn: toStringArray(raw.what_you_learn),
    target_audience: raw.target_audience,
    students_count: raw.students_count !== undefined ? Number(raw.students_count) : undefined,
    enrollments_count:
      raw.enrollments_count !== undefined ? Number(raw.enrollments_count) : undefined,
    rating: raw.rating !== undefined ? Number(raw.rating) : undefined,
    is_popular: raw.is_popular !== undefined ? toBool(raw.is_popular) : undefined,
    price: raw.price !== undefined ? Number(raw.price) : undefined,
    is_public: raw.is_public !== undefined ? toBool(raw.is_public) : undefined,
    youtube_playlist_id: raw.youtube_playlist_id ?? null,
    hot: typeof rawRecord.hot === "boolean" ? rawRecord.hot : undefined,
    instructor: raw.instructor
      ? {
          id: Number(raw.instructor.id),
          name: raw.instructor.name,
        }
      : null,
    instructor_id:
      rawRecord.instructor_id !== undefined
        ? (rawRecord.instructor_id as number | string)
        : raw.instructor
          ? Number(raw.instructor.id)
          : undefined,
    sections: rawSections
      ? rawSections.map((s) => toAdminSection(s as RawAdminSection))
      : undefined,
    created_at: raw.created_at ?? undefined,
    updated_at: raw.updated_at ?? undefined,
  };
}

function toStoreCoursePayload(payload: CourseFormData): RawStoreCourseRequest {
  const parsedInstructorId = payload.instructor_id ? Number(payload.instructor_id) : 0;
  return {
    title: payload.title,
    description: payload.description,
    cover_image: payload.cover_image?.trim() ? payload.cover_image.trim() : null,
    level: payload.level,
    status: payload.status,
    instructor_id: Number.isFinite(parsedInstructorId) ? parsedInstructorId : 0,
    rating: payload.rating,
    is_popular: payload.is_popular,
    total_duration: payload.total_duration,
    price: payload.price,
    is_public: payload.is_public,
    what_you_learn: payload.what_you_learn,
    requirements: payload.requirements,
    target_audience: payload.target_audience,
  };
}

function toUpdateCoursePayload(payload: CourseFormData): RawUpdateCourseRequest {
  const parsedInstructorId = payload.instructor_id ? Number(payload.instructor_id) : null;
  return {
    title: payload.title,
    description: payload.description,
    cover_image: payload.cover_image?.trim() ? payload.cover_image.trim() : null,
    level: payload.level,
    status: payload.status,
    instructor_id:
      parsedInstructorId !== null && Number.isFinite(parsedInstructorId)
        ? parsedInstructorId
        : null,
    rating: payload.rating,
    is_popular: payload.is_popular,
    total_duration: payload.total_duration,
    price: payload.price,
    is_public: payload.is_public,
    what_you_learn: payload.what_you_learn,
    requirements: payload.requirements,
    target_audience: payload.target_audience,
  };
}

export function toAdminTaskResponse(raw: RawAdminTask | AdminTaskResponse): AdminTaskResponse {
  return {
    id: raw.id !== undefined ? Number(raw.id) : undefined,
    lesson_id: raw.lesson_id !== undefined ? Number(raw.lesson_id) : undefined,
    questions: Array.isArray(raw.questions) ? (raw.questions as AdminQuestion[]) : [],
    pass_percentage: Number(raw.pass_percentage ?? 70),
    max_attempts: Number(raw.max_attempts ?? 3),
  };
}

export function toAdminEnrollment(
  rawResponse:
    | RawEnrollment
    | { data: RawEnrollment }
    | { enrollment: RawEnrollment }
    | AdminEnrollment,
): AdminEnrollment {
  const raw =
    rawResponse && typeof rawResponse === "object" && "enrollment" in rawResponse
      ? (rawResponse as { enrollment: RawEnrollment }).enrollment
      : unwrapData(rawResponse as RawEnrollment | AdminEnrollment);

  const rawUserId =
    "user_id" in raw && typeof raw.user_id === "number" ? raw.user_id : (raw.user?.id ?? 0);
  const rawCourseId =
    "course_id" in raw && typeof raw.course_id === "number" ? raw.course_id : (raw.course?.id ?? 0);

  return {
    id: Number(raw.id),
    user_id: Number(rawUserId),
    course_id: Number(rawCourseId),
    status: normalizeEnrollmentStatus(raw.status),
    payment_confirmed: raw.payment_confirmed,
    created_at: raw.created_at ?? "",
    user: raw.user
      ? {
          id: Number(raw.user.id),
          name: raw.user.name,
          email: raw.user.email,
        }
      : undefined,
    course: raw.course
      ? {
          id: Number(raw.course.id),
          title: raw.course.title,
          price: raw.course.price,
          level: normalizeLevel(raw.course.level),
        }
      : undefined,
    student_name: raw.student_name,
    student_email: raw.student_email,
    course_title: raw.course_title,
  };
}

/* ─── 1. Courses CRUD API ──────────────────────────────────── */

type AdminCoursesListResponse =
  | operations["adminCourse.index"]["responses"][200]["content"]["application/json"]
  | RawCourseAdmin[]
  | AdminCourse[];

export async function getAdminCourses(): Promise<AdminCourse[]> {
  const { data } = await api.get<AdminCoursesListResponse>("/admin/courses");
  const list = Array.isArray(data)
    ? data
    : data && typeof data === "object" && Array.isArray(data.data)
      ? data.data
      : [];
  return list.map((item) => toAdminCourse(item));
}

export async function getAdminCourseById(id: number | string): Promise<AdminCourse> {
  const { data } = await api.get<
    | operations["adminCourse.show"]["responses"][200]["content"]["application/json"]
    | { data: RawCourseAdmin }
  >(`/admin/courses/${id}`);
  return toAdminCourse(data);
}

export async function createAdminCourse(payload: CourseFormData): Promise<AdminCourse> {
  const requestBody = toStoreCoursePayload(payload);
  const { data } = await api.post<
    | operations["adminCourse.store"]["responses"][201]["content"]["application/json"]
    | { data: RawCourseAdmin }
  >("/admin/courses", requestBody);
  return toAdminCourse(data);
}

export async function updateAdminCourse(
  id: number | string,
  payload: CourseFormData,
): Promise<AdminCourse> {
  const requestBody = toUpdateCoursePayload(payload);
  const { data } = await api.put<
    | operations["adminCourse.update"]["responses"][200]["content"]["application/json"]
    | { data: RawCourseAdmin }
  >(`/admin/courses/${id}`, requestBody);
  return toAdminCourse(data);
}

export async function deleteAdminCourse(id: number | string): Promise<void> {
  await api.delete(`/admin/courses/${id}`);
}

/* ─── 2. Sections API ──────────────────────────────────────── */

export async function getCourseSections(courseId: number | string): Promise<AdminSection[]> {
  const { data } = await api.get<
    operations["section.index"]["responses"][200]["content"]["application/json"]
  >(`/admin/courses/${courseId}/sections`);
  return Array.isArray(data.sections) ? data.sections.map((s) => toAdminSection(s)) : [];
}

export async function createCourseSection(
  courseId: number | string,
  payload: { title: string; order: number },
): Promise<AdminSection> {
  const requestBody: RawSectionRequest = payload;
  const { data } = await api.post<
    operations["section.store"]["responses"][201]["content"]["application/json"]
  >(`/admin/courses/${courseId}/sections`, requestBody);
  return toAdminSection(data);
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
  },
): Promise<AdminLesson> {
  const requestBody: RawLessonRequest = payload;
  const { data } = await api.post<
    operations["lesson.store"]["responses"][201]["content"]["application/json"]
  >(`/admin/sections/${sectionId}/lessons`, requestBody);
  return toAdminLesson(data);
}

export async function updateCourseLesson(
  lessonId: number | string,
  payload: Partial<AdminLesson>,
): Promise<AdminLesson> {
  const requestBody: RawUpdateLessonRequest = {
    title: payload.title,
    video_id: payload.video_id,
    duration: payload.duration,
    order: payload.order,
    is_preview: payload.is_preview,
  };
  const { data } = await api.put<
    operations["lesson.update"]["responses"][200]["content"]["application/json"]
  >(`/admin/lessons/${lessonId}`, requestBody);
  return toAdminLesson(data);
}

export async function deleteCourseLesson(lessonId: number | string): Promise<void> {
  await api.delete(`/admin/lessons/${lessonId}`);
}

/* ─── 4. Lesson Tasks API ──────────────────────────────────── */

export async function getAdminLessonTask(
  lessonId: number | string,
): Promise<AdminTaskResponse | null> {
  try {
    const { data } = await api.get<
      operations["lesson.getTask"]["responses"][200]["content"]["application/json"]
    >(`/admin/lessons/${lessonId}/task`);
    return data ? toAdminTaskResponse(data) : null;
  } catch {
    return null;
  }
}

export async function saveAdminLessonTask(
  lessonId: number | string,
  payload: AdminTaskPayload,
  isUpdate: boolean,
): Promise<AdminTaskResponse> {
  if (isUpdate) {
    const { data } = await api.put<
      operations["lesson.updateTask"]["responses"][200]["content"]["application/json"]
    >(`/admin/lessons/${lessonId}/task`, payload);
    return toAdminTaskResponse(data);
  }
  const { data } = await api.post<
    operations["lesson.storeTask"]["responses"][201]["content"]["application/json"]
  >(`/admin/lessons/${lessonId}/task`, payload);
  return toAdminTaskResponse(data);
}

/* ─── 5. Enrollments API ───────────────────────────────────── */

type AdminEnrollmentsListResponse =
  | operations["enrollment.index"]["responses"][200]["content"]["application/json"]
  | RawEnrollment[]
  | AdminEnrollment[];

export async function getAdminEnrollments(): Promise<AdminEnrollment[]> {
  const { data } = await api.get<AdminEnrollmentsListResponse>("/admin/enrollments");
  const list = Array.isArray(data)
    ? data
    : data && typeof data === "object" && Array.isArray(data.data)
      ? data.data
      : [];
  return list.map((item) => toAdminEnrollment(item));
}

export async function updateEnrollmentStatus(
  id: number | string,
  status: EnrollmentStatus,
  paymentConfirmed: boolean,
): Promise<AdminEnrollment> {
  if (status === "pending") {
    throw new Error("Invalid status transition: enrollment updates require approved or rejected.");
  }
  const requestBody: RawUpdateEnrollmentRequest = {
    status,
    payment_confirmed: paymentConfirmed,
  };
  const { data } = await api.patch<
    operations["enrollment.update"]["responses"][200]["content"]["application/json"]
  >(`/admin/enrollments/${id}`, requestBody);
  return toAdminEnrollment(data);
}

export async function createAdminEnrollment(
  payload: CreateEnrollmentPayload,
): Promise<AdminEnrollment> {
  const requestBody: RawCreateEnrollmentRequest = payload;
  const { data } = await api.post<
    operations["enrollment.store"]["responses"][201]["content"]["application/json"]
  >("/admin/enrollments", requestBody);
  return toAdminEnrollment(data);
}

/* ─── 6–9. Shared Media Pipeline Delegations ───────────────── */

export {
  getAdminZoomMeetings,
  createAdminZoomMeeting,
  updateAdminZoomMeeting,
  deleteAdminZoomMeeting,
  getAdminVideoAssets,
  createAdminVideoAsset,
  updateAdminVideoAsset,
  deleteAdminVideoAsset,
  getYouTubeStatus,
  getYouTubeAuthUrl,
  sendYouTubeCallback,
  disconnectYouTube,
  uploadVideoChunk,
};

/* ─── 10. Course YouTube Playlist Videos ────────────────────── */

export async function getCourseYouTubeVideos(
  courseId: number | string,
  refresh = false,
): Promise<CourseYouTubeVideosResponse> {
  const { data } = await api.get<CourseYouTubeVideosResponse>(
    `/admin/courses/${courseId}/youtube-videos`,
    {
      params: refresh ? { refresh: 1 } : undefined,
    },
  );
  return data;
}

export async function createCourseYouTubePlaylist(
  courseId: number | string,
): Promise<{ message: string; playlist_id: string }> {
  const { data } = await api.post<{ message: string; playlist_id: string }>(
    `/admin/courses/${courseId}/youtube-playlist`,
  );
  return data;
}
