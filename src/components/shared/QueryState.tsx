'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import type { UseQueryResult } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ERROR_CODES } from '@/lib/errors/codes';
import { mapApiError } from '@/lib/errors/mapApiError';
import { ERROR_MESSAGES_AR } from '@/lib/errors/messages';
import { EmptyState } from './states/EmptyState';
import { ErrorState } from './states/ErrorState';
import { NotFoundState } from './states/NotFoundState';

/* ───────────────────────── QueryState.tsx ─────────────────────────
   مهمة الملف: يقرر "شو نعرض" لأي query من TanStack Query، بمكان واحد:
     جاري التحميل → skeleton
     فشل 404      → NotFoundState
     فشل 401      → رسالة انتهاء الجلسة + زر تسجيل الدخول
     فشل غيره     → ErrorState + زر إعادة المحاولة
     نجح وفارغ    → EmptyState
     نجح          → children(data)

   قاعدة مهمة: لو عندنا بيانات قديمة وفشل التحديث بالخلفية، بنضل نعرض البيانات
   (أحسن من إخفائها بشاشة خطأ).

   الاستخدام:
     <QueryState query={q} skeleton={<XSkeleton />} isEmpty={(d) => d.length === 0}>
       {(data) => <X data={data} />}
     </QueryState>
*/

interface QueryStateProps<T> {
  query: UseQueryResult<T, unknown>;
  skeleton: ReactNode;
  isEmpty?: (data: T) => boolean;
  empty?: ReactNode; // بديل للـ EmptyState الافتراضي
  children: (data: T) => ReactNode;
}

export function QueryState<T>({ query, skeleton, isEmpty, empty, children }: QueryStateProps<T>) {
  if (query.isPending) return <>{skeleton}</>;

  // فشل ولا يوجد أي بيانات نعرضها
  if (query.isError && query.data === undefined) {
    const error = mapApiError(query.error);

    if (error.status === 404) return <NotFoundState />;

    if (error.status === 401) {
      return (
        <ErrorState message={ERROR_MESSAGES_AR[ERROR_CODES.AUTH_SESSION_EXPIRED]}>
          <Button asChild className="w-full sm:w-auto">
            {/* TODO translate */}
            <Link href="/login">تسجيل الدخول</Link>
          </Button>
        </ErrorState>
      );
    }

    return <ErrorState message={error.message} onRetry={() => void query.refetch()} retrying={query.isFetching} />;
  }

  const data = query.data as T;
  if (isEmpty?.(data)) return <>{empty ?? <EmptyState />}</>;

  return <>{children(data)}</>;
}