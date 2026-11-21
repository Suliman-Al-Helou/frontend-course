import { queryOptions } from "@tanstack/react-query";
import { getAdminUsers } from "../api";

export const adminUserQueries = {
  all: () => ["admin-users"] as const,

  // قائمة جميع المستخدمين للوحة تحكم الأدمن
  list: () =>
    queryOptions({
      queryKey: [...adminUserQueries.all(), "list"] as const,
      queryFn: () => getAdminUsers(),
      staleTime: 1000 * 60 * 2, // 2 minutes
    }),

  // بحث عن مستخدمين بالاسم أو البريد للربط
  search: (search: string, limit = 5, unlinkedOnly = false) =>
    queryOptions({
      queryKey: [...adminUserQueries.all(), "search", search, limit, unlinkedOnly] as const,
      queryFn: () => getAdminUsers({ search, limit, unlinked_only: unlinkedOnly }),
      enabled: search.trim().length >= 2,
      staleTime: 1000 * 30, // 30 seconds
    }),
};
