import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import api from "@/lib/api";

export interface SimpleCourseItem {
  id: number;
  title: string;
}

function transformCourses(rawData: unknown): SimpleCourseItem[] {
  let list: Array<{ id: number; title: string }> = [];
  if (Array.isArray(rawData)) {
    list = rawData;
  } else if (
    rawData &&
    typeof rawData === "object" &&
    Array.isArray((rawData as { data?: unknown }).data)
  ) {
    list = (rawData as { data: Array<{ id: number; title: string }> }).data;
  }

  // نقتطع أول 5 كورسات ونستخرج id و title فقط لضمان عدم الاحتفاظ بأي بيانات إضافية في الذاكرة
  return list.slice(0, 5).map((course) => ({
    id: Number(course.id),
    title: String(course.title ?? ""),
  }));
}

export function useCourses(): UseQueryResult<SimpleCourseItem[]> {
  return useQuery({
    queryKey: ["courses", "footer"],
    queryFn: async () => {
      const response = await api.get("/courses");
      return transformCourses(response.data);
    },
    staleTime: 5 * 60 * 1000,
  });
}
