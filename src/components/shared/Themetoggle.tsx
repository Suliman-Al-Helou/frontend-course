"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // قبل الـ mount نعرض placeholder بنفس الحجم عشان ما يصير layout shift
  if (!mounted) {
    return (
      <div
        className={`p-2 rounded-xl border border-border w-8 h-8 ${className ?? ""}`}
      />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="تبديل الوضع"
      className={`p-2 rounded-xl border border-border hover:bg-muted transition-colors text-foreground/70 hover:text-foreground ${className ?? ""}`}
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
}