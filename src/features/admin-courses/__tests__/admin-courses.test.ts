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
});
