import Link from 'next/link';
import { BookOpen, Home, SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StateMessage } from './Statemessage';

/* ───────────────────────── NotFoundState.tsx ─────────────────────────
   مهمة الملف: واجهة "غير موجود" (404).
   تُستخدم من: app/not-found.tsx (fullPage) + QueryState (لما الـ API يرجّع 404).
   Server Component (بدون hooks) فبتنفع بالاثنين.
   ✏️ EDIT HERE: النصوص والأزرار (TODO translate)
*/

interface NotFoundStateProps {
  title?: string;
  description?: string;
  fullPage?: boolean;
}

export function NotFoundState({
  title = 'غير موجود',
  description = 'المحتوى الذي تبحث عنه غير موجود أو تم نقله.',
  fullPage = false,
}: NotFoundStateProps) {
  return (
    <StateMessage icon={SearchX} title={title} description={description} fullPage={fullPage}>
      <Button asChild className="w-full sm:w-auto">
        <Link href="/">
          <Home aria-hidden />
          الصفحة الرئيسية
        </Link>
      </Button>
      <Button asChild variant="secondary" className="w-full sm:w-auto">
        <Link href="/courses">
          <BookOpen aria-hidden />
          تصفح الكورسات
        </Link>
      </Button>
    </StateMessage>
  );
}