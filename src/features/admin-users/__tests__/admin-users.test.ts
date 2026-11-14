import { describe, it, expect, vi } from "vite-plus/test";

vi.mock("@/lib/api", () => ({
  default: {
    get: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  },
}));

import { adminUserQueries } from "../queries/adminUsers.queries";

describe("adminUserQueries factory", () => {
  it("generates correct hierarchical queryKey for admin users list", () => {
    const query = adminUserQueries.list();
    expect(query.queryKey).toEqual(["admin-users", "list"]);
    expect(query.staleTime).toBe(1000 * 60 * 2);
  });

  it("preserves root prefix for prefix-based cache invalidation", () => {
    const rootKey = adminUserQueries.all();
    const listKey = adminUserQueries.list().queryKey;

    expect(listKey[0]).toBe(rootKey[0]);
  });
});
