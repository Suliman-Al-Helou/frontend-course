import { describe, it, expect } from "vite-plus/test";
import { getAvatarInitials } from "../avatar";

describe("getAvatarInitials helper", () => {
  it("returns empty string for empty or whitespace-only input", () => {
    expect(getAvatarInitials("")).toBe("");
    expect(getAvatarInitials("   ")).toBe("");
    expect(getAvatarInitials(undefined)).toBe("");
  });

  it("extracts single initial for single-word name", () => {
    expect(getAvatarInitials("أحمد")).toBe("أ");
    expect(getAvatarInitials("John")).toBe("J");
  });

  it("extracts first and last initials for multi-word Arabic and English names", () => {
    expect(getAvatarInitials("أحمد محمد علي")).toBe("أع");
    expect(getAvatarInitials("سليمان الراجحي")).toBe("سا");
    expect(getAvatarInitials("John Michael Doe")).toBe("JD");
  });
});
