import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MeetingChip } from './Meetingchip';
import { STATUS_META, WEEK_DAYS } from './constants';
import { dateFormatter, dayKey, getStatus, sameDay } from './date-utils';
import type { ZoomMeeting } from './types';

/* ───────────────────────── MonthView.tsx ─────────────────────────
   مهمة الملف: شبكة الشهر (7 أعمدة). كل خلية فيها رقم اليوم + شرائح لقاءاته.
   - رقم اليوم: زر يفتح عرض اليوم (يغطي الخلية كلها).
   - الشريحة: تفتح عرض اليوم مع تفاصيل اللقاء (القرار يتخذه الأب عبر onSelect).
   - الجوال: نقاط ملوّنة فقط (الشبكة ضيقة)، والتفاصيل من عرض اليوم.
*/

interface MonthViewProps {
  days: Date[]; // خلايا الشبكة (من buildCalendarDays)
  month: Date;
  meetingsByDay: Map<string, ZoomMeeting[]>;
  now: number;
  onSelect: (meeting: ZoomMeeting) => void;
  onOpenDay: (day: Date) => void;
}

// ✏️ EDIT HERE: كم شريحة تظهر بالخلية قبل "+N لقاءات"
const MAX_CHIPS_PER_DAY = 2;

export function MonthView({ days, month, meetingsByDay, now, onSelect, onOpenDay }: MonthViewProps) {
  const today = new Date(now);

  return (
    <>
      {/* أسماء الأيام */}
      <div className="grid grid-cols-7 border-b border-border bg-muted/30">
        {WEEK_DAYS.map((day) => (
          <div key={day} className="px-1 py-3 text-center text-xs font-semibold text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* الخلايا */}
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const list = meetingsByDay.get(dayKey(day)) ?? [];
          const inMonth = day.getMonth() === month.getMonth();

          return (
            <div
              key={dayKey(day)}
              className={cn(
                'relative min-h-16 border-b border-s border-border p-2',
                inMonth ? 'bg-background' : 'bg-muted/10',
              )}
            >
              {/* الزر يغطي الخلية كلها (after) فيفتح عرض اليوم */}
              <Button
                type="button"
                size="sm"
                variant={sameDay(day, today) ? 'default' : 'ghost'}
                onClick={() => onOpenDay(day)}
                aria-label={dateFormatter.format(day)}
                className={cn('after:absolute after:inset-0', !inMonth && 'opacity-50')}
              >
                {day.getDate()}
              </Button>

              {/* Desktop: شرائح (وقت + Zoom) */}
              <div className="mt-2 hidden space-y-1 sm:block">
                {list.slice(0, MAX_CHIPS_PER_DAY).map((meeting) => (
                  <MeetingChip
                    key={meeting.id}
                    meeting={meeting}
                    status={getStatus(meeting, now)}
                    onSelect={onSelect}
                  />
                ))}
                {list.length > MAX_CHIPS_PER_DAY && (
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={() => onOpenDay(day)}
                    className="relative z-10"
                  >
                    {/* TODO translate */}+{list.length - MAX_CHIPS_PER_DAY} لقاءات
                  </Button>
                )}
              </div>

              {/* Mobile: نقاط ملوّنة فقط */}
              <div className="mt-2 flex flex-wrap gap-1 sm:hidden">
                {list.map((meeting) => (
                  <span
                    key={meeting.id}
                    className={cn('size-2 rounded-full', STATUS_META[getStatus(meeting, now)].dot)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}