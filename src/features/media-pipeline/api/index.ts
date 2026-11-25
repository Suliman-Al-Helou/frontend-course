/**
 * Media Pipeline Feature API
 * Pure Axios client functions interacting with Zoom, Video Assets, and YouTube endpoints.
 * Normalized via Boundary Adapters backed by OpenAPI generated contracts (ADR 0023).
 */

import api from "@/lib/api";
import type { operations } from "@/types/api.generated";
import type {
  AdminZoomMeeting,
  ZoomMeetingFormData,
  AdminVideoAsset,
  VideoAssetFormData,
  YouTubeStatus,
  AttendanceRecord,
  ChunkUploadParams,
  ChunkUploadResponse,
  RawZoomMeeting,
  RawZoomMeetingRequest,
  RawZoomAttendance,
  RawVideoAsset,
  RawVideoAssetRequest,
  RawChunkUploadRequest,
  RawChunkUploadResponse,
} from "../types";

/* ─── Boundary Adapters ────────────────────────────────────── */

function unwrapData<T>(raw: T | { data: T }): T {
  if (raw && typeof raw === "object" && "data" in raw && (raw as { data: unknown }).data) {
    return (raw as { data: T }).data;
  }
  return raw as T;
}

function normalizeProvider(val?: string | null): AdminVideoAsset["provider"] {
  if (val === "bunny" || val === "cloudflare") return val;
  return "youtube";
}

function normalizeAssetType(val?: string | null): AdminVideoAsset["type"] {
  if (val === "recording") return "recording";
  return "lesson";
}

function normalizeAssetStatus(val?: string | null): AdminVideoAsset["status"] {
  if (val === "uploading" || val === "processing" || val === "ready" || val === "failed") {
    return val;
  }
  return undefined;
}

export function toAdminZoomMeeting(
  rawResponse: RawZoomMeeting | { data: RawZoomMeeting } | AdminZoomMeeting,
): AdminZoomMeeting {
  const raw = unwrapData(rawResponse as RawZoomMeeting | AdminZoomMeeting);
  const rawCourseId =
    "course_id" in raw && typeof raw.course_id === "number" ? raw.course_id : (raw.course?.id ?? 0);

  return {
    id: Number(raw.id),
    course_id: Number(rawCourseId),
    course_name: "course_name" in raw ? raw.course_name : raw.course?.title,
    title: raw.title || "",
    description: raw.description ?? null,
    zoom_link: raw.zoom_link || "",
    starts_at: raw.starts_at || "",
    duration_minutes:
      raw.duration_minutes !== undefined && raw.duration_minutes !== null
        ? Number(raw.duration_minutes)
        : undefined,
    attendances_count:
      raw.attendances_count !== undefined && raw.attendances_count !== null
        ? Number(raw.attendances_count)
        : undefined,
    course: raw.course
      ? {
          id: Number(raw.course.id),
          title: raw.course.title,
        }
      : undefined,
    created_at: raw.created_at ?? undefined,
  };
}

export function toAdminVideoAsset(
  rawResponse: RawVideoAsset | { data: RawVideoAsset } | AdminVideoAsset,
): AdminVideoAsset {
  const raw = unwrapData(rawResponse as RawVideoAsset | AdminVideoAsset);

  return {
    id: Number(raw.id),
    course_id: Number(raw.course_id),
    zoom_meeting_id: raw.zoom_meeting_id ?? null,
    title: raw.title || "",
    description: raw.description ?? null,
    provider: normalizeProvider(raw.provider),
    provider_video_id: raw.provider_video_id || "",
    duration_seconds: Number(raw.duration_seconds ?? 0),
    type: normalizeAssetType(raw.type),
    status: normalizeAssetStatus(raw.status),
    created_by: raw.created_by ?? undefined,
    course: raw.course
      ? {
          id: Number(raw.course.id),
          title: raw.course.title,
        }
      : undefined,
    zoom_meeting: raw.zoom_meeting
      ? {
          id: Number(raw.zoom_meeting.id),
          title: raw.zoom_meeting.title,
          starts_at: raw.zoom_meeting.starts_at,
        }
      : null,
    creator: raw.creator
      ? {
          id: Number(raw.creator.id),
          name: raw.creator.name,
        }
      : undefined,
    created_at: raw.created_at ?? undefined,
    updated_at: raw.updated_at ?? undefined,
  };
}

