import { describe, it, expect } from "vite-plus/test";
import {
  resolvePostLoginRedirect,
  shouldEvictSession,
  extractUpdatedProfile,
} from "../auth-helpers";

describe("Auth Integration Helpers (ADR 0003)", () => {
  describe("resolvePostLoginRedirect", () => {
    it("routes student to /dashboard when no redirect parameter is present", () => {
      const target = resolvePostLoginRedirect(null, { role: "student" });
      expect(target).toBe("/dashboard");
    });

    it("routes admin to /admin when no redirect parameter is present", () => {
      const target = resolvePostLoginRedirect(null, { role: "admin" });
      expect(target).toBe("/admin");
    });

    it("accepts safe relative path in redirect parameter", () => {
      const target = resolvePostLoginRedirect("/dashboard/courses", { role: "student" });
      expect(target).toBe("/dashboard/courses");
    });

    it("rejects protocol-relative open redirect attacks (e.g. //attacker.com)", () => {
      const target = resolvePostLoginRedirect("//attacker.com", { role: "student" });
      expect(target).toBe("/dashboard");
    });

    it("rejects backslash open redirect attempts (e.g. /\\attacker.com)", () => {
      const target = resolvePostLoginRedirect("/\\attacker.com", { role: "student" });
      expect(target).toBe("/dashboard");
    });

    it("rejects absolute external URLs without leading slash", () => {
      const target = resolvePostLoginRedirect("https://attacker.com", { role: "admin" });
      expect(target).toBe("/admin");
    });
  });

  describe("shouldEvictSession", () => {
    it("flags 401 Unauthorized for immediate cookie eviction", () => {
      expect(shouldEvictSession(401)).toBe(true);
    });

    it("does not evict session on 403, 429, or 500 errors", () => {
      expect(shouldEvictSession(403)).toBe(false);
      expect(shouldEvictSession(429)).toBe(false);
      expect(shouldEvictSession(500)).toBe(false);
    });
  });

  describe("extractUpdatedProfile", () => {
    it("extracts updated user attributes from Laravel response JSON", () => {
      const raw = JSON.stringify({
        message: "تم تحديث الملف الشخصي بنجاح",
        user: {
          id: 5,
          name: "New Name",
          email: "new@example.com",
          role: "student",
          is_active: true,
        },
      });

      const extracted = extractUpdatedProfile(raw);
      expect(extracted).toEqual({
        id: 5,
        name: "New Name",
        email: "new@example.com",
        role: "student",
      });
    });

    it("returns null for non-JSON or invalid response payloads", () => {
      expect(extractUpdatedProfile("Internal Server Error")).toBeNull();
      expect(extractUpdatedProfile(JSON.stringify({ message: "error" }))).toBeNull();
    });
  });
});
