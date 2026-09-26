import 'server-only';
import { LARAVEL_API_URL } from '@/lib/session';
interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  token?: string; // سنحتاجه مستقبلاً للطلبات المحمية
}

/**
 * دالة موحدة للاتصال بسيرفر Laravel لتجنب تكرار كود fetch
 */
export async function laravelFetch(endpoint: string, options: FetchOptions = {}) {
  const { method = 'GET', body, token } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  // إذا مررنا token للطلبات المحمية، يضيف ترويسة Bearer تلقائياً
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${LARAVEL_API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store', // لضمان عدم كاش البيانات الحساسة مثل auth
  });

  const data = await res.json();

  // نرجع الاستجابة والبيانات معاً لتسهيل التحقق في الـ Route
  return { res, data };
}
