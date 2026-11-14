/**
 * Instructors TanStack Query v5 Factory
 */

import { queryOptions } from "@tanstack/react-query";
import { getInstructors, getInstructorDetail, getAdminInstructors } from "../api";

export const instructorKeys = {
  all: ["instructors"] as const,
  list: () => [...instructorKeys.all, "list"] as const,
  detail: (id: number | string) => [...instructorKeys.all, "detail", String(id)] as const,
  adminList: () => [...instructorKeys.all, "admin-list"] as const,
};

export const instructorQueries = {
  all: () => instructorKeys.all,

  list: () =>
    queryOptions({
      queryKey: instructorKeys.list(),
      queryFn: getInstructors,
      staleTime: 1000 * 60 * 60 * 2, // 2 hours browser cache
      gcTime: 1000 * 60 * 60 * 24, // 24 hours memory persistence
    }),

  detail: (id: number | string) =>
    queryOptions({
      queryKey: instructorKeys.detail(id),
      queryFn: () => getInstructorDetail(id),
      enabled: Boolean(id),
      staleTime: 1000 * 60 * 30, // 30 minutes
    }),

  adminList: () =>
    queryOptions({
      queryKey: instructorKeys.adminList(),
      queryFn: getAdminInstructors,
      staleTime: 1000 * 60 * 5, // 5 minutes
    }),
};
