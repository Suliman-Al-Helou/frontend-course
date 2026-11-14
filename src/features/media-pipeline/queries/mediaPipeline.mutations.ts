/**
 * Media Pipeline TanStack Query v5 Mutations Hook
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAdminZoomMeeting,
  updateAdminZoomMeeting,
  deleteAdminZoomMeeting,
  createAdminVideoAsset,
  updateAdminVideoAsset,
  deleteAdminVideoAsset,
  disconnectYouTube,
  sendYouTubeCallback,
} from "../api";
import { mediaPipelineKeys } from "./mediaPipeline.queries";
import type { ZoomMeetingFormData, VideoAssetFormData } from "../types";

export function useZoomMeetingMutations() {
  const queryClient = useQueryClient();

  const createMeeting = useMutation({
    mutationFn: (payload: ZoomMeetingFormData) => createAdminZoomMeeting(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: mediaPipelineKeys.zoomMeetings() });
    },
  });

  const updateMeeting = useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: Partial<ZoomMeetingFormData> }) =>
      updateAdminZoomMeeting(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: mediaPipelineKeys.zoomMeetings() });
    },
  });

  const deleteMeeting = useMutation({
    mutationFn: (id: number | string) => deleteAdminZoomMeeting(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: mediaPipelineKeys.zoomMeetings() });
    },
  });

  return { createMeeting, updateMeeting, deleteMeeting };
}

export function useVideoAssetMutations() {
  const queryClient = useQueryClient();

  const createAsset = useMutation({
    mutationFn: (payload: VideoAssetFormData) => createAdminVideoAsset(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: mediaPipelineKeys.videoAssets() });
    },
  });

  const updateAsset = useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: Partial<VideoAssetFormData> }) =>
      updateAdminVideoAsset(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: mediaPipelineKeys.videoAssets() });
    },
  });

  const deleteAsset = useMutation({
    mutationFn: (id: number | string) => deleteAdminVideoAsset(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: mediaPipelineKeys.videoAssets() });
    },
  });

  return { createAsset, updateAsset, deleteAsset };
}

export function useYouTubeMutations() {
  const queryClient = useQueryClient();

  const disconnect = useMutation({
    mutationFn: disconnectYouTube,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: mediaPipelineKeys.youtube() });
    },
  });

  const callback = useMutation({
    mutationFn: ({ code, state }: { code: string; state?: string | null }) =>
      sendYouTubeCallback(code, state),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: mediaPipelineKeys.youtube() });
    },
  });

  return { disconnect, callback };
}
