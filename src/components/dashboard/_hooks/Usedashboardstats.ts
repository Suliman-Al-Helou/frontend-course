'use client';

import { useQuery } from '@tanstack/react-query';
import {
  fetchDashboardStats,
  type DashboardStatsResponse,
} from '@/lib/dashboardStats';

/* ───────────────────────── useDashboardStats.ts ─────────────────────────
   مهمة الملف: الـ hook الوحيد اللي بيجيب GET /dashboard/stats.
   - StatsCards + ExamResults + صفحة الـ dashboard (streak) كلهم بينادوه
     بنفس الـ queryKey ← طلب واحد فقط، والنتيجة تعيش staleTime (30 ثانية من QueryProvider).
   - select: كل component بياخد الجزء اللي بده إياه من نفس الـ cache بدون طلب جديد.
   - بدون select بيرجّع الاستجابة كاملة.
*/

export const DASHBOARD_STATS_KEY = ['dashboard-stats'] as const;

export function useDashboardStats<T = DashboardStatsResponse>(
  select?: (data: DashboardStatsResponse) => T,
) {
  return useQuery({
    queryKey: DASHBOARD_STATS_KEY,
    queryFn: fetchDashboardStats,
    select,
  });
}