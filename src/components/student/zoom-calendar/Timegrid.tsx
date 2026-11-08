import { cn } from '@/lib/utils';
import { MeetingChip } from './Meetingchip';
import {
  DEFAULT_END_HOUR,
  DEFAULT_START_HOUR,
  HOUR_HEIGHT,
  MEETING_DURATION_MINUTES,
} from './constants';
import { dayKey, getStatus, hourFormatter, minutesOfDay, sameDay, weekdayName } from './date-utils';
import { layoutDay } from './layoutday';
import type { ZoomMeeting } from './types';

/* ───────────────────────── TimeGrid.tsx ─────────────────────────
   مهمة الملف: شبكة الساعات. تُستخدم لعرضين:
   - الأسبوع: days = 7 أيام + onDayClick (ضغط على رأس اليوم يفتح عرض اليوم)
   - اليوم:   days = [يوم واحد]
   كل لقاء = بلوك بارتفاع المدة (60 دقيقة) بموقعه حسب ساعة البداية.
*/

interface TimeGridProps {
  days: Date[];
  meetingsByDay: Map<string, ZoomMeeting[]>;
  now: number;
  onSelect: (meeting: ZoomMeeting) => void;
  onDayClick?: (day: Date) => void;
}

// ✏️ EDIT HERE: أقصى ارتفاع للشبكة قبل ظهور scroll (px)
const MAX_GRID_HEIGHT = 620;
// عرض عمود الساعات (px)
const HOURS_COLUMN = 56;

export function TimeGrid({ days, meetingsByDay, now, onSelect, onDayClick }: TimeGridProps) {
  const nowDate = new Date(now);
  const lists = days.map((day) => meetingsByDay.get(dayKey(day)) ?? []);
  const all = lists.flat();

  // نطاق الساعات: من أول لقاء − ساعة إلى آخر لقاء + ساعة، وإلا الافتراضي (constants.ts)
  let startHour = DEFAULT_START_HOUR;
  let endHour = DEFAULT_END_HOUR;
  if (all.length > 0) {
    const starts = all.map((m) => minutesOfDay(new Date(m.starts_at)));
    startHour = Math.max(0, Math.floor(Math.min(...starts) / 60) - 1);
    endHour = Math.min(24, Math.ceil((Math.max(...starts) + MEETING_DURATION_MINUTES) / 60) + 1);
  }

  const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
  const totalHeight = hours.length * HOUR_HEIGHT;
  const columns = `${HOURS_COLUMN}px repeat(${days.length}, minmax(0, 1fr))`;
  const multi = days.length > 1;

  return (
    <div className="overflow-auto" style={{ maxHeight: MAX_GRID_HEIGHT }}>
      {/* الأسبوع: عرض أدنى ثم scroll أفقي داخل الشبكة فقط */}
      <div className={multi ? 'min-w-3xl' : ''}>
        {/* Header: اسم اليوم + رقمه */}
        <div
          className="sticky top-0 z-30 grid border-b border-border bg-background"
          style={{ gridTemplateColumns: columns }}
        >
          <div />
          {days.map((day) => {
            const isToday = sameDay(day, nowDate);
            const content = (
              <>
                <span className="text-xs font-semibold text-muted-foreground">{weekdayName(day)}</span>
                <span
                  className={cn(
                    'inline-flex size-8 items-center justify-center rounded-full text-xs font-semibold',
                    isToday ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground',
                  )}
                >
                  {day.getDate()}
                </span>
              </>
            );

            return onDayClick ? (
              <button
                key={dayKey(day)}
                type="button"
                onClick={() => onDayClick(day)}
                className="flex flex-col items-center gap-1 border-s border-border py-2 transition-colors duration-150 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {content}
              </button>
            ) : (
              <div
                key={dayKey(day)}
                className="flex flex-col items-center gap-1 border-s border-border py-2"
              >
                {content}
              </div>
            );
          })}
        </div>

        {/* Body */}
        <div className="grid" style={{ gridTemplateColumns: columns }}>
          {/* عمود الساعات */}
          <div>
            {hours.map((hour) => (
              <div
                key={hour}
                className="px-2 pt-1 text-end text-xs text-muted-foreground"
                style={{ height: HOUR_HEIGHT }}
              >
                {hourFormatter.format(new Date(2000, 0, 1, hour))}
              </div>
            ))}
          </div>

          {/* أعمدة الأيام */}
          {days.map((day, index) => {
            const { placed, lanes } = layoutDay(lists[index]);
            const showNow = sameDay(day, nowDate);
            const nowTop = ((minutesOfDay(nowDate) - startHour * 60) / 60) * HOUR_HEIGHT;

            return (
              <div
                key={dayKey(day)}
                className="relative border-s border-border"
                style={{ height: totalHeight }}
              >
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="border-b border-border/60"
                    style={{ height: HOUR_HEIGHT }}
                  />
                ))}

                {placed.map(({ meeting, lane }) => {
                  const top =
                    ((minutesOfDay(new Date(meeting.starts_at)) - startHour * 60) / 60) *
                    HOUR_HEIGHT;
                  const height = (MEETING_DURATION_MINUTES / 60) * HOUR_HEIGHT;

                  return (
                    <div
                      key={meeting.id}
                      className="absolute p-1"
                      style={{
                        top,
                        height,
                        width: `${100 / lanes}%`,
                        insetInlineStart: `${(lane / lanes) * 100}%`,
                      }}
                    >
                      <MeetingChip
                        meeting={meeting}
                        status={getStatus(meeting, now)}
                        onSelect={onSelect}
                        block
                      />
                    </div>
                  );
                })}

                {/* خط الوقت الحالي */}
                {showNow && nowTop >= 0 && nowTop <= totalHeight && (
                  <div
                    className="pointer-events-none absolute inset-x-0 z-20 h-px bg-foreground/50"
                    style={{ top: nowTop }}
                  >
                    <span className="absolute -start-1 -top-1 size-2 rounded-full bg-foreground/60" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}