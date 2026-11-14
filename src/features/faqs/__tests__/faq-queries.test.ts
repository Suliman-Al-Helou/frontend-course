import { describe, it, expect, vi } from "vite-plus/test";

vi.mock("@/lib/api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import { faqQueries, faqKeys } from "../queries/faq.queries";

describe("FAQ Queries Factory & Cache Management", () => {
  it("generates correct queryKey and cache policy for public FAQs list", () => {
    const query = faqQueries.list();
    expect(query.queryKey).toEqual(["faqs", "list"]);
    expect(query.staleTime).toBe(1000 * 60 * 60 * 2); // 2 hours
    expect(query.gcTime).toBe(1000 * 60 * 60 * 24); // 24 hours
  });

  it("generates correct queryKey and cache policy for admin FAQs list", () => {
    const query = faqQueries.adminList();
    expect(query.queryKey).toEqual(["faqs", "admin-list"]);
    expect(query.staleTime).toBe(1000 * 60 * 5); // 5 minutes
  });

  it("maintains consistent root query key for atomic cache invalidation", () => {
    const rootKey = faqKeys.all[0];
    expect(faqQueries.list().queryKey[0]).toBe(rootKey);
    expect(faqQueries.adminList().queryKey[0]).toBe(rootKey);
  });
});
