/**
 * Media Pipeline Feature Domain Types
 * Encapsulating Live Meetings (Zoom), Video Bank Assets, and Streaming Integrations.
 */

import type { components, operations } from "@/types/api.generated";

export type RawZoomMeeting = components["schemas"]["ZoomMeetingResource"];
export type RawZoomMeetingRequest = components["schemas"]["ZoomMeetingRequest"];
export type RawZoomAttendance = components["schemas"]["ZoomAttendance"];
export type RawVideoAsset = components["schemas"]["VideoAssetResource"];
export type RawVideoAssetRequest = components["schemas"]["VideoAssetRequest"];
export type RawChunkUploadRequest = components["schemas"]["ChunkUploadRequest"];
export type RawChunkUploadResponse = operations["adminVideoAsset.uploadChunk"]["responses"][
  | 200
  | 201]["content"]["application/json"];

export interface AttendanceRecord {
  id: number;
  attended_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface AdminZoomMeeting {
  id: number;
  course_id: number;
  course_name?: string;
  title: string;
  description: string | null;
  zoom_link: string;
  starts_at: string;
  duration_minutes?: number;
  attendances_count?: number;
  course?: {
    id: number;
    title: string;
  };
  created_at?: string;
}

export interface ZoomMeetingFormData {
  course_id: number;
  title: string;
  description?: string;
  zoom_link: string;
  starts_at: string;
  duration_minutes?: number;
}

export interface AdminVideoAsset {
  id: number;
  course_id: number;
  zoom_meeting_id?: number | null;
  title: string;
  description?: string | null;
  provider: "youtube" | "bunny" | "cloudflare";
  provider_video_id: string;
  duration_seconds: number;
  type: "recording" | "lesson";
  status?: "uploading" | "processing" | "ready" | "failed";
  created_by?: number;
  course?: {
    id: number;
    title: string;
  };
  zoom_meeting?: {
    id: number;
    title: string;
    starts_at: string;
  } | null;
  creator?: {
    id: number;
    name: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface VideoAssetFormData {
  course_id: number;
  zoom_meeting_id?: number | null;
  title: string;
  description?: string;
  provider: "youtube" | "bunny" | "cloudflare";
  provider_video_id: string;
  duration_seconds: number;
  type: "recording" | "lesson";
}

export interface YouTubeStatus {
  connected: boolean;
  channel_title: string;
}

export interface ChunkUploadParams {
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
}

export interface ChunkUploadResponse {
  completed: boolean;
  progress: number;
  video_asset?: AdminVideoAsset;
}
