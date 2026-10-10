import { AlertCircle, CheckCircle2, Video } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { BadgeProps } from '@/components/ui/badge';
import type { Status, View } from './types';

/* ───────────────────────── constants.ts ─────────────────────────
   مهمة الملف: القيم الثابتة فقط (أرقام، نصوص، ألوان الحالات).
   ليش ملف لحاله؟ عشان تغيّر أي رقم/نص/لون من مكان واحد
   بدون ما تدوّر داخل الـ components.
*/

/* ── الشبكة الزمنية (عرض الأسبوع واليوم) ── */

// ✏️ EDIT HERE: مدة اللقاء الثابتة (دقيقة). عليها يعتمد "فائت" وارتفاع البلوك
export const MEETING_DURATION_MINUTES = 60;

// ✏️ EDIT HERE: ارتفاع الساعة الواحدة بالشبكة (px)
export const HOUR_HEIGHT = 56;

// ✏️ EDIT HERE: النطاق الافتراضي إذا ما في لقاءات (8 ص → 8 م)
export const DEFAULT_START_HOUR = 8;
export const DEFAULT_END_HOUR = 20;

/* ── النصوص (TODO translate: لاحقًا بتروح لـ messages/ar.json عبر useTranslations) ── */

// الأسبوع يبدأ بالسبت: الترتيب هون لازم يطابق startOfWeek/weekdayName بـ date-utils.ts
export const WEEK_DAYS = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

// ✏️ EDIT HERE: أسماء خيارات الـ Select
export const VIEW_LABELS: Record<View, string> = {
  month: 'عرض الشهر',
  week: 'عرض الأسبوع',
  day: 'عرض اليوم',
};

/* ── ألوان وأيقونات الحالات ──
   الألوان كلها semantic tokens (primary / success / destructive)،
   فبتشتغل بالـ light والـ dark بدون dark: variants. */

interface StatusMeta {
  label: string;
  icon: LucideIcon; // الألوان وحدها ما بتكفي: كل حالة إلها أيقونة
  chip: string; // شكل الـ chip داخل الشبكة
  dot: string; // النقطة بالـ Legend
  badge: BadgeProps['variant']; // شكل الـ Badge بالتفاصيل
}

// ✏️ EDIT HERE: تغيير نص أو أيقونة أو لون أي حالة
export const STATUS_META: Record<Status, StatusMeta> = {
  upcoming: {
    label: 'قادم',
    icon: Video,
    chip: 'border-primary/40 bg-primary/15 text-primary hover:bg-primary/25',
    dot: 'bg-primary',
    badge: 'upcoming',
  },
  attended: {
    label: 'تم الحضور',
    icon: CheckCircle2,
    chip: 'border-success/40 bg-success/15 text-success hover:bg-success/25',
    dot: 'bg-success',
    badge: 'attended',
  },
  missed: {
    label: 'فائت',
    icon: AlertCircle,
    chip: 'border-destructive/40 bg-destructive/15 text-destructive hover:bg-destructive/25',
    dot: 'bg-destructive',
    badge: 'missed',
  },
};

// ترتيب ظهور الحالات بالـ Legend
export const STATUS_ORDER: Status[] = ['upcoming', 'attended', 'missed'];