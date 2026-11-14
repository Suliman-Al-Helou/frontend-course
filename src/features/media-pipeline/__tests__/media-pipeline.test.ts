import { describe, it, expect, vi } from "vite-plus/test";

vi.mock("@/lib/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import {
  mediaPipelineQueries,
  mediaPipelineKeys,
} from "../queries/mediaPipeline.queries";
import type { AdminVideoAsset } from "../types";

describe("Media Pipeline Query Factory & Caching", () => {
  it("generates correct queryKey and staleTime for zoom meetings", () => {
    const query = mediaPipelineQueries.zoomMeetings();
    expect(query.queryKey).toEqual(["media-pipeline", "zoom-meetings"]);
    expect(query.staleTime).toBe(1000 * 60 * 2);
  });

  it("generates correct queryKey and enabled condition for attendances", () => {
    const query = mediaPipelineQueries.attendances(42);
    expect(query.queryKey).toEqual(["media-pipeline", "zoom-meetings", "attendances", "42"]);
    expect(query.enabled).toBe(true);

    const disabledQuery = mediaPipelineQueries.attendances(0);
    expect(disabledQuery.enabled).toBe(false);
  });

  it("generates filtered queryKey for video assets", () => {
    const allQuery = mediaPipelineQueries.videoAssets();
    expect(allQuery.queryKey).toEqual(["media-pipeline", "video-assets", {}]);

    const filteredQuery = mediaPipelineQueries.videoAssets({ course_id: 10 });
    expect(filteredQuery.queryKey).toEqual(["media-pipeline", "video-assets", { course_id: 10 }]);
  });

  it("dynamically configures adaptive polling when assets are processing", () => {
    const query = mediaPipelineQueries.videoAssets();
    const refetchIntervalFn = query.refetchInterval as (q: { state: { data: unknown } }) => number | false;

    // Ready video -> No polling
    const readyMock = [{ id: 1, status: "ready" }] as AdminVideoAsset[];
    expect(refetchIntervalFn({ state: { data: readyMock } })).toBe(false);

    // Processing video -> 5s adaptive polling
    const processingMock = [
      { id: 1, status: "ready" },
      { id: 2, status: "processing" },
    ] as AdminVideoAsset[];
    expect(refetchIntervalFn({ state: { data: processingMock } })).toBe(5000);

    // Uploading video -> 5s adaptive polling
    const uploadingMock = [{ id: 3, status: "uploading" }] as AdminVideoAsset[];
    expect(refetchIntervalFn({ state: { data: uploadingMock } })).toBe(5000);
  });

  it("generates correct queryKey for youtube connection status", () => {
    const query = mediaPipelineQueries.youtubeStatus();
    expect(query.queryKey).toEqual(["media-pipeline", "youtube", "status"]);
    expect(query.staleTime).toBe(1000 * 60 * 5);
  });

  it("maintains consistent root query key for atomic cache invalidation", () => {
    const rootKey = mediaPipelineKeys.all[0];
    expect(mediaPipelineQueries.zoomMeetings().queryKey[0]).toBe(rootKey);
    expect(mediaPipelineQueries.videoAssets().queryKey[0]).toBe(rootKey);
    expect(mediaPipelineQueries.youtubeStatus().queryKey[0]).toBe(rootKey);
  });
});
