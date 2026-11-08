import { defaultShouldDehydrateQuery, isServer, QueryClient } from "@tanstack/react-query";
import { mapApiError } from "@/lib/errors/mapApiError";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
        gcTime: 24 * 60 * 60 * 1000,
        refetchOnWindowFocus: false, // اختياري: لمنع إعادة الجلب غير المرغوبة عند التنقل بين التبويبات
        retry: (count, err) => {
          const apiError = mapApiError(err);
          return Boolean(apiError && apiError.status >= 500 && count < 2);
        },
      },
      // 👇 الميزة المضافة لضمان هيدريشن متكامل بدون مشاكل مع Next.js
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (isServer) {
    // السيرفر: يتم دائماً إنشاء client جديد لكل طلب لمنع تسريب البيانات بين المستخدمين
    return makeQueryClient();
  } else {
    // المتصفح: Singleton client لضمان عدم إعادة الإنشاء عند حدوث Suspense
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}