/* ───────────────────────── types.ts ─────────────────────────
   مهمة الملف: أشكال البيانات فقط (بدون أي منطق أو JSX).
   أي ملف ثاني بالـ zoom-calendar بيستورد الأنواع من هون.
   ✏️ EDIT HERE: إذا الـ API ضاف حقل جديد للّقاء، ضيفه بـ ZoomMeeting.
*/

export interface ZoomMeeting {
  id: number;
  course_name: string;
  title: string;
  description: string | null;
  starts_at: string; // ISO (UTC)
  can_join: boolean; // false = الدخول لسا مقفل (قبل اللقاء بـ 15 دقيقة)
  attended: boolean;
}

// فلتر العرض (الـ Select)
export type View = 'month' | 'week' | 'day';

// حالة اللقاء: تُحسب من attended + الوقت (انظر getStatus بـ date-utils.ts)
export type Status = 'upcoming' | 'attended' | 'missed';