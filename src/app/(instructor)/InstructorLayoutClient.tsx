"use client";

import React, { useState, useEffect } from "react";
import { LayoutDashboard, BookOpen, LifeBuoy, LogOut, Menu, X, GraduationCap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import ThemeToggle from "@/components/shared/Themetoggle";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/features/auth";
import type { User } from "@/types";

const INSTRUCTOR_MENU = [
  { label: "الرئيسية", href: "/instructor", icon: LayoutDashboard },
  { label: "كورساتي الموكلة", href: "/instructor/courses", icon: BookOpen },
  { label: "الدعم والمساعدة", href: "/instructor/support", icon: LifeBuoy },
] as const;

interface InstructorLayoutClientProps {
  user: User;
  children: React.ReactNode;
}

export default function InstructorLayoutClient({ user, children }: InstructorLayoutClientProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useCurrentUser();

  // تفعيل قفل التمرير على الصفحة عند فتح القائمة الجانبية في الهاتف
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileDrawerOpen]);

  const currentItem =
    INSTRUCTOR_MENU.find((item) =>
      item.href === "/instructor" ? pathname === "/instructor" : pathname.startsWith(item.href),
    ) || INSTRUCTOR_MENU[0];

  const handleNavigate = (href: string) => {
    router.push(href);
    setMobileDrawerOpen(false);
  };

  const handleLogout = () => {
    setMobileDrawerOpen(false);
    logout();
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-arabic" dir="rtl">
      <div className="flex">
        {/* Desktop Sidebar — Fixed Right */}
        <aside className="hidden lg:block w-64 flex-shrink-0 border-l border-border bg-card">
          <div className="fixed right-0 top-0 h-screen w-64 z-30 flex flex-col justify-between p-4 bg-card border-l border-border">
            <div className="space-y-6">
              {/* Brand Header */}
              <div className="flex items-center gap-3 px-2 py-3 border-b border-border">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 border border-primary/20">
                  <GraduationCap className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground leading-tight">
                    بوابة المدربين
                  </h2>
                  <p className="text-xs text-muted-foreground">Future House Academy</p>
                </div>
              </div>

              {/* Navigation Links */}
              <nav aria-label="شريط تنقل المدرب" className="space-y-1">
                {INSTRUCTOR_MENU.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/instructor"
                      ? pathname === "/instructor"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors min-h-[44px] ${
                        isActive
                          ? "bg-primary/10 text-primary font-semibold border-r-2 border-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Section */}
            <div className="pt-4 border-t border-border space-y-3">
              <div className="flex items-center gap-3 px-2">
                <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                  {user.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
                  <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">
                    مدرب معتمد
                  </span>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 min-h-[44px] gap-2"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                <span>تسجيل الخروج</span>
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-h-screen flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-20 bg-card/80 backdrop-blur-xl border-b border-border px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileDrawerOpen(true)}
                className="lg:hidden min-h-[44px] min-w-[44px]"
                aria-label="فتح القائمة الجانبية"
              >
                <Menu className="w-5 h-5" aria-hidden="true" />
              </Button>
              <div>
                <h1 className="text-sm sm:text-base font-bold text-foreground">
                  {currentItem.label}
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  مرحباً بك د. {user.name} في بيئة العمل الأكاديمية
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="w-8 h-8 rounded-full bg-white overflow-hidden border border-border">
                <Image
                  src="/logo.jpg"
                  alt="logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </header>

          {/* Page Body */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</div>
        </main>
      </div>

      {/* Mobile Drawer (RTL Slide-in from right) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Content */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label="قائمة التنقل للمدرب"
            className="fixed inset-y-0 right-0 w-72 max-w-[85vw] bg-card border-l border-border p-5 flex flex-col justify-between shadow-2xl z-50 animate-in slide-in-from-right duration-200"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <GraduationCap className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">بوابة المدربين</h3>
                    <p className="text-xs text-muted-foreground">{user.name}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="min-h-[44px] min-w-[44px]"
                  aria-label="إغلاق القائمة"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </Button>
              </div>

              <nav className="space-y-1.5" aria-label="تنقل الجوال">
                {INSTRUCTOR_MENU.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/instructor"
                      ? pathname === "/instructor"
                      : pathname.startsWith(item.href);

                  return (
                    <button
                      key={item.href}
                      onClick={() => handleNavigate(item.href)}
                      className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-colors text-right min-h-[44px] ${
                        isActive
                          ? "bg-primary/10 text-primary font-semibold border-r-2 border-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-border">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start text-destructive hover:bg-destructive/10 min-h-[44px] gap-2"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                <span>تسجيل الخروج</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
