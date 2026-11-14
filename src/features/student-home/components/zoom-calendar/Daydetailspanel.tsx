import { CalendarDays } from "lucide-react";
import { EmptyState } from "@/components/shared/states/EmptyState";
import { MeetingDetails } from "./Meetingdetails";
import { MiniCalendar } from "./Minicalendar";
import { getStatus } from "./date-utils";
import type { ZoomMeeting } from "./types";

/* ───────────────────────── DayDetailsPanel.tsx ─────────────────────────
   مهمة الملف: اللوحة الجانبية بعرض اليوم (مثل الصورة 2):
   التقويم المصغّر ثم تفاصيل كل لقاءات اليوم المحدد.
   على الجوال تنزل تحت الشبكة (الـ border يتبدل من الأب).
   لا تحتفظ بأي state: كل شي يجيها props من ZoomCalendar.tsx.
*/

interface DayDetailsPanelProps {
  cursor: Date;
  meetingsByDay: Map<string, ZoomMeeting[]>;
  dayMeetings: ZoomMeeting[];
  now: number;
  joiningId: number | null;
  selectedMeetingId: number | null;
  onJoin: (meeting: ZoomMeeting) => void;
  onPick: (day: Date) => void;
  onShiftMonth: (direction: 1 | -1) => void;
}

export function DayDetailsPanel({
  cursor,
  meetingsByDay,
  dayMeetings,
  now,
  joiningId,
  selectedMeetingId,
  onJoin,
  onPick,
  onShiftMonth,
}: DayDetailsPanelProps) {
  return (
    <aside className="space-y-6 border-t border-border p-4 lg:border-s lg:border-t-0">
      <MiniCalendar
        cursor={cursor}
        meetingsByDay={meetingsByDay}
        onPick={onPick}
        onShiftMonth={onShiftMonth}
      />

      <div>
        {/* ✏️ EDIT HERE: عناوين اللوحة (TODO translate) */}
        <h4 className="mb-3 text-sm font-semibold text-foreground">لقاءات هذا اليوم</h4>

        {dayMeetings.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="لا توجد لقاءات في هذا اليوم"
            description="اختر يوماً آخر من التقويم للاطلاع على جدول الحصص"
          />
        ) : (
          <div className="space-y-3">
            {dayMeetings.map((meeting) => (
              <MeetingDetails
                key={meeting.id}
                meeting={meeting}
                status={getStatus(meeting, now)}
                joining={joiningId === meeting.id}
                active={selectedMeetingId === meeting.id}
                onJoin={onJoin}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
