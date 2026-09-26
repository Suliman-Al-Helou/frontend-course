"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Play,
  Video,
  ClipboardList,
  User,
  X,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

import { useThemeStore } from "@/store/themeStore";
const MENU = [
  { label: "الرئيسية", href: "/dashboard", icon: LayoutDashboard },
  { label: "كورساتي", href: "/dashboard/courses", icon: BookOpen },
  { label: "تابع التعلم", href: "/dashboard/continue", icon: Play },
  { label: "الفيديوهات", href: "/dashboard/videos", icon: Video },
  { label: "المهام", href: "/dashboard/tasks", icon: ClipboardList },
  { label: "ملفي الشخصي", href: "/dashboard/profile", icon: User },
];

interface Props {
  open: boolean;
  onClose: () => void;
}
function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl text-foreground/70 hover:bg-accent/10 hover:text-primary transition-colors"
      aria-label="تبديل الوضع الليلي"
    >
      {theme === "dark" ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
export default function DashboardSidebar({ open, onClose }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout , isLoading} = useAuthStore();
  
if (isLoading) {
  return <div className="text-gray-400 text-sm animate-pulse">جارٍ التحقق...</div>;
}

  const handleLogout = () => {
    logout();
   
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
        fixed top-0 right-0 z-50 w-64 h-screen bg-card border-l border-border shadow-xl
        flex flex-col transform transition-transform duration-300
        lg:translate-x-0 lg:static lg:shadow-none lg:z-auto
        ${open ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
<div className="font-bold text-primary text-lg">
  لوحة<span className="text-primary dark:text-white mr-1">الطالب</span>
</div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {MENU.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                  ${
                    active
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs text-muted-foreground">الوضع الليلي</span>
            <ThemeToggle />
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </button>
        </div>
      </aside>
    </>
  );
}
