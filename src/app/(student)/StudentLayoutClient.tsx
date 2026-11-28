"use client";

import { useState } from "react";
import { NotificationBell } from "@/features/notifications";
import {
  ChevronDown,
  LayoutDashboard,
  BookOpen,
  Play,
  Video,
  ClipboardList,
  User as UserIcon,
  LifeBuoy,
  LogOut,
  GraduationCap,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import DashboardSidebar from "./_components/DashboardSidebar";
import ThemeToggle from "@/components/shared/Themetoggle";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/features/auth";
import type { User } from "@/types";

const MENU = [
  { label: "الرئيسية", href: "/dashboard", icon: LayoutDashboard },
  { label: "كورساتي", href: "/dashboard/courses", icon: BookOpen },
  { label: "تابع التعلم", href: "/dashboard/continue", icon: Play },
  { label: "الفيديوهات", href: "/dashboard/videos", icon: Video },
  { label: "المهام", href: "/dashboard/tasks", icon: ClipboardList },
  { label: "ملفي الشخصي", href: "/dashboard/profile", icon: UserIcon },
  { label: "تواصل معنا", href: "/dashboard/contact", icon: LifeBuoy },
] as const;

interface StudentLayoutClientProps {
  user: User;
  children: React.ReactNode;
}

export default function StudentLayoutClient({ user, children }: StudentLayoutClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useCurrentUser();

  const currentItem =
    MENU.find((item) =>
      item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href),
    ) || (pathname.startsWith("/dashboard") ? MENU[0] : null);

  const handleNavigate = (href: string) => {
    router.push(href);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setMobileMenuOpen(false);
    logout();
  };

  return (
    <div className="min-h-screen bg-background font-arabic" dir="rtl">
      <div className="flex">
        {/* Sidebar — fixed (Desktop) */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="fixed right-0 top-0 h-screen w-64 z-30">
            <DashboardSidebar open={true} onClose={() => {}} />
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-h-screen">
          {/* Header */}
          <header className="sticky top-0 z-20 bg-card/80 backdrop-blur-xl border-b border-border px-4 sm:px-6 h-16 flex items-center justify-between">
            <div>
              <h1 className="font-bold text-foreground text-sm sm:text-base">
                {currentItem ? currentItem.label : "لوحة التحكم"}
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">مرحباً {user.name}</p>
            </div>
            <div className="flex items-center gap-3">
              {user.role === "instructor" && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="min-h-[36px] gap-1.5 text-xs font-bold text-primary border-primary/30 hover:bg-primary hover:text-primary-foreground"
                >
                  <Link href="/instructor">
                    <GraduationCap className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>بوابة المدربين</span>
                  </Link>
                </Button>
              )}
              <div className="lg:hidden">
                <ThemeToggle />
              </div>
              <NotificationBell />
              <Link href="/dashboard/profile" aria-label="الملف الشخصي">
                <div className="w-8 h-8 rounded-full bg-white overflow-hidden border border-border">
                  <Image
                    src="/logo.jpg"
                    alt="logo"
                    width={32}
                    height={32}
                    className="w-full h-full object-contain"
                  />
                </div>
              </Link>
            </div>
          </header>

          {/* Mobile Nav — Dropdown */}
          <div className="lg:hidden px-4 py-3 border-b border-border bg-card relative">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setMobileMenuOpen((o) => !o)}
              className="w-full justify-between"
            >
              <span className="flex items-center gap-2">
                {currentItem && <currentItem.icon className="w-4 h-4 text-primary" />}
                {currentItem ? currentItem.label : "لوحة التحكم"}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform ${mobileMenuOpen ? "rotate-180" : ""}`}
              />
            </Button>

            {mobileMenuOpen && (
              <>
                <div
                  aria-hidden="true"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setMobileMenuOpen(false)}
                />
                <div className="absolute top-full right-4 left-4 mt-1 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
                  {user.role === "instructor" && (
                    <Button
                      variant="secondary"
                      asChild
                      className="w-full justify-between h-12 px-4 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 border-b border-border/50 rounded-none"
                    >
                      <Link href="/instructor" onClick={() => setMobileMenuOpen(false)}>
                        <span className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-primary" />
                          <span>العودة لبوابة المدربين</span>
                        </span>
                        <ArrowLeft className="w-3.5 h-3.5 text-primary" />
                      </Link>
                    </Button>
                  )}
                  {MENU.map((item) => {
                    const Icon = item.icon;
                    const active =
                      item.href === "/dashboard"
                        ? pathname === "/dashboard"
                        : pathname.startsWith(item.href);

                    return (
                      <Button
                        key={item.href}
                        variant={active ? "secondary" : "ghost"}
                        onClick={() => handleNavigate(item.href)}
                        className="w-full justify-start gap-3 h-12 px-4 text-sm font-medium rounded-none border-b border-border/50 last:border-0"
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                        {active && <span className="mr-auto text-primary text-xs">✓</span>}
                      </Button>
                    );
                  })}
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive gap-3 border-t border-border rounded-none mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>تسجيل الخروج</span>
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
