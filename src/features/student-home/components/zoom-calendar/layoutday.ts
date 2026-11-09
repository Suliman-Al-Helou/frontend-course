import type { ZoomMeeting } from "@/features/student-home/types";

/* ───────────────────────── layoutDay.ts ─────────────────────────
   مهمة الملف: يوزّع لقاءات اليوم على "مسارات" (lanes) حتى لا يركب بلوك على بلوك
   إذا تداخل لقاءان بالوقت. المنطق منقول كما هو.

   الفكرة: نرتّب اللقاءات بالوقت، ونعطي كل لقاء أول مسار انتهى قبل بدايته.
   laneEnds[i] = وقت انتهاء آخر لقاء بالمسار i.
   لو ما في مسار فاضي، نفتح مسار جديد.
*/

export function layoutDay(list: ZoomMeeting[]) {
  const sorted = [...list].sort(
    (a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime(),
  );
  const laneEnds: number[] = [];

  const placed = sorted.map((meeting) => {
    const start = new Date(meeting.starts_at).getTime();
    let lane = laneEnds.findIndex((end) => end <= start);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(0);
    }
    laneEnds[lane] = new Date(meeting.ends_at).getTime();
    return { meeting, lane };
  });

  return { placed, lanes: Math.max(1, laneEnds.length) };
}
