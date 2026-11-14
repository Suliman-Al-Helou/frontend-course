"use client";

import { useQuery } from "@tanstack/react-query";
import { studentHomeQueries } from "./studentHome.queries";
import type { StudentHomeResponse } from "../types";

// `select` must be a stable (module-level) function so TanStack can memoize the result.
export function useStudentHomeStats<T>(select: (data: StudentHomeResponse) => T) {
  return useQuery({
    ...studentHomeQueries.stats(),
    select,
  });
}
