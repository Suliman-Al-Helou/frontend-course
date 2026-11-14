/**
 * Media Pipeline TanStack Query v5 Factory
 */

import { queryOptions } from "@tanstack/react-query";
import {
  getAdminZoomMeetings,
  getZoomMeetingAttendances,
  getAdminVideoAssets,
  getYouTubeStatus,
} from "../api";
import type { AdminVideoAsset } from "../types";

export const mediaPipelineKeys = {
  all: ["media-pipeline"] as const,
  zoomMeetings: () => [...mediaPipelineKeys.all, "zoom-meetings"] as const,
  attendances: (meetingId: number | string) =>
    [...mediaPipelineKeys.zoomMeetings(), "attendances", String(meetingId)] as const,
  videoAssets: () => [...mediaPipelineKeys.all, "video-assets"] as const,
  videoAssetsFiltered: (params?: {
    course_id?: number | string;
    zoom_meeting_id?: number | string;
  }) => [...mediaPipelineKeys.videoAssets(), params ?? {}] as const,
  youtube: () => [...mediaPipelineKeys.all, "youtube"] as const,
  youtubeStatus: () => [...mediaPipelineKeys.youtube(), "status"] as const,
};

export const mediaPipelineQueries = {
  zoomMeetings: () =>
    queryOptions({
      queryKey: mediaPipelineKeys.zoomMeetings(),
      queryFn: getAdminZoomMeetings,
      staleTime: 1000 * 60 * 2, // 2 minutes
    }),

  attendances: (meetingId: number | string) =>
    queryOptions({
      queryKey: mediaPipelineKeys.attendances(meetingId),
      queryFn: () => getZoomMeetingAttendances(meetingId),
      enabled: Boolean(meetingId),
      staleTime: 1000 * 30, // 30 seconds
    }),

  videoAssets: (params?: { course_id?: number | string; zoom_meeting_id?: number | string }) =>
    queryOptions({
      queryKey: mediaPipelineKeys.videoAssetsFiltered(params),
      queryFn: () => getAdminVideoAssets(params),
      staleTime: 1000 * 60 * 2, // 2 minutes
      refetchInterval: (query) => {
        const data = query.state.data;
        const hasProcessing =
          Array.isArray(data) &&
          data.some((v: AdminVideoAsset) => v.status === "processing" || v.status === "uploading");
        return hasProcessing ? 5000 : false;
      },
    }),

  youtubeStatus: () =>
    queryOptions({
      queryKey: mediaPipelineKeys.youtubeStatus(),
      queryFn: getYouTubeStatus,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }),
};
