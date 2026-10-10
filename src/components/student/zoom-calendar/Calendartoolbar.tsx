import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VIEW_LABELS } from './constants';
import type { View } from './types';

/* ───────────────────────── CalendarToolbar.tsx ─────────────────────────
   مهمة الملف: شريط أعلى التقويم:
   العنوان (الشهر / نطاق الأسبوع / اليوم) + التنقل (السابق، اليوم، التالي) + فلتر العرض.
   ما فيه منطق: كل ضغطة بتنادي callback من ZoomCalendar.tsx.
   على الجوال: العنوان فوق والتحكم تحته (mobile first).
*/

interface CalendarToolbarProps {
  title: string;
  view: View;
  onViewChange: (view: View) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

// ترتيب خيارات الفلتر. ✏️ EDIT HERE: النصوص من VIEW_LABELS بـ constants.ts
const VIEW_OPTIONS: View[] = ['month', 'week', 'day'];

export function CalendarToolbar({
  title,
  view,
  onViewChange,
  onPrev,
  onNext,
  onToday,
}: CalendarToolbarProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>

      <div className="flex items-center gap-2">
        {/* RTL: "السابق" يمين و"التالي" يسار */}
        <Button type="button" variant="secondary" size="icon" onClick={onPrev} aria-label="السابق">
          <ChevronRight aria-hidden />
        </Button>
        {/* ✏️ EDIT HERE: نص زر العودة لليوم (TODO translate) */}
        <Button type="button" variant="secondary" onClick={onToday}>
          اليوم
        </Button>
        <Button type="button" variant="secondary" size="icon" onClick={onNext} aria-label="التالي">
          <ChevronLeft aria-hidden />
        </Button>

        {/* dir="rtl" ضروري: قائمة الـ Select تنرسم بـ Portal خارج الـ section،
            فما بتورث الاتجاه وبتطلع LTR بدونه */}
        <Select dir="rtl" value={view} onValueChange={(next) => onViewChange(next as View)}>
          <SelectTrigger className="flex-1 sm:flex-none" aria-label="طريقة العرض">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VIEW_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {VIEW_LABELS[option]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}