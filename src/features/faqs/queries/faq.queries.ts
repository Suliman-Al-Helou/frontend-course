/**
 * FAQ TanStack Query v5 Factory
 */

import { queryOptions } from "@tanstack/react-query";
import { getPublicFaqs, getAdminFaqs } from "../api";

export const faqKeys = {
  all: ["faqs"] as const,
  list: () => [...faqKeys.all, "list"] as const,
  adminList: () => [...faqKeys.all, "admin-list"] as const,
};

export const faqQueries = {
  all: () => faqKeys.all,

  list: () =>
    queryOptions({
      queryKey: faqKeys.list(),
      queryFn: getPublicFaqs,
      staleTime: 1000 * 60 * 60 * 2, // 2 hours browser cache
      gcTime: 1000 * 60 * 60 * 24, // 24 hours memory persistence
    }),

  adminList: () =>
    queryOptions({
      queryKey: faqKeys.adminList(),
      queryFn: getAdminFaqs,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }),
};
