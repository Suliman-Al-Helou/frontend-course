import "server-only";
import { QueryClient, dehydrate, type DehydratedState } from "@tanstack/react-query";
import { courseQueries } from "../queries/courses.queries";

// ميزانية مهلة السيرفر لمنع حجب الرندرة في حال بطء الباك إند
const PREFETCH_BUDGET_MS = 1500;

/**
 * جلب كاش الكورسات مسبقاً في السيرفر (RSC Prefetching)
 */
export async function getDehydratedCourses(): Promise<DehydratedState> {
  const queryClient = new QueryClient();

  const prefetch = queryClient.prefetchQuery(courseQueries.list());
  const budget = new Promise<void>((resolve) => setTimeout(resolve, PREFETCH_BUDGET_MS));

  await Promise.race([prefetch, budget]).catch(() => {});
  // Only successful queries are dehydrated, so failed/pending queries fall back to client gracefully
  return dehydrate(queryClient);
}

/**
 * جلب كاش تفاصيل كورس محدد مسبقاً في السيرفر (RSC Prefetching)
 */
export async function getDehydratedCourseDetail(id: number | string): Promise<DehydratedState> {
  const queryClient = new QueryClient();

  const prefetch = queryClient.prefetchQuery(courseQueries.detail(id));
  const budget = new Promise<void>((resolve) => setTimeout(resolve, PREFETCH_BUDGET_MS));

  await Promise.race([prefetch, budget]).catch(() => {});
  return dehydrate(queryClient);
}
