import { queryOptions } from "@tanstack/react-query";
import { getCurrentUser } from "../api";
import type { AuthUser } from "../types";

export const authQueries = {
  all: () => ["auth"] as const,

  // استعلام جلسة وهوية المستخدم الحالية (Single Source of Truth)
  user: (initialData?: AuthUser | null) =>
    queryOptions({
      queryKey: [...authQueries.all(), "user"] as const,
      queryFn: getCurrentUser,
      staleTime: 1000 * 60 * 15, // 15 minutes
      gcTime: 1000 * 60 * 60, // 1 hour
      ...(initialData !== undefined ? { initialData } : {}),
    }),
};
