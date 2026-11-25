import { describe, it, expect, vi } from "vite-plus/test";

vi.mock("@/lib/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

import {
  adminCourseQueries,
  adminEnrollmentQueries,
  adminZoomQueries,
  adminVideoAssetQueries,
  adminYouTubeQueries,
} from "../queries/adminCourses.queries";
import { toAdminCourse, toAdminEnrollment } from "../api";
import type { RawCourseAdmin, RawEnrollment } from "../types";

describe("adminCourseQueries factory", () => {
  it("generates correct hierarchical queryKey for course list", () => {
    const query = adminCourseQueries.list();
    expect(query.queryKey).toEqual(["admin-courses", "list"]);
    expect(query.staleTime).toBe(1000 * 60 * 2);
  });

  it("generates correct queryKey for course detail", () => {
    const query = adminCourseQueries.detail(42);
    expect(query.queryKey).toEqual(["admin-courses", "detail", "42"]);
    expect(query.staleTime).toBe(1000 * 60 * 2);
  });

  it("generates correct queryKey for course sections", () => {
    const query = adminCourseQueries.sections(5);
    expect(query.queryKey).toEqual(["admin-courses", "sections", "5"]);
    expect(query.staleTime).toBe(1000 * 60 * 2);
  });

  it("generates correct queryKey for lesson task questionnaire", () => {
    const query = adminCourseQueries.task(101);
    expect(query.queryKey).toEqual(["admin-courses", "task", "101"]);
    expect(query.staleTime).toBe(1000 * 60 * 5);
  });

  it("generates correct queryKey for course YouTube playlist videos", () => {
    const query = adminCourseQueries.youtubeVideos(7);
    expect(query.queryKey).toEqual(["admin-courses", "youtube-videos", "7"]);
    expect(query.staleTime).toBe(1000 * 60 * 5);
  });
});

describe("adminEnrollmentQueries factory", () => {
  it("generates correct queryKey for student enrollments list", () => {
    const query = adminEnrollmentQueries.list();
    expect(query.queryKey).toEqual(["admin-enrollments", "list"]);
    expect(query.staleTime).toBe(1000 * 60 * 2);
  });
});

describe("adminZoomQueries and adminVideoAssetQueries factories", () => {
  it("generates correct queryKey for zoom meetings", () => {
    const query = adminZoomQueries.list();
    expect(query.queryKey).toEqual(["admin-zoom-meetings", "list"]);
  });

  it("generates parameterized queryKey for video assets", () => {
    const queryWithoutParams = adminVideoAssetQueries.list();
    expect(queryWithoutParams.queryKey).toEqual(["admin-video-assets", "list", {}]);

    const queryWithParams = adminVideoAssetQueries.list({ course_id: 12 });
    expect(queryWithParams.queryKey).toEqual(["admin-video-assets", "list", { course_id: 12 }]);
  });

  it("generates correct queryKey for YouTube connection status", () => {
    const query = adminYouTubeQueries.status();
    expect(query.queryKey).toEqual(["admin-youtube", "status"]);
    expect(query.staleTime).toBe(1000 * 60 * 5);
  });
});

describe("admin queryKey hierarchy integrity", () => {
  it("allows prefix invalidation for all admin courses", () => {
    const rootKey = adminCourseQueries.all();
    const listKey = adminCourseQueries.list().queryKey;
    const detailKey = adminCourseQueries.detail(1).queryKey;
    const sectionsKey = adminCourseQueries.sections(1).queryKey;

    expect(listKey[0]).toBe(rootKey[0]);
    expect(detailKey[0]).toBe(rootKey[0]);
    expect(sectionsKey[0]).toBe(rootKey[0]);
  });

  it("adapts raw CourseAdminResource string fields into numeric AdminCourse fields", () => {
    const rawCourse: RawCourseAdmin = {
      id: "42",
      title: "Backend Hardening",
      description: "Deep dive into Laravel security",
      cover_image: "https://cdn.example.com/cover.png",
      level: "advanced",
      status: "published",
      total_duration: "120",
      requirements: "PHP 8.4",
      target_audience: "Backend Engineers",
      what_you_learn: '["Policies","Sanctum"]',
      students_count: "35",
      enrollments_count: "40",
      rating: "4.9",
      is_popular: "1",
      price: "199",
      is_public: "",
      youtube_playlist_id: "PL123",
      instructor: { id: "5", name: "Tariq" },
      created_at: "2026-11-01T00:00:00Z",
      updated_at: "2026-11-02T00:00:00Z",
    };

    const adapted = toAdminCourse(rawCourse);
    expect(adapted.id).toBe(42);
    expect(adapted.total_duration).toBe(120);
    expect(adapted.students_count).toBe(35);
    expect(adapted.enrollments_count).toBe(40);
    expect(adapted.rating).toBe(4.9);
    expect(adapted.price).toBe(199);
    expect(adapted.is_popular).toBe(true);
    expect(adapted.is_public).toBe(false);
    expect(adapted.what_you_learn).toEqual(["Policies", "Sanctum"]);
    expect(adapted.instructor).toEqual({ id: 5, name: "Tariq" });
  });

  it("adapts wrapped EnrollmentResource update responses safely", () => {
    const rawEnrollment: RawEnrollment = {
      id: 88,
      status: "approved",
      payment_confirmed: true,
      created_at: "2026-11-20T10:00:00Z",
      student_name: "Omar",
      student_email: "omar@example.com",
      course_title: "Clean Architecture",
      user: { id: 15, name: "Omar", email: "omar@example.com" },
      course: { id: 42, title: "Clean Architecture", price: 199, level: "intermediate" },
    };

    const adapted = toAdminEnrollment({ enrollment: rawEnrollment });
    expect(adapted.id).toBe(88);
    expect(adapted.user_id).toBe(15);
    expect(adapted.course_id).toBe(42);
    expect(adapted.status).toBe("approved");
    expect(adapted.course?.level).toBe("intermediate");
  });
});
