"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Play,
  Video,
  ClipboardList,
  User,
  X,
  LogOut,
  LifeBuoy,
  GraduationCap,
  ArrowLeft,
} from "lucide-react";
import { useCurrentUser } from "@/features/auth";
import ThemeToggle from "@/components/shared/Themetoggle";
import { Button } from "@/components/ui/button";

const MENU = [
  { label: "الرئيسية", href: "/dashboard", icon: LayoutDashboard },
  { label: "كورساتي", href: "/dashboard/courses", icon: BookOpen },
  { label: "تابع التعلم", href: "/dashboard/continue", icon: Play },
  { label: "الفيديوهات", href: "/dashboard/videos", icon: Video },
  { label: "المهام", href: "/dashboard/tasks", icon: ClipboardList },
  { label: "ملفي الشخصي", href: "/dashboard/profile", icon: User },
  { label: "تواصل معنا", href: "/dashboard/contact", icon: LifeBuoy },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function DashboardSidebar({ open, onClose }: Props) {
  const pathname = usePathname();
  const { logout, isLoading, user } = useCurrentUser();

  if (isLoading) {
    return <div className="text-gray-400 text-sm animate-pulse">جارٍ التحقق...</div>;
  }

  return (
    <>
      {open && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden cursor-default"
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
            لوحة
            <span className="text-primary dark:text-white mr-1">الطالب</span>
          </div>
          <Button
            variant="ghost"
            size="iconSm"
            onClick={onClose}
            className="lg:hidden"
            aria-label="إغلاق القائمة الجانبية"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {user?.role === "instructor" && (
          <div className="p-3 mx-3 mt-3 rounded-xl border border-primary/30 bg-primary/10 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-primary font-semibold px-1">
              <span>وضع التدريس</span>
              <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                مدرب
              </span>
            </div>
            <Link
              href="/instructor"
              onClick={onClose}
              className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-bold text-primary-foreground bg-primary hover:bg-primary-hover transition-colors min-h-[44px]"
            >
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" aria-hidden="true" />
                <span>العودة لبوابة المدربين</span>
              </div>
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        )}

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
          <Button
            variant="ghost"
            onClick={() => logout()}
            className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive gap-3"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </Button>
        </div>
      </aside>
    </>
  );
}
