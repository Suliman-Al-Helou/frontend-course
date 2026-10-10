// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import {
//   CalendarDays,
//   ChevronLeft,
//   ChevronRight,
//   Clock3,
//   Loader2,
//   Video,
//   CheckCircle2,
//   LockKeyhole,
//   ExternalLink,
//   X,
// } from 'lucide-react';
// import api from '@/lib/api';

// interface ZoomMeeting {
//   id: number;
//   course_name: string;
//   title: string;
//   description: string | null;
//   starts_at: string;
//   can_join: boolean;
//   attended: boolean;
// }

// const monthFormatter = new Intl.DateTimeFormat('ar', {
//   month: 'long',
//   year: 'numeric',
// });

// const dateFormatter = new Intl.DateTimeFormat('ar', {
//   day: 'numeric',
//   month: 'long',
//   year: 'numeric',
// });

// const timeFormatter = new Intl.DateTimeFormat('ar', {
//   hour: '2-digit',
//   minute: '2-digit',
// });

// function monthKey(date: Date) {
//   return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
// }

// function dayKey(date: Date) {
//   return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
// }

// function sameDay(a: Date, b: Date) {
//   return (
//     a.getFullYear() === b.getFullYear() &&
//     a.getMonth() === b.getMonth() &&
//     a.getDate() === b.getDate()
//   );
// }

// function buildCalendarDays(month: Date) {
//   const first = new Date(month.getFullYear(), month.getMonth(), 1);
//   const last = new Date(month.getFullYear(), month.getMonth() + 1, 0);

//   // Saturday = 0, Sunday = 1 ... Friday = 6
//   const firstDay = (first.getDay() + 1) % 7;
//   const totalCells = Math.ceil((firstDay + last.getDate()) / 7) * 7;

//   return Array.from(
//     { length: totalCells },
//     (_, index) => new Date(month.getFullYear(), month.getMonth(), index - firstDay + 1),
//   );
// }

// const WEEK_DAYS = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];

// export default function ZoomCalendar() {
//   const [month, setMonth] = useState(() => {
//     const now = new Date();
//     return new Date(now.getFullYear(), now.getMonth(), 1);
//   });
//   const [meetings, setMeetings] = useState<ZoomMeeting[]>([]);
//   const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());
//   // نخزّن الـ id فقط، واللقاء نشتقه من القائمة حتى يتحدث تلقائيًا بعد الحضور
//   const [selectedMeetingId, setSelectedMeetingId] = useState<number | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [joiningId, setJoiningId] = useState<number | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const loadMeetings = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       const res = await api.get(`/zoom-meetings?month=${monthKey(month)}`);
//       const data = res.data.data ?? res.data;
//       setMeetings(Array.isArray(data) ? data : []);
//     } catch {
//       setMeetings([]);
//       setError('تعذّر تحميل لقاءات Zoom.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     void loadMeetings();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [month]);

//   const calendarDays = useMemo(() => buildCalendarDays(month), [month]);

//   const meetingsByDay = useMemo(() => {
//     const map = new Map<string, ZoomMeeting[]>();

//     for (const meeting of meetings) {
//       const key = dayKey(new Date(meeting.starts_at));
//       const current = map.get(key) ?? [];
//       current.push(meeting);
//       map.set(key, current);
//     }

//     return map;
//   }, [meetings]);

//   const selectedMeetings = useMemo(() => {
//     if (!selectedDay) return [];
//     return meetingsByDay.get(dayKey(selectedDay)) ?? [];
//   }, [selectedDay, meetingsByDay]);

//   const selectedMeeting = useMemo(
//     () => meetings.find((m) => m.id === selectedMeetingId) ?? null,
//     [meetings, selectedMeetingId],
//   );

//   const goToPreviousMonth = () => {
//     setMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1));
//     setSelectedMeetingId(null);
//   };

//   const goToNextMonth = () => {
//     setMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1));
//     setSelectedMeetingId(null);
//   };

