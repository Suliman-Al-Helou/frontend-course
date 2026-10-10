'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ERROR_CODES } from '@/lib/errors/codes';
import { ERROR_MESSAGES_AR } from '@/lib/errors/messages';
import { StateMessage } from './Statemessage';

/* ───────────────────────── ErrorState.tsx ─────────────────────────
   مهمة الملف: واجهة "فشل" (سيرفر واقع / انقطاع نت / خطأ غير متوقع).
   - onRetry موجود  → زر "إعادة المحاولة" (يعيد ما فشل فقط، مو الصفحة كلها)
   - children       → أزرار مخصصة تحل مكان الافتراضية (مثال: تسجيل الدخول عند 401)
   'use client' لأنها تربط onClick بزر.
   ✏️ EDIT HERE: النصوص (TODO translate)
*/

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  retrying?: boolean;
  fullPage?: boolean;
  children?: ReactNode;
}

export function ErrorState({
  message = ERROR_MESSAGES_AR[ERROR_CODES.SYS_UNKNOWN],
  onRetry,
  retrying = false,
  fullPage = false,
  children,
}: ErrorStateProps) {
  return (
    <StateMessage
      icon={AlertTriangle}
      tone="destructive"
      role="alert"
      title="حدث خطأ"
      description={message}
      fullPage={fullPage}
    >
      {children ?? (
        <>
          {onRetry && (
            <Button type="button" className="w-full sm:w-auto" loading={retrying} onClick={onRetry}>
              <RefreshCw aria-hidden />
              إعادة المحاولة
            </Button>
          )}
          {fullPage && (
            <Button asChild variant="secondary" className="w-full sm:w-auto">
              <Link href="/">
                <Home aria-hidden />
                الصفحة الرئيسية
              </Link>
            </Button>
          )}
        </>
      )}
    </StateMessage>
  );
}