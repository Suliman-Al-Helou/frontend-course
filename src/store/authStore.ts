import { create } from "zustand";
import type { User } from "@/types";


interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean; // أضفنا حالة التحميل لمنع وميض الواجهات
  setAuth: (user: User) => void;
  fetchUser: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // يبدأ بـ true حتى ينتهي طلب الـ Bootstrap

  // دالة لتحديث البيانات داخل الـ Store (تُستدعى عند نجاح الـ Login/Register)
  setAuth: (user) => {
    set({ user, isAuthenticated: Boolean(user), isLoading: false });
  },

  // الدالة المحرك المخصصة لمكون الـ AuthBootstrap عند فتح الموقع
  fetchUser: async () => {
    try {
      // نطلب من الـ Route Handler الداخلي معرفة المستخدم الحالي
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      
      if (res.ok) {
        const data = await res.json();
        // data.user يحتوي على البيانات القادمة من السيرفر (بدون التوكن)
        set({ user: data.user, isAuthenticated:  Boolean(data.user), isLoading: false });
      } else {
        // إذا لم يجد السيرفر جلسة صالحة
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  // تفريغ البيانات محلياً من الذاكرة
    logout: async () => {
    try {
      // تدمير الجلسة على السيرفر ومسح الكوكي المشفرة
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error("فشل تسجيل الخروج من الخلفية البرمجية:", error);
    } finally {
      // تفريغ المخزن محلياً وتوجيه المستخدم للرئيسية في كل الأحوال
      set({ user: null, isAuthenticated: false, isLoading: false });
      window.location.href = '/';
    }
  },
}));
