import type { ZoomMeeting } from "../../types";

export interface AttendanceStats {
  ended: number;
  attended: number;
  missed: number;
  percent: number | null; // null = no ended meeting (show "—", not a misleading 0%)
}

// "attended" = server-confirmed attendance only (not just "joined").
export function getAttendanceStats(list: ZoomMeeting[], now: number): AttendanceStats {
  const ended = list.filter((m) => new Date(m.ends_at).getTime() <= now);
  const attended = ended.filter((m) => m.attended).length;

  return {
    ended: ended.length,
    attended,
    missed: ended.length - attended,
    percent: ended.length > 0 ? Math.round((attended / ended.length) * 100) : null,
  };
}
