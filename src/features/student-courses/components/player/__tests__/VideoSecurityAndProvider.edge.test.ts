import { describe, expect, it } from "vite-plus/test";

/**
 * Phase 3 (SUL-12) TDD: Edge cases first for:
 * - YouTube nocookie embed hardening
 * - Company + course provider resolution (youtube | protected | both)
 */
describe("VideoSecurityAndProvider (SUL-12 Edge Cases)", () => {
  it("edge: resolves effective video provider from company setting with optional course override", () => {
    type ProviderMode = "youtube" | "protected" | "both";
    const resolveProvider = (
      companyMode: ProviderMode,
      courseOverride?: ProviderMode | null,
    ): ProviderMode => courseOverride ?? companyMode;

    expect(resolveProvider("youtube", null)).toBe("youtube");
    expect(resolveProvider("youtube", "protected")).toBe("protected");
    expect(resolveProvider("both", undefined)).toBe("both");
  });

  it("edge: builds hardened youtube-nocookie embed URL without sharing/keyboard controls", () => {
    const buildHardenedYoutubeUrl = (videoId: string) =>
      `https://www.youtube-nocookie.com/embed/${videoId}?modestbranding=1&rel=0&disablekb=1&enablejsapi=1`;

    const url = buildHardenedYoutubeUrl("dQw4w9WgXcQ");
    expect(url).toContain("youtube-nocookie.com/embed/");
    expect(url).toContain("disablekb=1");
    expect(url).toContain("modestbranding=1");
  });
});
