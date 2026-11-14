import { describe, it, expect, vi } from "vite-plus/test";

vi.mock("@/lib/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import { instructorQueries, instructorKeys } from "../queries/instructor.queries";

describe("Instructor Queries Factory & Cache Management", () => {
  it("generates correct queryKey and cache policy for public instructors list", () => {
    const query = instructorQueries.list();
    expect(query.queryKey).toEqual(["instructors", "list"]);
    expect(query.staleTime).toBe(1000 * 60 * 60 * 2); // 2 hours
    expect(query.gcTime).toBe(1000 * 60 * 60 * 24); // 24 hours
  });

  it("generates correct queryKey and enabled flag for instructor detail", () => {
    const query = instructorQueries.detail(5);
    expect(query.queryKey).toEqual(["instructors", "detail", "5"]);
    expect(query.enabled).toBe(true);

    const disabledQuery = instructorQueries.detail(0);
    expect(disabledQuery.enabled).toBe(false);
  });

  it("generates correct queryKey for administrative instructors list", () => {
    const query = instructorQueries.adminList();
    expect(query.queryKey).toEqual(["instructors", "admin-list"]);
    expect(query.staleTime).toBe(1000 * 60 * 5); // 5 minutes
  });

  it("maintains consistent root query key for atomic cache invalidation", () => {
    const rootKey = instructorKeys.all[0];
    expect(instructorQueries.list().queryKey[0]).toBe(rootKey);
    expect(instructorQueries.detail(1).queryKey[0]).toBe(rootKey);
    expect(instructorQueries.adminList().queryKey[0]).toBe(rootKey);
  });
});