//   const goToToday = () => {
//     const now = new Date();
//     setMonth(new Date(now.getFullYear(), now.getMonth(), 1));
//     setSelectedDay(now);
//     setSelectedMeetingId(null);
//   };

//   const handleAttend = async (meeting: ZoomMeeting) => {
//     if (!meeting.can_join) return;

//     // لازم تُفتح النافذة قبل أي await، وإلا يحجبها المتصفح
//     const popup = window.open('', '_blank');

//     setJoiningId(meeting.id);
//     setError(null);

//     try {
//       const res = await api.post<{ zoom_link: string }>(`/zoom-meetings/${meeting.id}/attend`);
//       const zoomLink = res.data.zoom_link;

//       setMeetings((current) =>
//         current.map((item) => (item.id === meeting.id ? { ...item, attended: true } : item)),
//       );

//       if (popup) {
//         popup.opener = null;
//         popup.location.href = zoomLink;
//       } else {
//         // النافذة انحجبت: نفتح الرابط بنفس التبويب
//         window.location.href = zoomLink;
//       }
//     } catch (e) {
//       popup?.close();
//       const message = (e as { response?: { data?: { message?: string } } }).response?.data
//         ?.message;
//       setError(message ?? 'لا يمكن الدخول إلى اللقاء في الوقت الحالي.');
//     } finally {
//       setJoiningId(null);
//     }
//   };

//   const isCurrentMonth = (date: Date) =>
//     date.getMonth() === month.getMonth() && date.getFullYear() === month.getFullYear();

//   return (
//     <section className="space-y-5" dir="rtl">
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <div className="flex items-center gap-2">
//             <CalendarDays className="h-5 w-5 text-primary" />
//             <h2 className="text-xl font-bold text-foreground">جدول لقاءات Zoom</h2>
//           </div>
//           <p className="mt-1 text-sm text-muted-foreground">
//             تابع مواعيد اللقاءات وادخل إلى الاجتماع عندما يحين وقت الدخول.
//           </p>
//         </div>

//         <button
//           onClick={goToToday}
//           className="w-fit rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
//         >
//           اليوم
//         </button>
//       </div>

//       {error && (
//         <div className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
//           {error}
//         </div>
//       )}

//       <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
//         <div className="overflow-hidden rounded-2xl border border-border bg-card">
//           <div className="flex items-center justify-between border-b border-border px-4 py-4">
//             <button
//               onClick={goToPreviousMonth}
//               className="rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
//               aria-label="الشهر السابق"
//             >
//               <ChevronRight className="h-5 w-5" />
//             </button>

//             <h3 className="text-base font-bold text-foreground">{monthFormatter.format(month)}</h3>

//             <button
//               onClick={goToNextMonth}
//               className="rounded-xl p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
//               aria-label="الشهر التالي"
//             >
//               <ChevronLeft className="h-5 w-5" />
//             </button>
//           </div>

//           <div className="grid grid-cols-7 border-b border-border bg-muted/30">
//             {WEEK_DAYS.map((day) => (
//               <div
//                 key={day}
//                 className="px-1 py-3 text-center text-[11px] font-semibold text-muted-foreground sm:text-xs"
//               >
//                 {day}
//               </div>
//             ))}
//           </div>

//           {loading ? (
//             <div className="flex min-h-[420px] items-center justify-center">
//               <Loader2 className="h-7 w-7 animate-spin text-primary" />
//             </div>
//           ) : (
//             <div className="grid grid-cols-7">
//               {calendarDays.map((day) => {
//                 const key = dayKey(day);
//                 const dayMeetings = meetingsByDay.get(key) ?? [];
//                 const selected = selectedDay ? sameDay(day, selectedDay) : false;

