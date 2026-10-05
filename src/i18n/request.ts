import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  // لغة واحدة الآن. لاحقاً هنا سنقرأ لغة المستخدم (cookie مثلاً)
  const locale = "ar";

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});