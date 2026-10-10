import { AlertCircle, CalendarDays, CheckCircle2, Clock3, LockKeyhole, Video } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { MEETING_DURATION_MINUTES, STATUS_META } from './constants';
import { dateFormatter, timeFormatter } from './date-utils';
import type { Status, ZoomMeeting } from './types';

/* ───────────────────────── MeetingDetails.tsx ─────────────────────────
   مهمة الملف: بطاقة تفاصيل لقاء واحد (مثل لوحة "Product demo" بالصورة 2).
   الحالات التي تعرضها:
   - تم الحضور     → رسالة "تم تسجيل حضورك"
   - فائت          → رسالة "انتهى اللقاء ولم يتم تسجيل حضورك"
   - لم يُفتح بعد  → can_join=false وقادم: "رابط اللقاء لم يُفتح بعد"
   - مفتوح         → زر الدخول (الدخول الوحيد لـ Zoom من هون)
   الزر لا يعرف شيئًا عن الـ API: يستدعي onJoin فقط (المنطق بـ useZoomMeetings).
*/

interface MeetingDetailsProps {
  meeting: ZoomMeeting;
  status: Status;
  joining: boolean;
  onJoin: (meeting: ZoomMeeting) => void;
  active?: boolean; // اللقاء المضغوط عليه من الشبكة
  className?: string;
}

export function MeetingDetails({
  meeting,
  status,
  joining,
  onJoin,
  active = false,
  className,
}: MeetingDetailsProps) {
  const meta = STATUS_META[status];
  const StatusIcon = meta.icon;
  const start = new Date(meeting.starts_at);
  const end = new Date(start.getTime() + MEETING_DURATION_MINUTES * 60_000);

  return (
    <Card className={cn(active && 'border-primary', className)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{meeting.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">{meeting.course_name}</p>
          </div>
          <Badge variant={meta.badge}>
            <StatusIcon aria-hidden />
            {meta.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {meeting.description && (
          <p className="text-xs leading-6 text-muted-foreground">{meeting.description}</p>
        )}

        {/* التاريخ والوقت (البداية – النهاية حسب المدة الثابتة) */}
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0" aria-hidden />
            {dateFormatter.format(start)}
          </div>
          <div className="flex items-center gap-2">
            <Clock3 className="size-4 shrink-0" aria-hidden />
            {timeFormatter.format(start)} – {timeFormatter.format(end)}
          </div>
        </div>

        {/* ✏️ EDIT HERE: رسائل الحالة (TODO translate) */}
        {meeting.attended && (
          <div className="flex items-center gap-2 rounded-md border border-success/40 bg-success/15 px-3 py-2 text-sm font-semibold text-success">
            <CheckCircle2 className="size-4 shrink-0" aria-hidden />
            تم تسجيل حضورك
          </div>
        )}

        {status === 'missed' && (
          <div className="flex items-center gap-2 rounded-md border border-destructive/40 bg-destructive/15 px-3 py-2 text-sm font-semibold text-destructive">
            <AlertCircle className="size-4 shrink-0" aria-hidden />
            انتهى اللقاء ولم يتم تسجيل حضورك
          </div>
        )}

        {meeting.can_join ? (
          <Button
            type="button"
            className="w-full"
            variant={meeting.attended ? 'outlineSuccess' : 'default'}
            loading={joining}
            onClick={() => onJoin(meeting)}
          >
            {!joining && <Video aria-hidden />}
            {meeting.attended ? 'الدخول مرة أخرى' : 'دخول إلى لقاء Zoom'}
          </Button>
        ) : (
          status === 'upcoming' && (
            <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground">
              <LockKeyhole className="size-4 shrink-0" aria-hidden />
              رابط اللقاء لم يُفتح بعد، يفتح الدخول قبل اللقاء بـ 15 دقيقة
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}