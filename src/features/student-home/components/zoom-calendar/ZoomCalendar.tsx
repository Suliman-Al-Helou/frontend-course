"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";
import { QueryState } from "@/components/shared/QueryState";
import { Card } from "@/components/ui/card";
import { LABELS } from "../../constants/labels";
import { useJoinZoomMeeting } from "../../queries/useJoinZoomMeeting";
import { useZoomMeetings } from "../../queries/useZoomMeetings";
import type { ZoomMeeting } from "../../types";
import { CalendarToolbar } from "./Calendartoolbar";
import { ZoomCalendarContent } from "./ZoomCalendarContent";
import {
  addDays,
  addMonths,
  buildCalendarDays,
  dateFormatter,
  fullDateFormatter,
  monthFormatter,
  monthKey,
  startOfWeek,
} from "./date-utils";
import type { View } from "./types";
import { useNow } from "./useNow";

function CalendarSkeleton() {
  return <div className="h-64 animate-pulse bg-muted" aria-hidden />;
}

export default function ZoomCalendar() {
  const [view, setView] = useState<View>("month");
  const [cursor, setCursor] = useState(() => new Date());
  const [selectedMeetingId, setSelectedMeetingId] = useState<number | null>(null);
  const now = useNow();

  const month = useMemo(() => new Date(cursor.getFullYear(), cursor.getMonth(), 1), [cursor]);
  const calendarDays = useMemo(() => buildCalendarDays(month), [month]);
  const weekDays = useMemo(() => {
    const start = startOfWeek(cursor);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [cursor]);

  // Months covered by the visible range (1–3), as a stable string for the query key.
  const monthsSignature = useMemo(() => {
    const [start, end] =
      view === "month"
        ? [calendarDays[0], calendarDays[calendarDays.length - 1]]
        : view === "week"
          ? [weekDays[0], weekDays[6]]
          : [cursor, cursor];

    const keys: string[] = [];
    const walker = new Date(start.getFullYear(), start.getMonth(), 1);
    while (walker <= end) {
      keys.push(monthKey(walker));
      walker.setMonth(walker.getMonth() + 1);
    }
    return keys.join(",");
  }, [view, calendarDays, weekDays, cursor]);

  const query = useZoomMeetings(monthsSignature);
  const { join, joiningId } = useJoinZoomMeeting();

  // Mobile defaults to the day view (UI-only effect, no server data).
  useEffect(() => {
    if (window.matchMedia("(max-width: 639px)").matches) setView("day");
  }, []);

  const shift = (direction: 1 | -1) => {
    setCursor((c) =>
      view === "month"
        ? addMonths(c, direction)
        : addDays(c, direction * (view === "week" ? 7 : 1)),
    );
    setSelectedMeetingId(null);
  };
  const goToToday = () => {
    setCursor(new Date());
    setSelectedMeetingId(null);
  };
  const openDay = (day: Date) => {
    setCursor(day);
    setView("day");
    setSelectedMeetingId(null);
  };
  const changeView = (next: View) => {
    setView(next);
    setSelectedMeetingId(null);
  };
  const handleSelect = (meeting: ZoomMeeting) => {
    setCursor(new Date(meeting.starts_at));
    setView("day");
    setSelectedMeetingId(meeting.id);
  };

  const title =
    view === "month"
      ? monthFormatter.format(month)
      : view === "week"
        ? `${dateFormatter.format(weekDays[0])} – ${dateFormatter.format(weekDays[6])}`
        : fullDateFormatter.format(cursor);

  return (
    <section className="space-y-6" dir="rtl">
      <div>
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-primary" aria-hidden />
          <h2 className="text-xl font-semibold text-foreground">{LABELS.zoom.title}</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{LABELS.zoom.subtitle}</p>
      </div>

      <Card className="overflow-hidden">
        {/* Toolbar stays outside QueryState so the user can navigate away from a failed month. */}
        <CalendarToolbar
          title={title}
          view={view}
          onViewChange={changeView}
          onPrev={() => shift(-1)}
          onNext={() => shift(1)}
          onToday={goToToday}
        />
        <QueryState query={query} skeleton={<CalendarSkeleton />}>
          {(meetings) => (
            <ZoomCalendarContent
              meetings={meetings}
              view={view}
              cursor={cursor}
              month={month}
              calendarDays={calendarDays}
              weekDays={weekDays}
              now={now}
              title={title}
              selectedMeetingId={selectedMeetingId}
              joiningId={joiningId}
              onJoin={join}
              onSelect={handleSelect}
              onOpenDay={openDay}
              onPick={(day) => {
                setCursor(day);
                setSelectedMeetingId(null);
              }}
              onShiftMonth={(direction) => setCursor((c) => addMonths(c, direction))}
            />
          )}
        </QueryState>
      </Card>
    </section>
  );
}
