import { queryOptions } from "@tanstack/react-query";
import { getAdminUsers } from "../api";

export const adminUserQueries = {
  all: () => ["admin-users"] as const,

  // قائمة جميع المستخدمين للوحة تحكم الأدمن
  list: () =>
    queryOptions({
      queryKey: [...adminUserQueries.all(), "list"] as const,
      queryFn: getAdminUsers,
      staleTime: 1000 * 60 * 2, // 2 minutes
    }),
};
