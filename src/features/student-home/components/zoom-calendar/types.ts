/* ───────────────────────── types.ts ─────────────────────────
   مهمة الملف: أشكال البيانات فقط (بدون أي منطق أو JSX).
   أي ملف ثاني بالـ zoom-calendar بيستورد الأنواع من هون.
   ✏️ EDIT HERE: إذا الـ API ضاف حقل جديد للّقاء، ضيفه بـ ZoomMeeting.
*/

import type { ZoomMeeting } from "../../types";

export type { ZoomMeeting };

// فلتر العرض (الـ Select)
export type View = "month" | "week" | "day";

// حالة اللقاء: تُحسب من attended + الوقت (انظر getStatus بـ date-utils.ts)
export type Status = "upcoming" | "attended" | "missed";
