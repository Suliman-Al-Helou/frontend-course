import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { StateMessage } from './Statemessage';

/* ───────────────────────── EmptyState.tsx ─────────────────────────
   مهمة الملف: واجهة "نجح الطلب لكن ما في بيانات" (مختلفة تمامًا عن الخطأ).
   مثال: "لا توجد كورسات مسجّل فيها بعد" + زر "تصفح الكورسات" (children).
   ✏️ EDIT HERE: الافتراضي (TODO translate)
*/

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  children?: ReactNode; // زر الإجراء المقترح
}

export function EmptyState({
  icon = Inbox,
  title = 'لا توجد بيانات بعد',
  description,
  children,
}: EmptyStateProps) {
  return (
    <StateMessage icon={icon} title={title} description={description} role="status">
      {children}
    </StateMessage>
  );
}