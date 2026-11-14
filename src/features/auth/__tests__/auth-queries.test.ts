import { describe, it, expect, vi } from "vite-plus/test";

vi.mock("@/lib/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

import { authQueries } from "../queries/auth.queries";
import type { AuthUser } from "../types";

describe("authQueries factory", () => {
  it("generates correct hierarchical queryKey for user session", () => {
    const query = authQueries.user();
    expect(query.queryKey).toEqual(["auth", "user"]);
    expect(query.staleTime).toBe(1000 * 60 * 15);
  });

  it("attaches initialData seamlessly when provided for zero-FOUC hydration", () => {
    const mockUser: AuthUser = {
      id: 99,
      name: "أحمد علي",
      email: "ahmed@example.com",
      role: "student",
    };

    const query = authQueries.user(mockUser);
    expect(query.queryKey).toEqual(["auth", "user"]);
    expect(query.initialData).toEqual(mockUser);
  });

  it("preserves root prefix for auth queries invalidation", () => {
    const rootKey = authQueries.all();
    const userKey = authQueries.user().queryKey;

    expect(userKey[0]).toBe(rootKey[0]);
  });
});
