"use client";

import { useQuery } from "@tanstack/react-query";
import { getStudentHomeStats } from "@/lib/api/studentHome";
import { queryKeys } from "@/lib/queryKeys";
import type { StudentHomeResponse } from "../types";

// `select` must be a stable (module-level) function so TanStack can memoize the result.
export function useStudentHomeStats<T>(select: (data: StudentHomeResponse) => T) {
  return useQuery({
    queryKey: queryKeys.studentHome.stats(),
    queryFn: getStudentHomeStats,
    select,
  });
}
