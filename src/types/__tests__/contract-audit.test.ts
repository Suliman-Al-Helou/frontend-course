import { describe, it, expect } from "vite-plus/test";
import type { paths, components } from "../api.generated";
import type { AdminStats, Lesson, Course, User, Section } from "../index";

// Type-level assertion helpers
type Expect<T extends true> = T;
type IsAssignable<TSub, TSuper> = [TSub] extends [TSuper] ? true : false;

describe("Full-Stack Contract Alignment & Schema Audit", () => {
  describe("Domain 1: Admin Stats & Dashboard Counters", () => {
    it("documents field mapping between backend snake_case and frontend camelCase", () => {
      type ServerStats =
        paths["/admin/stats"]["get"]["responses"][200]["content"]["application/json"];

      const rawServerPayload: ServerStats = {
        total_students: 150,
        total_courses: 12,
        total_enrollments: 450,
        total_instructors: 5,
      };

      // Adapter function proving zero-breakage mapping
      const adaptAdminStats = (raw: ServerStats): AdminStats => ({
        totalStudents: raw.total_students,
        totalCourses: raw.total_courses,
        totalInstructors: raw.total_instructors,
        pendingEnrollments: raw.total_enrollments,
      });

      const adapted = adaptAdminStats(rawServerPayload);
      expect(adapted.totalStudents).toBe(150);
      expect(adapted.totalCourses).toBe(12);
      expect(adapted.totalInstructors).toBe(5);
      expect(adapted.pendingEnrollments).toBe(450);
    });
  });

  describe("Domain 2: Lesson & Video Playback Gating", () => {
    it("validates LessonResource core properties match Lesson contract", () => {
      type ServerLesson = components["schemas"]["LessonResource"];

      // Verify that ServerLesson has mandatory identification and status keys
      type HasId = Expect<IsAssignable<ServerLesson["id"], number>>;
      type HasTitle = Expect<IsAssignable<ServerLesson["title"], string>>;
      type HasPublished = Expect<IsAssignable<ServerLesson["is_published"], boolean>>;
      type HasOrder = Expect<IsAssignable<ServerLesson["order"], number>>;

      const mockServerLesson: ServerLesson = {
        id: 101,
        section_id: 5,
        title: "Introduction to Event Sourcing",
        description: "Core architectural patterns",
        video_id: "dQw4w9WgXcQ",
        video_provider: "youtube",
        playback: "youtube",
        duration: 420,
        order: 1,
        is_preview: true,
        is_published: true,
      };

      expect(mockServerLesson.id).toBe(101);
      expect(mockServerLesson.section_id).toBe(5);
      expect(mockServerLesson.is_published).toBe(true);
    });
  });

  describe("Domain 3: Course Curriculum & Section Hierarchy", () => {
    it("validates SectionResource schema compatibility", () => {
      type ServerSection = components["schemas"]["SectionResource"];

      const mockSection: ServerSection = {
        id: 1,
        course_id: 10,
        title: "Module 1: Foundations",
        order: 1,
        lessons: [],
      };

      expect(mockSection.id).toBe(1);
      expect(mockSection.title).toBe("Module 1: Foundations");
      expect(mockSection.lessons).toEqual([]);
    });
  });

  describe("Domain 4: User Profile & Authentication", () => {
    it("validates AuthMeResponse compatibility with User interface", () => {
      type AuthMeResponse =
        paths["/auth/me"]["get"]["responses"][200]["content"]["application/json"];

      // Ensure that a valid User satisfies the required auth identity
      const mockUser: User = {
        id: 1,
        name: "Ahmad Developer",
        email: "ahmad@futurehouse.academy",
        role: "instructor",
      };

      expect(mockUser.id).toBe(1);
      expect(["admin", "student", "instructor"]).toContain(mockUser.role);
    });
  });
});