function toAttendanceRecord(
  raw: (RawZoomAttendance & { user?: AttendanceRecord["user"] }) | AttendanceRecord,
): AttendanceRecord {
  const rawUser = raw.user ?? {
    id: Number("user_id" in raw ? raw.user_id : 0),
    name: "",
    email: "",
  };
  return {
    id: Number(raw.id),
    attended_at: raw.attended_at,
    user: {
      id: Number(rawUser.id),
      name: rawUser.name,
      email: rawUser.email,
    },
  };
}

function toChunkUploadResponse(
  raw: RawChunkUploadResponse | ChunkUploadResponse,
): ChunkUploadResponse {
  return {
    completed: Boolean(raw.completed),
    progress: Number(raw.progress ?? 0),
    video_asset:
      "video_asset" in raw && raw.video_asset ? toAdminVideoAsset(raw.video_asset) : undefined,
  };
}

/* ─── 1. Live Zoom Meetings ────────────────────────────────── */

type ZoomMeetingsListResponse =
  | operations["adminZoomMeeting.index"]["responses"][200]["content"]["application/json"]
  | RawZoomMeeting[]
  | AdminZoomMeeting[];

export async function getAdminZoomMeetings(): Promise<AdminZoomMeeting[]> {
  const { data } = await api.get<ZoomMeetingsListResponse>("/admin/zoom-meetings");
  const list = Array.isArray(data)
    ? data
    : data && typeof data === "object" && Array.isArray(data.data)
      ? data.data
      : [];
  return list.map((item) => toAdminZoomMeeting(item));
}

export async function createAdminZoomMeeting(
  payload: ZoomMeetingFormData,
): Promise<AdminZoomMeeting> {
  const requestBody: RawZoomMeetingRequest = payload;
  const { data } = await api.post<
    operations["adminZoomMeeting.store"]["responses"][201]["content"]["application/json"]
  >("/admin/zoom-meetings", requestBody);
  return toAdminZoomMeeting(data);
}

export async function updateAdminZoomMeeting(
  id: number | string,
  payload: Partial<ZoomMeetingFormData>,
): Promise<AdminZoomMeeting> {
  const { data } = await api.put<
    operations["adminZoomMeeting.update"]["responses"][200]["content"]["application/json"]
  >(`/admin/zoom-meetings/${id}`, payload as Partial<RawZoomMeetingRequest>);
  return toAdminZoomMeeting(data);
}

export async function deleteAdminZoomMeeting(id: number | string): Promise<void> {
  await api.delete(`/admin/zoom-meetings/${id}`);
}

type AttendancesListResponse =
  | operations["adminZoomMeeting.attendances"]["responses"][200]["content"]["application/json"]
  | { data: AttendanceRecord[] }
  | AttendanceRecord[];

export async function getZoomMeetingAttendances(id: number | string): Promise<AttendanceRecord[]> {
  const { data } = await api.get<AttendancesListResponse>(`/admin/zoom-meetings/${id}/attendances`);
  const list = Array.isArray(data)
    ? data
    : data && typeof data === "object" && "data" in data && Array.isArray(data.data)
      ? data.data
      : [];
  return list.map((item) => toAttendanceRecord(item));
}

/* ─── 2. Video Assets (Media Bank) ─────────────────────────── */

type VideoAssetsListResponse =
  | operations["adminVideoAsset.index"]["responses"][200]["content"]["application/json"]
  | RawVideoAsset[]
  | AdminVideoAsset[];

