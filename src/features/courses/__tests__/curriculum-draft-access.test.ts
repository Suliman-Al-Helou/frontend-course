import { describe, it, expect } from "vite-plus/test";
import {
  evaluateCurriculumLessonAccess,
  type LessonAccessContext,
  type LessonAccessTarget,
} from "../components/detail/curriculum-access-helpers";

describe("Curriculum Lesson Draft Access Gating (Phase 5.1 / ADR 0016 / ADR 0021)", () => {
  describe("Draft Lessons (is_published = false)", () => {
    const draftLesson: LessonAccessTarget = {
      is_published: false,
      is_preview: false,
    };

    const draftPreviewLesson: LessonAccessTarget = {
      is_published: false,
      is_preview: true,
    };

    it("STRICTLY denies access to unauthenticated visitors even if is_preview is true", () => {
      const guestContext: LessonAccessContext = {
        isEnrolled: false,
        userRole: null,
      };

      const result = evaluateCurriculumLessonAccess(draftPreviewLesson, guestContext);
      expect(result.canAccess).toBe(false);
      expect(result.isDraft).toBe(true);
    });

    it("STRICTLY denies access to enrolled students (prevents premature unreleased access)", () => {
      const studentContext: LessonAccessContext = {
        isEnrolled: true,
        userRole: "student",
      };

      const result = evaluateCurriculumLessonAccess(draftLesson, studentContext);
      expect(result.canAccess).toBe(false);
      expect(result.isDraft).toBe(true);
    });

    it("PERMITS access to instructors for previewing and course authoring", () => {
      const instructorContext: LessonAccessContext = {
        isEnrolled: false,
        userRole: "instructor",
      };

      const result = evaluateCurriculumLessonAccess(draftLesson, instructorContext);
      expect(result.canAccess).toBe(true);
      expect(result.isDraft).toBe(true);
      expect(result.showDraftBadge).toBe(true);
    });

    it("PERMITS access to platform administrators for supervision", () => {
      const adminContext: LessonAccessContext = {
        isEnrolled: false,
        userRole: "admin",
      };

      const result = evaluateCurriculumLessonAccess(draftLesson, adminContext);
      expect(result.canAccess).toBe(true);
      expect(result.isDraft).toBe(true);
      expect(result.showDraftBadge).toBe(true);
    });
  });

  describe("Published Lessons (is_published = true / default)", () => {
    const previewLesson: LessonAccessTarget = {
      is_published: true,
      is_preview: true,
    };

    const lockedLesson: LessonAccessTarget = {
      is_published: true,
      is_preview: false,
    };

    it("permits un-enrolled guests to view published preview lessons", () => {
      const guestContext: LessonAccessContext = {
        isEnrolled: false,
        userRole: null,
      };

      const result = evaluateCurriculumLessonAccess(previewLesson, guestContext);
      expect(result.canAccess).toBe(true);
      expect(result.isDraft).toBe(false);
      expect(result.showPreviewBadge).toBe(true);
    });

    it("locks non-preview lessons for un-enrolled guests", () => {
      const guestContext: LessonAccessContext = {
        isEnrolled: false,
        userRole: null,
      };

      const result = evaluateCurriculumLessonAccess(lockedLesson, guestContext);
      expect(result.canAccess).toBe(false);
      expect(result.isDraft).toBe(false);
      expect(result.showPreviewBadge).toBe(false);
    });

    it("permits enrolled students to access all published lessons", () => {
      const studentContext: LessonAccessContext = {
        isEnrolled: true,
        userRole: "student",
      };

      const result = evaluateCurriculumLessonAccess(lockedLesson, studentContext);
      expect(result.canAccess).toBe(true);
      expect(result.isDraft).toBe(false);
    });

    it("permits instructors and admins to access all published lessons even if not enrolled", () => {
      const instructorContext: LessonAccessContext = {
        isEnrolled: false,
        userRole: "instructor",
      };

      const result = evaluateCurriculumLessonAccess(lockedLesson, instructorContext);
      expect(result.canAccess).toBe(true);
    });
  });
});
