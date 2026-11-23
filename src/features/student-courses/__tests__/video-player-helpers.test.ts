import { describe, it, expect } from "vite-plus/test";
import {
  resolvePlaybackTarget,
  isStreamExpired,
  shouldThrottleProgressReport,
  formatWatermarkText,
} from "../components/player/video-player-helpers";
import type { VideoPlaybackPayload } from "@/types";

describe("VideoPlayer Helpers (TB 05, 06, 07)", () => {
  describe("resolvePlaybackTarget", () => {
    it("returns null when neither playback nor videoId is present", () => {
      expect(resolvePlaybackTarget(null, undefined)).toBeNull();
      expect(resolvePlaybackTarget(undefined, "")).toBeNull();
    });

    it("falls back to youtube provider when only videoId is supplied", () => {
      const target = resolvePlaybackTarget(null, "dQw4w9WgXcQ");
      expect(target).toEqual({
        provider: "youtube",
        source: "dQw4w9WgXcQ",
        expires_at: null,
      });
    });

    it("prioritizes explicit playback payload over fallback videoId", () => {
      const hlsPayload: VideoPlaybackPayload = {
        provider: "hls",
        url: "https://video.example.com/stream.m3u8",
        expires_at: "2026-11-23T18:00:00Z",
      };

      const target = resolvePlaybackTarget(hlsPayload, "fallbackYoutubeId");
      expect(target).toEqual(hlsPayload);
      expect(target?.provider).toBe("hls");
    });
  });

  describe("isStreamExpired", () => {
    it("returns false for youtube with null expires_at", () => {
      expect(isStreamExpired(null)).toBe(false);
    });

    it("returns true for ISO timestamps that have elapsed", () => {
      const pastTime = new Date(Date.now() - 60000).toISOString();
      expect(isStreamExpired(pastTime)).toBe(true);
    });

    it("returns false for ISO timestamps in the future", () => {
      const futureTime = new Date(Date.now() + 3600000).toISOString();
      expect(isStreamExpired(futureTime)).toBe(false);
    });
  });

  describe("shouldThrottleProgressReport", () => {
    it("throttles calls made within the minimum interval", () => {
      const baseTime = 100000;
      expect(shouldThrottleProgressReport(baseTime, baseTime + 1000, 5000)).toBe(true);
      expect(shouldThrottleProgressReport(baseTime, baseTime + 4999, 5000)).toBe(true);
    });

    it("allows progress calls that meet or exceed the minimum interval", () => {
      const baseTime = 100000;
      expect(shouldThrottleProgressReport(baseTime, baseTime + 5000, 5000)).toBe(false);
      expect(shouldThrottleProgressReport(baseTime, baseTime + 8000, 5000)).toBe(false);
    });
  });

  describe("formatWatermarkText", () => {
    it("formats user details with separator", () => {
      expect(formatWatermarkText({ name: "Alan Turing", email: "alan@example.com" })).toBe(
        "Alan Turing • alan@example.com",
      );
    });

    it("returns null when user is null or missing credentials", () => {
      expect(formatWatermarkText(null)).toBeNull();
      expect(formatWatermarkText(undefined)).toBeNull();
      expect(formatWatermarkText({ name: "", email: "" })).toBeNull();
    });
  });
});
