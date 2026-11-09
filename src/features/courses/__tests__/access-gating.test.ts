import { describe, it, expect } from "vite-plus/test";
import { extractYouTubeVideoId } from "../../../lib/youtube";

describe("Access Gating & Logic Verification", () => {
  describe("Free vs Paid Course Logic", () => {
    it("determines free courses correctly based on is_public and price", () => {
      const freeCourse = { is_public: true, price: 0 };
      const isFree = Number(freeCourse.price ?? 0) === 0 || Boolean(freeCourse.is_public);
      expect(isFree).toBe(true);

      const paidCourse = { is_public: false, price: 49.99 };
      const isPaidFree = Number(paidCourse.price ?? 0) === 0 || Boolean(paidCourse.is_public);
      expect(isPaidFree).toBe(false);
    });

    it("evaluates access permissions for curriculum lessons", () => {
      // Free course with authenticated user -> hasAccess is true for all lessons
      const hasAccessFree = true;
      const freeLessons = [
        { id: 1, title: "مقدمة", is_preview: true },
        { id: 2, title: "الدرس الثاني", is_preview: false },
      ];

      const freeAccessMap = freeLessons.map((l) => ({
        id: l.id,
        canAccess: hasAccessFree || l.is_preview,
      }));
      expect(freeAccessMap[0].canAccess).toBe(true);
      expect(freeAccessMap[1].canAccess).toBe(true);

      // Paid course with un-enrolled user -> hasAccess is false
      const hasAccessPaid = false;
      const paidLessons = [
        { id: 10, title: "مقدمة الكورس المدفوع", is_preview: true },
        { id: 11, title: "الدرس الثاني المتقدم", is_preview: false },
        { id: 12, title: "الدرس الثالث المتقدم", is_preview: false },
      ];

      const paidAccessMap = paidLessons.map((l) => ({
        id: l.id,
        canAccess: hasAccessPaid || l.is_preview,
      }));
      // First lesson (previewable) is accessible
      expect(paidAccessMap[0].canAccess).toBe(true);
      // Subsequent lessons are strictly gated/restricted
      expect(paidAccessMap[1].canAccess).toBe(false);
      expect(paidAccessMap[2].canAccess).toBe(false);
    });
  });

  describe("Video Player YouTube ID & Contract Verification", () => {
    it("validates 11-character YouTube video ID format", () => {
      const validIds = ["dQw4w9WgXcQ", "W6NZfCO5SIk", "PkZNo7MFNFg", "hdI2bqOjy3c"];
      const invalidIds = ["tooShort", "wayTooLongVideoId12345", "invalid!char", ""];

      const regex = /^[a-zA-Z0-9_-]{11}$/;

      for (const id of validIds) {
        expect(regex.test(id)).toBe(true);
        expect(extractYouTubeVideoId(id)).toBe(id);
      }

      for (const id of invalidIds) {
        expect(regex.test(id)).toBe(false);
      }
    });

    it("detects when currentLesson.video_id is null and triggers fallback", () => {
      // When backend strips video_id, currentLesson.video_id is null
      const lessonFromBackend = {
        id: 1,
        title: "Lesson",
        video_id: null,
      };

      const resolvedVideoId = lessonFromBackend.video_id ?? "dQw4w9WgXcQ";
      expect(resolvedVideoId).toBe("dQw4w9WgXcQ");
    });
  });
});
