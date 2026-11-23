import { describe, it, expect } from "vite-plus/test";
import {
  INSTRUCTOR_NAV_ITEMS,
  isInstructorNavActive,
  shouldShowInstructorPortalSwitch,
} from "../utils/navigation";

describe("Instructor Portal Navigation & Role Switching (Phase 5.3 / TB 09)", () => {
  describe("INSTRUCTOR_NAV_ITEMS Structure", () => {
    it("contains exactly 3 canonical menu routes", () => {
      expect(INSTRUCTOR_NAV_ITEMS).toHaveLength(3);
      expect(INSTRUCTOR_NAV_ITEMS.map((i) => i.href)).toEqual([
        "/instructor",
        "/instructor/courses",
        "/instructor/support",
      ]);
    });

    it("has valid Arabic labels adhering to platform glossary", () => {
      expect(INSTRUCTOR_NAV_ITEMS[0].label).toBe("الرئيسية");
      expect(INSTRUCTOR_NAV_ITEMS[1].label).toBe("كورساتي الموكلة");
      expect(INSTRUCTOR_NAV_ITEMS[2].label).toBe("الدعم والمساعدة");
    });
  });

  describe("isInstructorNavActive", () => {
    it("matches /instructor only when pathname is exactly /instructor", () => {
      expect(isInstructorNavActive("/instructor", "/instructor")).toBe(true);
      expect(isInstructorNavActive("/instructor", "/instructor/courses")).toBe(false);
      expect(isInstructorNavActive("/instructor", "/instructor/support")).toBe(false);
    });

    it("matches /instructor/courses on exact match and nested subpaths", () => {
      expect(isInstructorNavActive("/instructor/courses", "/instructor/courses")).toBe(true);
      expect(isInstructorNavActive("/instructor/courses", "/instructor/courses/42")).toBe(true);
      expect(isInstructorNavActive("/instructor/courses", "/instructor")).toBe(false);
    });

    it("matches /instructor/support on exact match and nested subpaths", () => {
      expect(isInstructorNavActive("/instructor/support", "/instructor/support")).toBe(true);
      expect(isInstructorNavActive("/instructor/support", "/instructor/support/tickets")).toBe(
        true,
      );
      expect(isInstructorNavActive("/instructor/support", "/instructor")).toBe(false);
    });
  });

  describe("shouldShowInstructorPortalSwitch", () => {
    it("returns true only for users with instructor role", () => {
      expect(shouldShowInstructorPortalSwitch("instructor")).toBe(true);
    });

    it("returns false for students, admins, and unauthenticated visitors", () => {
      expect(shouldShowInstructorPortalSwitch("student")).toBe(false);
      expect(shouldShowInstructorPortalSwitch("admin")).toBe(false);
      expect(shouldShowInstructorPortalSwitch(null)).toBe(false);
      expect(shouldShowInstructorPortalSwitch(undefined)).toBe(false);
    });
  });
});
