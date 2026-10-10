'use client';

import './globals.css';
import { ErrorState } from '@/components/shared/states/ErrorState';

/* يلتقط الأخطاء داخل app/layout.tsx نفسه (error.tsx ما بيقدر).
   لأنه بيحل مكان الـ layout كله لازم يكتب <html> و<body> بنفسه. */

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <ErrorState fullPage onRetry={reset} />
      </body>
    </html>
  );
}