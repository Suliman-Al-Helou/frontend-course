"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/shared/Themetoggle";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/features/auth";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "الرئيسية", href: "/" },
  { label: "الكورسات", href: "/courses" },
  { label: "المدربون", href: "/instructors" },
  { label: "تواصل معنا", href: "/contact" },
];

function AuthActions({
  stacked = false,
  onNavigate,
}: {
  stacked?: boolean;
  onNavigate?: () => void;
}) {
  const { isAuthenticated, isLoading, logout, user } = useCurrentUser();
  const width = stacked ? "w-full" : undefined;
  const dashboardHref = user?.role === "admin" ? "/admin" : "/dashboard";

  // مكان محجوز حتى لا تقفز الواجهة عند انتهاء التحقق من الجلسة
  if (isLoading) {
    return (
      <div
        className={cn(
          "h-9 animate-pulse rounded-lg bg-muted/60 motion-reduce:animate-none",
          stacked ? "w-full h-11" : "w-44",
        )}
        aria-hidden="true"
      />
    );
  }

  if (isAuthenticated) {
    return (
      <div className={cn("flex items-center gap-2", stacked ? "flex-col w-full" : "")}>
        <Button
          href={dashboardHref}
          onClick={onNavigate}
          className={width}
          size={stacked ? "default" : "sm"}
        >
          لوحة التحكم
        </Button>
        <Button
          variant="ghost"
          className={width}
          onClick={() => {
            onNavigate?.();
            logout();
          }}
          size={stacked ? "default" : "sm"}
        >
          تسجيل الخروج
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", stacked ? "flex-col w-full" : "")}>
      <Button
        href="/login"
        variant="outline"
        onClick={onNavigate}
        className={width}
        size={stacked ? "default" : "sm"}
      >
        تسجيل الدخول
      </Button>
      <Button
        href="/register"
        onClick={onNavigate}
        className={width}
        size={stacked ? "default" : "sm"}
      >
        إنشاء حساب
      </Button>
    </div>
  );
}

export default function NavbarClient() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <nav aria-label="التنقل الرئيسي" className="hidden items-center gap-1 lg:flex">
        {NAV_LINKS.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="ms-auto flex items-center gap-2">
        <ThemeToggle />
        <div className="hidden items-center gap-2 lg:flex">
          <AuthActions />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      {open && (
        <>
          {/* Backdrop for outside click dismiss */}
          <div
            className="fixed inset-0 top-16 z-40 bg-background/60 backdrop-blur-xs lg:hidden animate-in fade-in-0 duration-200 motion-reduce:animate-none"
            onClick={close}
            aria-hidden="true"
          />
          <div
            id="mobile-menu"
            className="absolute inset-x-0 top-full z-50 border-b border-border bg-card lg:hidden shadow-2xl animate-in fade-in-0 slide-in-from-top-2 duration-200 motion-reduce:animate-none"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex min-h-[44px] items-center rounded-xl px-4 py-3 text-base font-semibold transition-colors",
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="mt-3 flex flex-col gap-2.5 border-t border-border/80 pt-4">
                <AuthActions stacked onNavigate={close} />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
