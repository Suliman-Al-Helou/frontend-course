'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/shared/Themetoggle';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'الكورسات', href: '/courses' },
  { label: 'المدربون', href: '/instructors' },
];

function AuthActions({ stacked = false, onNavigate }: { stacked?: boolean; onNavigate?: () => void }) {
  const { isAuthenticated, isLoading, logout } = useAuthStore();
  const width = stacked ? 'w-full' : undefined;

  // مكان محجوز حتى لا تقفز الواجهة عند انتهاء التحقق من الجلسة
  if (isLoading) return <div className={cn('h-10', stacked ? 'w-full' : 'w-44')} aria-hidden />;

  if (isAuthenticated) {
    return (
      <>
        <Button href="/dashboard" onClick={onNavigate} className={width}>
          لوحة التحكم
        </Button>
        <Button
          variant="ghost"
          className={width}
          onClick={() => {
            onNavigate?.();
            logout();
          }}
        >
          تسجيل الخروج
        </Button>
      </>
    );
  }

  return (
    <>
      <Button href="/login" variant="outline" onClick={onNavigate} className={width}>
        تسجيل الدخول
      </Button>
      <Button href="/register"   onClick={onNavigate} className={width}>
        إنشاء حساب
      </Button>
    </>
  );
}

export default function NavbarClient() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      <nav aria-label="التنقل الرئيسي" className="hidden items-center gap-6 lg:flex">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive(link.href) ? 'page' : undefined}
            className={cn(
              'text-sm font-medium transition-colors',
              isActive(link.href) ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {link.label}
          </Link>
        ))}
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
          aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>

      {open && (
        <div id="mobile-menu" className="absolute inset-x-0 top-full border-b border-border bg-background lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={cn(
                  'rounded-md px-3 py-3 text-base font-medium transition-colors',
                  isActive(link.href)
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4">
              <AuthActions stacked onNavigate={close} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}