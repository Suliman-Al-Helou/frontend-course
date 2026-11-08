import { useMemo } from "react";
import { LABELS } from "../../constants/labels";
import type { ZoomMeeting } from "../../types";
import { DayDetailsPanel } from "./Daydetailspanel";
import { Legend } from "./Legend";
import { MonthView } from "./Monthview";
import { TimeGrid } from "./Timegrid";
import { getAttendanceStats } from "./attendance-stats";
import { addDays, addMonths, dayKey, sameDay } from "./date-utils";
import type { View } from "./types";

interface Props {
  meetings: ZoomMeeting[];
  view: View;
  cursor: Date;
  month: Date;
  calendarDays: Date[];
  weekDays: Date[];
  now: number;
  title: string;
  selectedMeetingId: number | null;
  joiningId: number | null;
  onJoin: (meeting: ZoomMeeting) => void;
  onSelect: (meeting: ZoomMeeting) => void;
  onOpenDay: (day: Date) => void;
  onPick: (day: Date) => void;
  onShiftMonth: (direction: 1 | -1) => void;
}

// Hooks live here (not in the QueryState render-prop) so they run unconditionally.
export function ZoomCalendarContent({
  meetings,
  view,
  cursor,
  month,
  calendarDays,
  weekDays,
  now,
  title,
  selectedMeetingId,
  joiningId,
  onJoin,
  onSelect,
  onOpenDay,
  onPick,
  onShiftMonth,
}: Props) {
  const meetingsByDay = useMemo(() => {
    const map = new Map<string, ZoomMeeting[]>();
    for (const meeting of meetings) {
      const key = dayKey(new Date(meeting.starts_at));
      map.set(key, [...(map.get(key) ?? []), meeting]);
    }
    for (const list of map.values()) {
      list.sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime());
    }
    return map;
  }, [meetings]);

  const periodMeetings = useMemo(
    () =>
      meetings.filter((m) => {
        const d = new Date(m.starts_at);
        if (view === "month") {
          return d.getFullYear() === month.getFullYear() && d.getMonth() === month.getMonth();
        }
        if (view === "week") return d >= weekDays[0] && d < addDays(weekDays[6], 1);
        return sameDay(d, cursor);
      }),
    [meetings, view, month, weekDays, cursor],
  );

  const stats = useMemo(() => getAttendanceStats(periodMeetings, now), [periodMeetings, now]);
  const dayMeetings = meetingsByDay.get(dayKey(cursor)) ?? [];

  return (
    <>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-border p-4">
        <div>
          <p className="text-xs text-muted-foreground">
            {LABELS.zoom.attendanceRate} · {title}
          </p>
          <p className="text-2xl font-semibold text-foreground">
            {stats.percent === null ? "—" : `${stats.percent}%`}
          </p>
        </div>
        <div className="min-w-40 flex-1">
          {/* Native <progress>: dynamic width without an inline style. */}
          <progress
            value={stats.percent ?? 0}
            max={100}
            aria-label={LABELS.zoom.attendanceRate}
            className="h-2 w-full appearance-none overflow-hidden rounded-full [&::-moz-progress-bar]:bg-success [&::-webkit-progress-bar]:bg-muted [&::-webkit-progress-value]:bg-success"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {LABELS.zoom.attendanceSummary(stats.attended, stats.ended, stats.missed)}
          </p>
        </div>
      </div>

      <Legend />

      {view === "month" && (
        <MonthView
          days={calendarDays}
          month={month}
          meetingsByDay={meetingsByDay}
          now={now}
          onSelect={onSelect}
          onOpenDay={onOpenDay}
        />
      )}
      {view === "week" && (
        <TimeGrid
          days={weekDays}
          meetingsByDay={meetingsByDay}
          now={now}
          onSelect={onSelect}
          onDayClick={onOpenDay}
        />
      )}
      {view === "day" && (
        <div className="grid lg:grid-cols-[minmax(0,1fr)_300px]">
          <TimeGrid days={[cursor]} meetingsByDay={meetingsByDay} now={now} onSelect={onSelect} />
          <DayDetailsPanel
            cursor={cursor}
            meetingsByDay={meetingsByDay}
            dayMeetings={dayMeetings}
            now={now}
            joiningId={joiningId}
            selectedMeetingId={selectedMeetingId}
            onJoin={onJoin}
            onPick={onPick}
            onShiftMonth={(direction) => onShiftMonth(direction)}
          />
        </div>
      )}
    </>
  );
}

export { addMonths }; // re-exported for the parent's month navigation
