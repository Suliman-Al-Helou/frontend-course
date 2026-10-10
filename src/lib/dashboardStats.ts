import api from '@/lib/api';

/* ───────────────────────── lib/dashboardStats.ts ─────────────────────────
   مهمة الملف: نقطة جلب وحدة لـ GET /dashboard/stats.

   المشكلة قبل: ثلاثة أماكن كانت تنادي نفس الـ endpoint كل واحد لحاله
   (StatsCards + ExamResults + صفحة الـ dashboard للـ streak) = 3 طلبات بنفس النتيجة.

   الحل: أول من يطلب بيبدأ الطلب، والباقي بياخدوا نفس الـ Promise
   (طلب واحد مشترك). وبعد TTL_MS بيصير الطلب التالي جديد (لتبقى البيانات طازجة).

   ✏️ EDIT HERE: TTL_MS = مدة اعتبار النتيجة صالحة للمشاركة.
*/




export interface ExamResult {
  lesson: string;
  course: string;
  score: number;
  passed: boolean;
  date: string;
}

export interface DashboardStatsResponse {
  stats: {
    enrolled_courses: number;
    completed_lessons: number;
    learning_hours: number;
    completed_courses: number;
    streak?: number;
  };
  exam_results: ExamResult[];
  pass_rate: number;
}

export async function fetchDashboardStats(): Promise<DashboardStatsResponse> {
  const { data } = await api.get<DashboardStatsResponse>('/dashboard/stats');
  return data;
}