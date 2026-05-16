'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useAuthStore(state => state.user);

  return (
    <div className="min-h-screen bg-background font-arabic" dir="rtl">
      <div className="flex">

        {/* Sidebar — fixed */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="fixed right-0 top-0 h-screen w-64 z-30">
            <DashboardSidebar open={true} onClose={() => {}} />
          </div>
        </aside>

        {/* Sidebar — موبايل */}
        <div className="lg:hidden">
          <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main */}
        <main className="flex-1  min-h-screen">

          {/* Header */}
          <header className="sticky top-0 z-20 bg-card/80 backdrop-blur-xl border-b border-border px-4 sm:px-6 h-16 flex items-center justify-between">
            <div>
              <h1 className="font-bold text-foreground text-sm sm:text-base">
                لوحة التحكم
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                مرحباً {user?.name}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl hover:bg-muted"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                {user?.name?.charAt(0) ?? 'T'}
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>

        </main>
      </div>
    </div>
  );
}