//                 return (
//                   <button
//                     key={key}
//                     onClick={() => {
//                       setSelectedDay(day);
//                       setSelectedMeetingId(null);
//                     }}
//                     className={[
//                       'relative min-h-[92px] border-b border-l border-border p-2 text-right transition-colors sm:min-h-[110px]',
//                       isCurrentMonth(day)
//                         ? 'bg-card hover:bg-muted/40'
//                         : 'bg-muted/10 text-muted-foreground/50',
//                       selected ? 'ring-2 ring-inset ring-primary' : '',
//                     ].join(' ')}
//                   >
//                     <span
//                       className={[
//                         'inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold',
//                         sameDay(day, new Date()) ? 'bg-primary text-primary-foreground' : '',
//                       ].join(' ')}
//                     >
//                       {day.getDate()}
//                     </span>

//                     <div className="mt-2 space-y-1">
//                       {dayMeetings.slice(0, 2).map((meeting) => (
//                         <div
//                           key={meeting.id}
//                           className={[
//                             'truncate rounded-lg px-1.5 py-1 text-[10px] font-medium sm:text-[11px]',
//                             meeting.attended
//                               ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
//                               : 'bg-primary/10 text-primary',
//                           ].join(' ')}
//                         >
//                           {timeFormatter.format(new Date(meeting.starts_at))} · {meeting.course_name}
//                         </div>
//                       ))}

//                       {dayMeetings.length > 2 && (
//                         <div className="text-[10px] text-muted-foreground">
//                           +{dayMeetings.length - 2} لقاءات
//                         </div>
//                       )}
//                     </div>
//                   </button>
//                 );
//               })}
//             </div>
//           )}
//         </div>

//         <aside className="rounded-2xl border border-border bg-card p-4">
//           {selectedDay ? (
//             <>
//               <div className="mb-4">
//                 <p className="text-xs font-medium text-muted-foreground">اللقاءات في</p>
//                 <h3 className="mt-1 text-base font-bold text-foreground">
//                   {dateFormatter.format(selectedDay)}
//                 </h3>
//               </div>

