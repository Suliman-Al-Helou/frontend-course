"use client";

// src/components/landing/Navbar.tsx

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import LogoIcon from "@/components/Logo";
interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "الرئيسية", href: "/" },
  { label: "الكورسات", href: "/courses" },
  { label: "المدربون", href: "/instructors" },
  { label: "تواصل معنا", href: "/contact" },
];

/* ─── Logo ───────────────────────────────────────────────── */
function NavLogo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <LogoIcon size={40} />
      <span className="text-xl font-bold text-white tracking-tight">
        Future <span className="text-primary">House</span>
      </span>
    </Link>
  );
}

/* ─── Dark Mode Toggle ───────────────────────────────────── */
function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  return (
    <button
      onClick={toggleTheme}
      aria-label="تبديل الوضع"
      className="p-2 rounded-xl border border-border hover:bg-muted transition-colors text-foreground/70 hover:text-foreground"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
}

/* ─── Desktop Nav ────────────────────────────────────────── */
function DesktopNav({ pathname }: { pathname: string }) {
  return (
    <div className="hidden lg:flex items-center gap-8">
      {NAV_LINKS.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.label}
            href={link.href}
            className={`text-sm font-medium transition-colors duration-200 relative group ${
              isActive
                ? "text-primary"
                : "text-foreground/70 hover:text-primary"
            }`}
          >
            {link.label}
            <span
              className={`absolute -bottom-1 right-0 h-0.5 bg-primary rounded-full transition-all duration-300 ${
                isActive ? "w-full" : "w-0 group-hover:w-full"
              }`}
            />
          </Link>
        );
      })}
    </div>
  );
}

/* ─── Desktop CTA ────────────────────────────────────────── */
function DesktopCTA() {
  const { isAuthenticated, logout } = useAuthStore();

  if (isAuthenticated) {
    return (
      <div className="hidden lg:flex items-center gap-3">
        <ThemeToggle />
        <Link
          href="/dashboard"
          className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors px-4 py-2"
        >
          لوحة التحكم
        </Link>
        <button
          onClick={logout}
          className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 py-2 text-sm font-medium shadow-md transition-all"
        >
          تسجيل الخروج
        </button>
      </div>
    );
  }

  return (
    <div className="hidden lg:flex items-center gap-3">
      <ThemeToggle />
      <Link
        href="/login"
        className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors px-4 py-2"
      >
        تسجيل الدخول
      </Link>
      <Link
        href="/register"
        className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 py-2 text-sm font-medium shadow-md transition-all"
      >
        ابدأ مجاناً
      </Link>
    </div>
  );
}

/* ─── Mobile Menu ────────────────────────────────────────── */
interface MobileMenuProps {
  isOpen: boolean;
  pathname: string;
  onClose: () => void;
}

function MobileMenu({ isOpen, pathname, onClose }: MobileMenuProps) {
  const { isAuthenticated, logout } = useAuthStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden bg-background border-b border-border"
        >
          <div className="px-4 py-4 flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={onClose}
                className={`py-2 px-3 rounded-lg font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:bg-primary/10 hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="flex flex-col gap-2 pt-3 border-t border-border">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={onClose}
                    className="w-full text-center border-2 border-primary/20 text-primary rounded-xl py-2 text-sm font-medium hover:bg-primary/10 transition-colors"
                  >
                    لوحة التحكم
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    className="w-full bg-primary text-white rounded-xl py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={onClose}
                    className="w-full text-center border-2 border-border rounded-xl py-2 text-sm font-medium text-foreground/80 hover:bg-muted transition-colors"
                  >
                    تسجيل الدخول
                  </Link>
                  <Link
                    href="/register"
                    onClick={onClose}
                    className="w-full text-center bg-primary text-white rounded-xl py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    ابدأ مجاناً
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Main ───────────────────────────────────────────────── */
export default function Navbar() {
  const pathname = usePathname();
  const { theme } = useThemeStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // تطبيق الثيم عند التحميل
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl shadow-lg border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <NavLogo/>
          <DesktopNav pathname={pathname} />
          <DesktopCTA />

          {/* Mobile: theme toggle + menu */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2 rounded-lg text-foreground/80 hover:bg-muted transition-colors"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <MobileMenu
        isOpen={menuOpen}
        pathname={pathname}
        onClose={() => setMenuOpen(false)}
      />
    </motion.nav>
  );
}
