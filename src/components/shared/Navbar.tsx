'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import ThemeToggle from "./Themetoggle";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await api.post('/auth/logout');
    logout();
    router.push('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* الشعار */}
        <Link href="/" className="text-2xl font-bold text-blue-600">
          EduPlatform
        </Link>

        {/* الروابط */}
        <div className="flex items-center gap-6">
          <Link href="/courses" className="text-gray-600 hover:text-blue-600 transition">
            الكورسات
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition">
            تواصل معنا
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="text-gray-600">مرحباً، {user?.name}</span>
              <Link
                href="/dashboard"
                className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition"
              >
                لوحتي
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-500 transition"
              >
                خروج
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-600 hover:text-blue-600 transition"
              >
                دخول
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                تسجيل
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}