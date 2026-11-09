import { queryOptions } from "@tanstack/react-query";
import { getInstructors } from "@/lib/api/instructors";

export const instructorQueries = {
  all: () => ["instructors"] as const,
  list: () =>
    queryOptions({
      queryKey: [...instructorQueries.all(), "list"] as const,
      queryFn: getInstructors,
      staleTime: 1000 * 60 * 60 * 2, // ساعتان كاش طازج في المتصفح
      gcTime: 1000 * 60 * 60 * 24, // 24 ساعة احتفاظ في الذاكرة
    }),
};
