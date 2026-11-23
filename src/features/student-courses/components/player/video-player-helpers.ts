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
