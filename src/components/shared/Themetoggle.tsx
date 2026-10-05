'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/store/themeStore';
import { cn } from '@/lib/utils';

export default function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // مكان محجوز بنفس الحجم قبل الـ mount لمنع layout shift
  if (!mounted) return <div className={cn('h-10 w-10', className)} aria-hidden />;

  return (
    <Button variant="ghost" size="icon" className={className} onClick={toggleTheme} aria-label="تبديل الوضع">
      {theme === 'dark' ? <Sun /> : <Moon />}
    </Button>
  );
}