export async function getAdminVideoAssets(params?: {
  course_id?: number | string;
  zoom_meeting_id?: number | string;
}): Promise<AdminVideoAsset[]> {
  const { data } = await api.get<VideoAssetsListResponse>("/admin/video-assets", { params });
  const list = Array.isArray(data)
    ? data
    : data && typeof data === "object" && Array.isArray(data.data)
      ? data.data
      : [];
  return list.map((item) => toAdminVideoAsset(item));
}

export async function createAdminVideoAsset(payload: VideoAssetFormData): Promise<AdminVideoAsset> {
  const requestBody: RawVideoAssetRequest = payload;
  const { data } = await api.post<
    operations["adminVideoAsset.store"]["responses"][201]["content"]["application/json"]
  >("/admin/video-assets", requestBody);
  return toAdminVideoAsset(data);
}

export async function updateAdminVideoAsset(
  id: number | string,
  payload: Partial<VideoAssetFormData>,
): Promise<AdminVideoAsset> {
  const { data } = await api.put<
    operations["adminVideoAsset.update"]["responses"][200]["content"]["application/json"]
  >(`/admin/video-assets/${id}`, payload as Partial<RawVideoAssetRequest>);
  return toAdminVideoAsset(data);
}

export async function deleteAdminVideoAsset(id: number | string): Promise<void> {
  await api.delete(`/admin/video-assets/${id}`);
}

/* ─── 3. YouTube OAuth & Channel Integration ──────────────── */

export async function getYouTubeStatus(): Promise<YouTubeStatus> {
  const { data } =
    await api.get<
      operations["adminVideoAsset.youtubeStatus"]["responses"][200]["content"]["application/json"]
    >("/admin/youtube/status");
  return {
    connected: Boolean(data.connected),
    channel_title: data.channel_title ?? "",
  };
}

export async function getYouTubeAuthUrl(): Promise<{ url: string }> {
  const { data } =
    await api.get<
      operations["adminVideoAsset.youtubeAuthUrl"]["responses"][200]["content"]["application/json"]
    >("/admin/youtube/auth-url");
  return data;
}

export async function sendYouTubeCallback(
  code: string,
  state?: string | null,
): Promise<{ status: string; channel_title: string }> {
  const { data } = await api.post<{ status: string; channel_title: string }>(
    "/admin/youtube/callback",
    { code, state },
  );
  return data;
}

export async function disconnectYouTube(): Promise<{ status: string }> {
  const { data } = await api.post<{ status: string }>("/admin/youtube/disconnect");
  return data;
}

/* ─── 4. Chunked Video Ingestion Pipeline ──────────────────── */

function appendChunkField(
  formData: FormData,
  key: keyof RawChunkUploadRequest,
  value: string | Blob,
  fileName?: string,
) {
  if (value instanceof Blob && fileName) {
    formData.append(key, value, fileName);
  } else {
    formData.append(key, value);
  }
}

export async function uploadVideoChunk(params: ChunkUploadParams): Promise<ChunkUploadResponse> {
  const formData = new FormData();
  appendChunkField(formData, "chunk", params.chunk, `chunk_${params.chunkIndex}.part`);
  appendChunkField(formData, "chunk_index", String(params.chunkIndex));
  appendChunkField(formData, "total_chunks", String(params.totalChunks));
  appendChunkField(formData, "upload_id", params.uploadId);
  appendChunkField(formData, "file_name", params.fileName);
  appendChunkField(formData, "course_id", String(params.courseId));
  if (params.zoomMeetingId) {
    appendChunkField(formData, "zoom_meeting_id", String(params.zoomMeetingId));
  }
  appendChunkField(formData, "title", params.title);
  if (params.description) {
    appendChunkField(formData, "description", params.description);
  }
  if (params.type) {
    appendChunkField(formData, "type", params.type);
  }

  const { data } = await api.post<RawChunkUploadResponse>(
    "/admin/video-assets/upload-chunk",
    formData,
    {
      headers: {
        "Content-Type": undefined,
      },
    },
  );
  return toChunkUploadResponse(data);
}
