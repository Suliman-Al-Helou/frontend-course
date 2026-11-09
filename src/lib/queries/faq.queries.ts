import { queryOptions } from "@tanstack/react-query";
import { getFaqs } from "@/lib/api/faq";

export const faqQueries = {
  all: () => ["faqs"] as const,
  list: () =>
    queryOptions({
      queryKey: [...faqQueries.all(), "list"] as const,
      queryFn: getFaqs,
      staleTime: 1000 * 60 * 60 * 24, // 24 ساعة كاش طازج في المتصفح لأن الأسئلة نادراً ما تتغير
      gcTime: 1000 * 60 * 60 * 24 * 7, // أسبوع كامل في الذاكرة
    }),
};
