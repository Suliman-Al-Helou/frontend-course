import { MEETING_DURATION_MINUTES, WEEK_DAYS } from './constants';
import type { Status, ZoomMeeting } from './types';

/* ───────────────────────── date-utils.ts ─────────────────────────
   مهمة الملف: دوال التاريخ والتنسيق وحساب حالة اللقاء.
   كلها pure functions: تاخد مدخلات وترجع نتيجة، بدون state ولا React.
   المنطق منقول من الملف القديم كما هو بدون تغيير.
*/

/* ── التنسيق (TODO translate: 'ar' ثابتة الآن، لاحقًا من next-intl) ──
   ✏️ EDIT HERE: غيّر الصيغة هون مرة وحدة وبتتغير بكل العروض */

export const monthFormatter = new Intl.DateTimeFormat('ar', { month: 'long', year: 'numeric' });
export const dateFormatter = new Intl.DateTimeFormat('ar', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
export const fullDateFormatter = new Intl.DateTimeFormat('ar', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});
export const timeFormatter = new Intl.DateTimeFormat('ar', { hour: '2-digit', minute: '2-digit' });
export const hourFormatter = new Intl.DateTimeFormat('ar', { hour: 'numeric' });

/* ── مفاتيح ومقارنة ── */

// مفتاح الشهر لطلب الـ API: "2026-10"
export function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

// مفتاح اليوم لتجميع اللقاءات بـ Map: "2026-9-5" (الشهر من 0 عمدًا، يكفي أنه فريد)
export function dayKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

export function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/* ── التنقل بين الأيام والأشهر ── */

export function addDays(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

// بيحافظ على اليوم قدر الإمكان (31 → آخر يوم بالشهر الأقصر)
export function addMonths(date: Date, amount: number) {
  const target = new Date(date.getFullYear(), date.getMonth() + amount, 1);
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), lastDay));
}

/* ── ترتيب الأسبوع: السبت أولاً ──
   JS: getDay() الأحد=0 ... السبت=6. نحن بدنا السبت=0،
   فنزيد 1 ونأخذ الباقي على 7:  (getDay() + 1) % 7
   ✏️ EDIT HERE: لو غيّرت بداية الأسبوع لازم تغيّر السطور الثلاثة
   (buildCalendarDays + startOfWeek + weekdayName) وترتيب WEEK_DAYS بـ constants.ts */

// خلايا شبكة الشهر (تشمل أيام الأشهر المجاورة لإكمال الأسابيع)
export function buildCalendarDays(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const last = new Date(month.getFullYear(), month.getMonth() + 1, 0);

  // Saturday = 0, Sunday = 1 ... Friday = 6
  const firstDay = (first.getDay() + 1) % 7;
  const totalCells = Math.ceil((firstDay + last.getDate()) / 7) * 7;

  return Array.from(
    { length: totalCells },
    (_, index) => new Date(month.getFullYear(), month.getMonth(), index - firstDay + 1),
  );
}

export function startOfWeek(date: Date) {
  return addDays(date, -((date.getDay() + 1) % 7));
}

export function weekdayName(date: Date) {
  return WEEK_DAYS[(date.getDay() + 1) % 7];
}

/* ── الوقت والحالة ── */

// دقائق مرّت من بداية اليوم (لحساب مكان البلوك بالشبكة)
export function minutesOfDay(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

// حضر → attended | انتهى (البداية + المدة) ولم يحضر → missed | غير ذلك → upcoming
// ✏️ EDIT HERE: تعريف "فائت" (المدة نفسها من MEETING_DURATION_MINUTES بـ constants.ts)
export function getStatus(meeting: ZoomMeeting, now: number): Status {
  if (meeting.attended) return 'attended';
  const end = new Date(meeting.starts_at).getTime() + MEETING_DURATION_MINUTES * 60_000;
  return now > end ? 'missed' : 'upcoming';
}