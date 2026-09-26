'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

/**
 * لازم يتركب مرة وحدة بجذر التطبيق (شوف layout.tsx). بما إنه ما عاد
 * في persist(localStorage) لبيانات المستخدم، أول ما تنفتح أي صفحة
 * لازم نسأل السيرفر "مين انا؟" عبر /api/auth/me (الجلسة المشفّرة
 * بتجاوب من الكوكي httpOnly، بدون ما JS يشوف التوكن إطلاقًا).
 */
export default function AuthBootstrap() {
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
