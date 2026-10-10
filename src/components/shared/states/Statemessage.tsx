import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ───────────────────────── StateMessage.tsx ─────────────────────────
   مهمة الملف: الهيكل البصري الواحد لكل حالات الصفحة غير الناجحة
   (أيقونة + عنوان + وصف + أزرار). NotFoundState و ErrorState و EmptyState
   كلهم "غلاف رفيع" فوقه، فأي تعديل على الشكل بيصير من مكان واحد.

   fullPage = true  → يملأ الشاشة (صفحات 404 / error)
   fullPage = false → داخل قسم من الصفحة (بطاقة فاشلة بالـ dashboard مثلًا)
   Mobile first: محتوى بالنص، والأزرار تحت بعض بعرض كامل، وبجنب بعض من sm.
*/

interface StateMessageProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  tone?: 'muted' | 'destructive';
  fullPage?: boolean;
  role?: 'alert' | 'status'; // alert للأخطاء: قارئ الشاشة بيعلنها فورًا
  children?: ReactNode; // الأزرار
}

export function StateMessage({
  icon: Icon,
  title,
  description,
  tone = 'muted',
  fullPage = false,
  role,
  children,
}: StateMessageProps) {
  // صفحة كاملة = العنوان الرئيسي h1، وداخل قسم = h2
  const Heading = fullPage ? 'h1' : 'h2';

  return (
    <div
      role={role}
      className={cn(
        'flex flex-col items-center justify-center gap-6 px-4 text-center',
        fullPage ? 'min-h-screen bg-background' : 'py-12',
      )}
    >
      <div
        className={cn(
          'flex size-12 items-center justify-center rounded-md',
          tone === 'destructive' ? 'bg-destructive/10 text-destructive' : 'bg-muted text-muted-foreground',
        )}
      >
        <Icon className="size-5" aria-hidden />
      </div>

      <div className="max-w-lg space-y-2">
        <Heading className="text-xl font-semibold text-foreground">{title}</Heading>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>

      {children && <div className="flex w-full max-w-lg flex-col gap-3 sm:w-auto sm:flex-row">{children}</div>}
    </div>
  );
}