/**
 * Media Pipeline Feature API
 * Pure Axios client functions interacting with Zoom, Video Assets, and YouTube endpoints.
 */

import api from "@/lib/api";
import type {
  AdminZoomMeeting,
  ZoomMeetingFormData,
  AdminVideoAsset,
  VideoAssetFormData,
  YouTubeStatus,
  AttendanceRecord,
  ChunkUploadParams,
  ChunkUploadResponse,
} from "../types";

/* ─── 1. Live Zoom Meetings ────────────────────────────────── */

export async function getAdminZoomMeetings(): Promise<AdminZoomMeeting[]> {
  const { data } = await api.get<AdminZoomMeeting[] | { data: AdminZoomMeeting[] }>(
    "/admin/zoom-meetings",
  );
  if (Array.isArray(data)) return data;
  if (
    data &&
    typeof data === "object" &&
    Array.isArray((data as { data: AdminZoomMeeting[] }).data)
  ) {
    return (data as { data: AdminZoomMeeting[] }).data;
  }
  return [];
}

export async function createAdminZoomMeeting(
  payload: ZoomMeetingFormData,
): Promise<AdminZoomMeeting> {
  const { data } = await api.post<AdminZoomMeeting>("/admin/zoom-meetings", payload);
  return data;
}

export async function updateAdminZoomMeeting(
  id: number | string,
  payload: Partial<ZoomMeetingFormData>,
): Promise<AdminZoomMeeting> {
  const { data } = await api.put<AdminZoomMeeting>(`/admin/zoom-meetings/${id}`, payload);
  return data;
}

export async function deleteAdminZoomMeeting(id: number | string): Promise<void> {
  await api.delete(`/admin/zoom-meetings/${id}`);
}

export async function getZoomMeetingAttendances(id: number | string): Promise<AttendanceRecord[]> {
  const { data } = await api.get<AttendanceRecord[] | { data: AttendanceRecord[] }>(
    `/admin/zoom-meetings/${id}/attendances`,
  );
  if (Array.isArray(data)) return data;
  if (
    data &&
    typeof data === "object" &&
    Array.isArray((data as { data: AttendanceRecord[] }).data)
  ) {
    return (data as { data: AttendanceRecord[] }).data;
  }
  return [];
}

/* ─── 2. Video Assets (Media Bank) ─────────────────────────── */

export async function getAdminVideoAssets(params?: {
  course_id?: number | string;
  zoom_meeting_id?: number | string;
}): Promise<AdminVideoAsset[]> {
  const { data } = await api.get<AdminVideoAsset[] | { data: AdminVideoAsset[] }>(
    "/admin/video-assets",
    { params },
  );
  if (Array.isArray(data)) return data;
  if (
    data &&
    typeof data === "object" &&
    Array.isArray((data as { data: AdminVideoAsset[] }).data)
  ) {
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
  payload: Partial<VideoAssetFormData>,
): Promise<AdminVideoAsset> {
  const { data } = await api.put<AdminVideoAsset>(`/admin/video-assets/${id}`, payload);
  return data;
}

export async function deleteAdminVideoAsset(id: number | string): Promise<void> {
  await api.delete(`/admin/video-assets/${id}`);
}

/* ─── 3. YouTube OAuth & Channel Integration ──────────────── */

export async function getYouTubeStatus(): Promise<YouTubeStatus> {
  const { data } = await api.get<YouTubeStatus>("/admin/youtube/status");
  return data;
}

export async function getYouTubeAuthUrl(): Promise<{ url: string }> {
  const { data } = await api.get<{ url: string }>("/admin/youtube/auth-url");
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

export async function uploadVideoChunk(params: ChunkUploadParams): Promise<ChunkUploadResponse> {
  const formData = new FormData();
  formData.append("chunk", params.chunk, `chunk_${params.chunkIndex}.part`);
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

  const { data } = await api.post<ChunkUploadResponse>(
    "/admin/video-assets/upload-chunk",
    formData,
    {
      headers: {
        "Content-Type": undefined,
      },
    },
  );
  return data;
}
