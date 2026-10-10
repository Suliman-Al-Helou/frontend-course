import api from '@/lib/api';

/* ───────────────────────── lib/dashboardStats.ts ─────────────────────────
   مهمة الملف: نقطة جلب وحدة لـ GET /dashboard/stats.

   المشكلة قبل: ثلاثة أماكن كانت تنادي نفس الـ endpoint كل واحد لحاله
   (StatsCards + ExamResults + صفحة الـ dashboard للـ streak) = 3 طلبات بنفس النتيجة.

   الحل: أول من يطلب بيبدأ الطلب، والباقي بياخدوا نفس الـ Promise
   (طلب واحد مشترك). وبعد TTL_MS بيصير الطلب التالي جديد (لتبقى البيانات طازجة).

   ✏️ EDIT HERE: TTL_MS = مدة اعتبار النتيجة صالحة للمشاركة.
*/

export interface DashboardStatsResponse {
  stats: {
    enrolled_courses: number;
    completed_lessons: number;
    learning_hours: number;
    completed_courses: number;
    streak?: number;
  };
  exam_results: {
    lesson: string;
    course: string;
    score: number;
    passed: boolean;
    date: string;
  }[];
  pass_rate: number;
}

const TTL_MS = 30_000;

let shared: Promise<DashboardStatsResponse> | null = null;
let startedAt = 0;

export function getDashboardStats(): Promise<DashboardStatsResponse> {
  if (shared && Date.now() - startedAt < TTL_MS) return shared;

  startedAt = Date.now();
  const request = api
    .get<DashboardStatsResponse>('/dashboard/stats')
    .then((res) => res.data)
    .catch((error) => {
      // الفشل ما بينخزّن: المحاولة التالية بتطلب من جديد
      if (shared === request) shared = null;
      throw error;
    });

  shared = request;
  return request;
}