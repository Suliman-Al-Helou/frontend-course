import type { VideoPlaybackPayload } from "@/types";

/**
 * Resolves the active playback target, giving precedence to explicit
 * VideoPlaybackPayload contracts and falling back to legacy videoId.
 */
export function resolvePlaybackTarget(
  playback?: VideoPlaybackPayload | null,
  videoId?: string | null,
): VideoPlaybackPayload | null {
  if (playback && playback.provider) {
    return playback;
  }

  if (videoId && videoId.trim().length > 0) {
    return {
      provider: "youtube",
      source: videoId.trim(),
      expires_at: null,
    };
  }

  return null;
}

/**
 * Evaluates whether a signed stream has expired based on its ISO 8601 expiry timestamp.
 */
export function isStreamExpired(expiresAt?: string | null): boolean {
  if (!expiresAt) {
    return false;
  }

  const expiryTime = new Date(expiresAt).getTime();
  if (Number.isNaN(expiryTime)) {
    return false;
  }

  return Date.now() >= expiryTime;
}

/**
 * Determines whether an HLS progress report should be throttled to prevent DoS flooding.
 */
export function shouldThrottleProgressReport(
  lastReportedTime: number,
  now: number = Date.now(),
  minIntervalMs: number = 5000,
): boolean {
  return now - lastReportedTime < minIntervalMs;
}

/**
 * Formats user watermark identity string for intellectual property protection.
 */
export function formatWatermarkText(user?: { name: string; email: string } | null): string | null {
  if (!user || (!user.name && !user.email)) {
    return null;
  }
  return `${user.name} • ${user.email}`;
}
