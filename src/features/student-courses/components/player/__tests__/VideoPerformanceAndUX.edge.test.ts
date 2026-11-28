import { describe, expect, it } from "vitest";

/**
 * Phase 2 (SUL-11) TDD: Edge cases first for:
 * - Resume playback (last_position)
 * - Double-click fullscreen toggle
 * - Versioned queryKey + staleTime: Infinity
 * - HLS.js buffering/ABR config
 */
describe("VideoPerformanceAndUX (SUL-11 Edge Cases)", () => {
  it("edge: clamps initialPosition to [0, duration - 1] so resume never seeks past end", () => {
    const clampResume = (pos: number | undefined, duration: number) => {
      if (!pos || pos <= 0 || !duration) return 0;
      return Math.min(pos, Math.max(0, duration - 1));
    };

    expect(clampResume(0, 120)).toBe(0);
    expect(clampResume(undefined, 120)).toBe(0);
    expect(clampResume(150, 120)).toBe(119);
    expect(clampResume(45, 120)).toBe(45);
  });

  it("edge: versioned queryKey changes when lesson updatedAt changes", () => {
    const makeKey = (lessonId: number, updatedAt?: string) =>
      ["student-courses", "lesson", lessonId, updatedAt ?? "v0"] as const;

    const key1 = makeKey(10, "2026-11-28T10:00:00Z");
    const key2 = makeKey(10, "2026-11-28T10:00:00Z");
    const key3 = makeKey(10, "2026-11-28T10:05:00Z");

    expect(key1).toEqual(key2);
    expect(key1).not.toEqual(key3);
  });
});
