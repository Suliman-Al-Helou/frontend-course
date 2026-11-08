import type { DashboardStatsResponse } from '@/lib/dashboardStats';
import { useDashboardStats } from './Usedashboardstats';

// الـ type صار معرّف مرة وحدة في lib/dashboardStats، وهون إعادة تصدير عشان ما ينكسر أي import قديم
export type { ExamResult } from '@/lib/dashboardStats';

const toExamData = (data: DashboardStatsResponse) => ({
  results: data.exam_results,
  passRate: data.pass_rate,
});

// بيرجّع UseQueryResult<{ results, passRate }> — الحالات (تحميل/خطأ/فاضي) بيقررها <QueryState>
export function useExamResults() {
  return useDashboardStats(toExamData);
}

export function scoreColorClass(score: number): string {
  if (score >= 90) return 'text-green-600 bg-green-50';
  if (score >= 70) return 'text-blue-600 bg-blue-50';
  if (score >= 50) return 'text-orange-600 bg-orange-50';
  return 'text-red-600 bg-red-50';
}