import { describe, it, expect, vi } from "vite-plus/test";

vi.mock("@/lib/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

import { studentHomeQueries, studentHomeKeys } from "../queries/studentHome.queries";

describe("Student Home Queries Factory & Cache Management", () => {
  it("generates correct queryKey and staleTime for student home stats", () => {
    const query = studentHomeQueries.stats();
    expect(query.queryKey).toEqual(["student-home", "stats"]);
    expect(query.staleTime).toBe(60 * 1000);
  });

  it("generates composite temporal queryKey for zoom meetings", () => {
    const query = studentHomeQueries.zoom("2026-10,2026-11");
    expect(query.queryKey).toEqual(["student-home", "zoom", "2026-10,2026-11"]);
  });

  it("maintains consistent root query key for atomic cache invalidation", () => {
    const rootKey = studentHomeKeys.all[0];
    expect(studentHomeQueries.stats().queryKey[0]).toBe(rootKey);
    expect(studentHomeQueries.zoom("2026-10").queryKey[0]).toBe(rootKey);
  });
});
