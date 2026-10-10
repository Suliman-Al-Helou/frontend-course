import { cn } from '@/lib/utils';
import { STATUS_META } from './constants';
import { timeFormatter } from './date-utils';
import type { Status, ZoomMeeting } from './types';

/* ───────────────────────── MeetingChip.tsx ─────────────────────────
   مهمة الملف: شريحة واحدة تمثّل لقاء داخل الشبكة (وقت اللقاء + رابط Zoom).
   لونها وأيقونتها حسب الحالة (primary / success / destructive) من STATUS_META.
   الضغط عليها: يفتح عرض اليوم مع التفاصيل (الدخول لـ Zoom ليس من هون).

   block = false → سطر واحد داخل خلية الشهر
   block = true  → بلوك بارتفاع ساعة داخل شبكة الأسبوع/اليوم
*/

interface MeetingChipProps {
  meeting: ZoomMeeting;
  status: Status;
  onSelect: (meeting: ZoomMeeting) => void;
  block?: boolean;
}

export function MeetingChip({ meeting, status, onSelect, block = false }: MeetingChipProps) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  const time = timeFormatter.format(new Date(meeting.starts_at));

  return (
    <button
      type="button"
      onClick={() => onSelect(meeting)}
      // الألوان وحدها ما بتكفي: الحالة مكتوبة لقارئ الشاشة
      aria-label={`Zoom ${time} — ${meta.label}`}
      className={cn(
        'relative z-10 flex w-full overflow-hidden rounded-md border text-start font-semibold transition-colors duration-150',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
        // ✏️ EDIT HERE: تباعد وحجم الشريحة (سطر واحد / بلوك)
        block 
 ? 'min-h-full h-fit flex-col items-start justify-between gap-0.5 p-1.5 text-[11px] leading-tight' 
          : 'items-center gap-1 px-2 py-1 text-xs',        meta.chip,
      )}
    >
      <span className="flex items-center gap-1">
        <Icon className="size-4 shrink-0" aria-hidden />
        <span>{time}</span>
      </span>
      {/* ✏️ EDIT HERE: نص الرابط (TODO translate) */}
      <span className="truncate">Zoom</span>
    </button>
  );
}