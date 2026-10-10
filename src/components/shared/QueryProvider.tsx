// components/shared/QueryProvider.tsx
'use client';

import { useState } from "react";
// 1. استيراد المكونات المطلوبة من المكتبة
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mapApiError } from "@/lib/errors/mapApiError";

interface QueryProviderProps {
  children: React.ReactNode;
}

export default function QueryProvider({ children }: QueryProviderProps) {
  // 2. تعريف الـ State بالداخل لحفظ الـ client بشكل آمن بين التحديثات (Renders)
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { 
      queries: {
        staleTime: 30_000,
        retry: (count, err) => {
          const apiError = mapApiError(err);
          // تأكد من وجود خاصية status لتجنب أخطاء TypeScript
          return apiError && apiError.status >= 500 && count < 2;
        },
      }
    },
  }));

  // 3. تغليف العناصر الابنة بموفر البيانات
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