//               {selectedMeetings.length === 0 ? (
//                 <div className="rounded-xl border border-dashed border-border px-4 py-10 text-center">
//                   <CalendarDays className="mx-auto h-8 w-8 text-muted-foreground/50" />
//                   <p className="mt-3 text-sm font-medium text-foreground">
//                     لا توجد لقاءات في هذا اليوم
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {selectedMeetings.map((meeting) => (
//                     <button
//                       key={meeting.id}
//                       onClick={() => setSelectedMeetingId(meeting.id)}
//                       className={[
//                         'w-full rounded-xl border p-3 text-right transition-colors',
//                         selectedMeetingId === meeting.id
//                           ? 'border-primary bg-primary/5'
//                           : 'border-border hover:bg-muted/40',
//                       ].join(' ')}
//                     >
//                       <div className="flex items-start gap-3">
//                         <div className="mt-0.5 rounded-lg bg-primary/10 p-2 text-primary">
//                           <Video className="h-4 w-4" />
//                         </div>
//                         <div className="min-w-0 flex-1">
//                           <p className="truncate text-sm font-semibold text-foreground">
//                             {meeting.title}
//                           </p>
//                           <p className="mt-1 text-xs text-primary">{meeting.course_name}</p>
//                           <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
//                             <Clock3 className="h-3.5 w-3.5" />
//                             {timeFormatter.format(new Date(meeting.starts_at))}
//                           </p>
//                         </div>
//                         {meeting.attended && (
//                           <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
//                         )}
//                       </div>
//                     </button>
//                   ))}
//                 </div>
//               )}

//               {selectedMeeting && (
//                 <div className="mt-4 rounded-xl border border-border bg-muted/20 p-4">
//                   <div className="flex items-start justify-between gap-3">
//                     <div>
//                       <p className="text-sm font-bold text-foreground">{selectedMeeting.title}</p>
//                       <p className="mt-1 text-xs text-primary">{selectedMeeting.course_name}</p>
//                     </div>
//                     <button
//                       onClick={() => setSelectedMeetingId(null)}
//                       className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
//                       aria-label="إغلاق التفاصيل"
//                     >
//                       <X className="h-4 w-4" />
//                     </button>
//                   </div>

//                   {selectedMeeting.description && (
//                     <p className="mt-3 text-xs leading-6 text-muted-foreground">
//                       {selectedMeeting.description}
//                     </p>
//                   )}

//                   <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
//                     <Clock3 className="h-4 w-4" />
//                     {dateFormatter.format(new Date(selectedMeeting.starts_at))} —{' '}
//                     {timeFormatter.format(new Date(selectedMeeting.starts_at))}
//                   </div>

//                   <div className="mt-4 space-y-2">
//                     {selectedMeeting.attended && (
//                       <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
//                         <CheckCircle2 className="h-4 w-4" />
//                         تم تسجيل حضورك
//                       </div>
//                     )}

//                     {selectedMeeting.can_join ? (
//                       <button
//                         onClick={() => void handleAttend(selectedMeeting)}
//                         disabled={joiningId === selectedMeeting.id}
//                         className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
//                       >
//                         {joiningId === selectedMeeting.id ? (
//                           <Loader2 className="h-4 w-4 animate-spin" />
//                         ) : (
//                           <ExternalLink className="h-4 w-4" />
//                         )}
//                         {selectedMeeting.attended ? 'الدخول مرة أخرى' : 'دخول إلى لقاء Zoom'}
//                       </button>
//                     ) : (
//                       !selectedMeeting.attended && (
//                         <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2.5 text-xs font-medium text-muted-foreground">
//                           <LockKeyhole className="h-4 w-4" />
//                           الدخول يفتح قبل اللقاء بـ 15 دقيقة
//                         </div>
//                       )
//                     )}
//                   </div>
//                 </div>
//               )}
//             </>
//           ) : null}
//         </aside>
//       </div>
//     </section>
//   );
// }

'use client';

import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { CalendarToolbar } from './zoom-calendar/Calendartoolbar';
import { DayDetailsPanel } from './zoom-calendar/Daydetailspanel';
import { Legend } from './zoom-calendar/Legend';
import { MonthView } from './zoom-calendar/Monthview';
import { TimeGrid } from './zoom-calendar/Timegrid';
import {
  addDays,
  addMonths,
  buildCalendarDays,
  dateFormatter,
  dayKey,
  fullDateFormatter,
  monthFormatter,
  monthKey,
  sameDay,
  startOfWeek,
} from './zoom-calendar/date-utils';
import type { View, ZoomMeeting } from './zoom-calendar/types';
import { useNow } from './zoom-calendar/useNow';
import { useZoomMeetings } from './zoom-calendar/useZoomMeetings';
import { MEETING_DURATION_MINUTES } from './zoom-calendar/constants';

/* ───────────────────────── ZoomCalendar.tsx ─────────────────────────
   مهمة الملف: التجميع فقط. بيمسك الـ state (الفلتر، اليوم المحدد، اللقاء المحدد)
   وبيوزّع الباقي على الملفات الصغيرة بمجلد zoom-calendar/.
   المكان نفسه (components/student/ZoomCalendar.tsx) فاستيراد الـ dashboard ما بتغير.

   خريطة الملفات:
     types / constants ........ الأنواع والقيم الثابتة
     date-utils / useNow ...... التاريخ والوقت
     useZoomMeetings .......... الـ API (جلب + حضور)
     CalendarToolbar .......... العنوان + التنقل + الفلتر
     Legend ................... مفتاح الألوان
     MonthView / TimeGrid ..... الشبكات (شهر | أسبوع ويوم)
     DayDetailsPanel .......... التقويم المصغّر + تفاصيل اللقاء
*/
function getAttendanceStats(list: ZoomMeeting[], now: number) {
  const ended = list.filter(
    (m) => new Date(m.starts_at).getTime() + MEETING_DURATION_MINUTES * 60_000 <= now,
  );
  const attended = ended.filter((m) => m.attended).length;

  return {
    ended: ended.length,
    attended,
    missed: ended.length - attended,
    // null عندما لا يوجد لقاء منتهٍ، فنعرض "—" بدل 0% مضلِّلة
    percent: ended.length > 0 ? Math.round((attended / ended.length) * 100) : null,
  };
}

export default function ZoomCalendar() {
  const [view, setView] = useState<View>('month');
  // المؤشر: اليوم المحدد (عرض اليوم/الأسبوع) ويُشتق منه الشهر
  const [cursor, setCursor] = useState(() => new Date());
  // نخزّن الـ id فقط، واللقاء نشتقه من القائمة حتى يتحدث تلقائيًا بعد الحضور
  const [selectedMeetingId, setSelectedMeetingId] = useState<number | null>(null);
  const now = useNow();

  const month = useMemo(() => new Date(cursor.getFullYear(), cursor.getMonth(), 1), [cursor]);
  const calendarDays = useMemo(() => buildCalendarDays(month), [month]);
  const weekDays = useMemo(() => {
    const start = startOfWeek(cursor);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [cursor]);

  // الأشهر التي يغطيها العرض الحالي (شهر أو شهران أو ثلاثة في عرض الشهر)
  const monthKeysSignature = useMemo(() => {
    const [start, end] =
      view === 'month'
        ? [calendarDays[0], calendarDays[calendarDays.length - 1]]
        : view === 'week'
          ? [weekDays[0], weekDays[6]]
          : [cursor, cursor];

    const keys: string[] = [];
    const walker = new Date(start.getFullYear(), start.getMonth(), 1);
    while (walker <= end) {
      keys.push(monthKey(walker));
      walker.setMonth(walker.getMonth() + 1);
    }
    return keys.join(',');
  }, [view, calendarDays, weekDays, cursor]);

  // البيانات + الحضور (المنطق كله داخل الـ hook)
  const { meetings, loading, error, joiningId, attend } = useZoomMeetings(monthKeysSignature);

  // على الجوال: عرض اليوم افتراضيًا
  useEffect(() => {
    if (window.matchMedia('(max-width: 639px)').matches) setView('day');
  }, []);

  // تجميع اللقاءات بالأيام: Map مفتاحها dayKey لسرعة البحث بكل خلية
  const meetingsByDay = useMemo(() => {
    const map = new Map<string, ZoomMeeting[]>();

    for (const meeting of meetings) {
      const key = dayKey(new Date(meeting.starts_at));
      const current = map.get(key) ?? [];
      current.push(meeting);
      map.set(key, current);
    }

    for (const list of map.values()) {
      list.sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime());
    }

    return map;
  }, [meetings]);

  const dayMeetings = meetingsByDay.get(dayKey(cursor)) ?? [];

  // لقاءات الفترة المعروضة فقط (شهر / أسبوع / يوم)
const periodMeetings = useMemo(
  () =>
    meetings.filter((m) => {
      const d = new Date(m.starts_at);
      if (view === 'month') {
        return d.getFullYear() === month.getFullYear() && d.getMonth() === month.getMonth();
      }
      if (view === 'week') return d >= weekDays[0] && d < addDays(weekDays[6], 1);
      return sameDay(d, cursor);
    }),
  [meetings, view, month, weekDays, cursor],
);

const stats = useMemo(() => getAttendanceStats(periodMeetings, now), [periodMeetings, now]);
  /* ── Navigation ── */

  const shift = (direction: 1 | -1) => {
    setCursor((current) =>
      view === 'month'
        ? addMonths(current, direction)
        : addDays(current, direction * (view === 'week' ? 7 : 1)),
    );
    setSelectedMeetingId(null);
  };

  const goToToday = () => {
    setCursor(new Date());
    setSelectedMeetingId(null);
  };

  const openDay = (day: Date) => {
    setCursor(day);
    setView('day');
    setSelectedMeetingId(null);
  };

  const changeView = (next: View) => {
    setView(next);
    setSelectedMeetingId(null);
  };

  // ضغط على شريحة لقاء: افتح عرض اليوم لذلك اللقاء مع تفاصيله (الدخول من زر التفاصيل فقط)
  const handleSelect = (meeting: ZoomMeeting) => {
    setCursor(new Date(meeting.starts_at));
    setView('day');
    setSelectedMeetingId(meeting.id);
  };

  // TODO translate
  const title =
    view === 'month'
      ? monthFormatter.format(month)
      : view === 'week'
        ? `${dateFormatter.format(weekDays[0])} – ${dateFormatter.format(weekDays[6])}`
        : fullDateFormatter.format(cursor);

  return (
    <section className="space-y-6" dir="rtl">
      {/* ✏️ EDIT HERE: عنوان الصفحة والوصف (TODO translate) */}
      <div>
        <div className="flex items-center gap-2">
          <CalendarDays className="size-5 text-primary" aria-hidden />
          <h2 className="text-xl font-semibold text-foreground">جدول لقاءات Zoom</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          تابع مواعيد اللقاءات وادخل إلى الاجتماع عندما يحين وقت الدخول.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-md border border-destructive/40 bg-destructive/15 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      )}

<div className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-lg border border-border bg-card p-4">
  <div>
    <p className="text-xs text-muted-foreground">نسبة الحضور · {title}</p> {/* TODO: translate */}
    <p className="text-2xl font-bold text-foreground">
      {stats.percent === null ? '—' : `${stats.percent}%`}
    </p>
  </div>

  <div className="min-w-[160px] flex-1">
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={stats.percent ?? 0}
      className="h-2 overflow-hidden rounded-full bg-muted"
    >
      <div className="h-full rounded-full bg-success" style={{ width: `${stats.percent ?? 0}%` }} />
    </div>
    <p className="mt-2 text-xs text-muted-foreground">
      حضرت {stats.attended} من {stats.ended} لقاءات منتهية · فاتك {stats.missed} {/* TODO: translate */}
    </p>
  </div>
</div>
      <Card className="overflow-hidden">
        <CalendarToolbar
          title={title}
          view={view}
          onViewChange={changeView}
          onPrev={() => shift(-1)}
          onNext={() => shift(1)}
          onToday={goToToday}
        />

        <Legend />

        {/* Body: حسب الفلتر يتغير شكل العرض */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="size-5 animate-spin text-primary" aria-label="جارٍ التحميل" />
          </div>
        ) : view === 'month' ? (
          <MonthView
            days={calendarDays}
            month={month}
            meetingsByDay={meetingsByDay}
            now={now}
            onSelect={handleSelect}
            onOpenDay={openDay}
          />
        ) : view === 'week' ? (
          <TimeGrid
            days={weekDays}
            meetingsByDay={meetingsByDay}
            now={now}
            onSelect={handleSelect}
            onDayClick={openDay}
          />
        ) : (
          // ✏️ EDIT HERE: عرض اللوحة الجانبية (300px) على الشاشات الكبيرة
          <div className="grid lg:grid-cols-[minmax(0,1fr)_300px]">
            <TimeGrid days={[cursor]} meetingsByDay={meetingsByDay} now={now} onSelect={handleSelect} />

            <DayDetailsPanel
              cursor={cursor}
              meetingsByDay={meetingsByDay}
              dayMeetings={dayMeetings}
              now={now}
              joiningId={joiningId}
              selectedMeetingId={selectedMeetingId}
              onJoin={(meeting) => void attend(meeting)}
              onPick={(day) => {
                setCursor(day);
                setSelectedMeetingId(null);
              }}
              onShiftMonth={(direction) => setCursor((current) => addMonths(current, direction))}
            />
          </div>
        )}
      </Card>
    </section>
  );
}