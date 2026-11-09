import { describe, it, expect, vi } from "vite-plus/test";

vi.mock("@/lib/api", () => ({
  default: {
    get: vi.fn(),
  },
}));

import { courseQueries } from "../queries/courses.queries";

describe("courseQueries factory", () => {
  it("generates correct query key for full catalog", () => {
    const query = courseQueries.list();
    expect(query.queryKey).toEqual(["courses", "list", {}]);
  });

  it("generates isolated query key for landing page limit 3", () => {
    const query = courseQueries.list({ limit: 3 });
    expect(query.queryKey).toEqual(["courses", "list", { limit: 3 }]);
  });

  it("retains hierarchical prefix for seamless invalidation", () => {
    const listKey = courseQueries.lists();
    const landingKey = courseQueries.list({ limit: 3 }).queryKey;

    // Prefix check: queryClient.invalidateQueries({ queryKey: courseQueries.lists() })
    expect(landingKey.slice(0, 2)).toEqual([...listKey]);
  });
});

