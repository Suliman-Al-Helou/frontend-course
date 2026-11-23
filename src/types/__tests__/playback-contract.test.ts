import { describe, it, expect } from "vite-plus/test";
import type { VideoPlaybackPayload, Lesson, LessonDetail } from "@/types";

describe("VideoPlaybackPayload Discriminated Contract", () => {
  it("narrows youtube provider correctly with source and null expires_at", () => {
    const youtubePlayback: VideoPlaybackPayload = {
      provider: "youtube",
      source: "dQw4w9WgXcQ",
      expires_at: null,
    };

    expect(youtubePlayback.provider).toBe("youtube");
    expect(youtubePlayback.source).toBe("dQw4w9WgXcQ");
    expect(youtubePlayback.expires_at).toBeNull();
  });

  it("narrows hls provider correctly with url and iso expires_at timestamp", () => {
    const hlsPlayback: VideoPlaybackPayload = {
      provider: "hls",
      url: "https://video.example.com/stream.m3u8?token=xyz",
      expires_at: "2026-11-23T12:00:00Z",
    };

    expect(hlsPlayback.provider).toBe("hls");
    expect(hlsPlayback.url).toContain(".m3u8");
    expect(hlsPlayback.expires_at).toBe("2026-11-23T12:00:00Z");
  });

  it("allows lesson to have null playback when video is processing or unassigned", () => {
    const lesson: Lesson = {
      id: 101,
      title: "Draft Lesson Under Ingestion",
      duration: 300,
      order: 1,
      is_preview: false,
      is_published: false,
      video_provider: "youtube",
      playback: null,
    };

    expect(lesson.playback).toBeNull();
    expect(lesson.is_published).toBe(false);
  });

  it("supports LessonDetail with extended playback and video_provider", () => {
    const detail: LessonDetail = {
      id: 202,
      title: "Secured HLS Lesson",
      duration: 600,
      order: 2,
      is_preview: true,
      is_published: true,
      video_provider: "hls",
      playback: {
        provider: "hls",
        url: "https://video.example.com/202.m3u8",
        expires_at: "2026-11-23T14:00:00Z",
      },
    };

    expect(detail.playback?.provider).toBe("hls");
    if (detail.playback?.provider === "hls") {
      expect(detail.playback.url).toBe("https://video.example.com/202.m3u8");
    }
  });
});
