import axios, { AxiosError } from "axios";
import { notify } from "@/lib/toast";
import { ERROR_CODES } from "@/lib/errors/codes";

const isServer = typeof window === "undefined";

/**
 * Custom Axios Gateway الموحد لجميع طلبات الـ HTTP
 * يتعامل بمرونة مع بيئتي الخادم (SSR) والمتصفح (Client)
 */
export const api = axios.create({
  baseURL: isServer
    ? process.env.LARAVEL_API_URL || "http://127.0.0.1:8000/api"
    : "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
  timeout: 30000,

});

// Response Interceptor: التقاط ومعالجة استجابات العقد الموحد (401, 403, 429)
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; code?: string }>) => {
    if (!error.response) {
      if (!isServer) {
        notify.error(ERROR_CODES.SYS_SERVER_DOWN);
      }
      return Promise.reject(error);
    }

    const { status, data, headers } = error.response;

    switch (status) {
      case 401: {
        // Unauthenticated: تنبيه بانتهاء الجلسة وإعادة التوجيه لصفحة تسجيل الدخول
        if (!isServer) {
          notify.error(ERROR_CODES.AUTH_SESSION_EXPIRED);

          if (!window.location.pathname.startsWith("/login")) {
            const currentPath = window.location.pathname;
            window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
          }
        }
        break;
      }

      case 403: {
        // Authorization Denied: إظهار التنبيه الموحد للمنع الصريح
        if (!isServer) {
          const forbiddenMessage = data?.message || ERROR_CODES.SYS_FORBIDDEN;
          notify.error(forbiddenMessage);
        }
        break;
      }

      case 429: {
        // Rate Limit Exceeded: التقاط الخطأ وتفعيل مؤقت حظر الطلبات (Cooldown)
        const retryAfter = Number(headers["retry-after"]) || 60;
        if (!isServer) {
          notify.error(
            `تم تجاوز الحد المسموح به من الطلبات. يرجى الانتظار ${retryAfter} ثانية قبل إعادة المحاولة.`
          );

          window.dispatchEvent(
            new CustomEvent("api:rate-limit-cooldown", {
              detail: { retryAfter },
            })
          );
        }
        break;
      }

      default:
        break;
    }

    return Promise.reject(error);
  }
);

export default api;
