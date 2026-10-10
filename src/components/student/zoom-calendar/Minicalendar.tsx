import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WEEK_DAYS } from './constants';
import { buildCalendarDays, dayKey, monthFormatter, sameDay } from './date-utils';
import type { ZoomMeeting } from './types';

/* ───────────────────────── MiniCalendar.tsx ─────────────────────────
   مهمة الملف: التقويم الصغير بعرض اليوم (مثل الصورة 2).
   - نقطة تحت اليوم إذا فيه لقاءات
   - اليوم المحدد = primary (حالة نشطة)، واليوم الحالي = إطار
   - cursor = اليوم المحدد، ومنه يُشتق الشهر المعروض
*/

interface MiniCalendarProps {
  cursor: Date;
  meetingsByDay: Map<string, ZoomMeeting[]>;
  onPick: (day: Date) => void;
  onShiftMonth: (direction: 1 | -1) => void;
}

export function MiniCalendar({ cursor, meetingsByDay, onPick, onShiftMonth }: MiniCalendarProps) {
  const days = useMemo(
    () => buildCalendarDays(new Date(cursor.getFullYear(), cursor.getMonth(), 1)),
    [cursor],
  );
  const today = new Date();

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        {/* RTL: "السابق" على اليمين */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onShiftMonth(-1)}
          aria-label="الشهر السابق"
        >
          <ChevronRight aria-hidden />
        </Button>
        <span className="text-sm font-semibold text-foreground">{monthFormatter.format(cursor)}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onShiftMonth(1)}
          aria-label="الشهر التالي"
        >
          <ChevronLeft aria-hidden />
        </Button>
      </div>

      <div className="grid grid-cols-7 text-center">
        {WEEK_DAYS.map((day) => (
          <span key={day} className="pb-2 text-xs text-muted-foreground">
            {day.replace('ال', '').slice(0, 3)}
          </span>
        ))}

        {days.map((day) => {
          // أيام الأشهر المجاورة: خلية فاضية للحفاظ على الترتيب
          if (day.getMonth() !== cursor.getMonth()) return <span key={dayKey(day)} />;

          const hasMeetings = (meetingsByDay.get(dayKey(day))?.length ?? 0) > 0;
          const selected = sameDay(day, cursor);

          return (
            <Button
              key={dayKey(day)}
              type="button"
              size="sm"
              variant={selected ? 'default' : sameDay(day, today) ? 'outline' : 'ghost'}
              onClick={() => onPick(day)}
              className="flex-col gap-1"
            >
              {day.getDate()}
              <span
                aria-hidden
                className={`size-1 rounded-full ${
                  hasMeetings ? (selected ? 'bg-primary-foreground' : 'bg-primary') : 'bg-transparent'
                }`}
              />
            </Button>
          );
        })}
      </div>
    </div>
  );
}