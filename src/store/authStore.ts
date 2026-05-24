import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

interface User {
  id: number;
  name: string;
  email: string;
  role?: "admin" | "student";
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        set({ user, token, isAuthenticated: true });

        // ← هذا هو الإضافة: احفظ في cookie عشان middleware يقدر يقرأ
   Cookies.set("auth-token", token, { expires: 30, sameSite: "Strict", secure: true });
Cookies.set("user-role", user.role ?? "student", { expires: 30, sameSite: "Strict", secure: true });
      },

logout: () => {
  set({ user: null, token: null, isAuthenticated: false });
  Cookies.remove('auth-token');
  Cookies.remove('user-role');
  localStorage.removeItem('auth-storage');
  window.location.href = '/'; // ← أضف هذا
},
    }),
    { name: "auth-storage" },
  ),
);
