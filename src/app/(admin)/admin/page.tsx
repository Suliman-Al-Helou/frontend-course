"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import {
  Shield, Plus, LogOut, LayoutDashboard,
  Users, BookOpen, ClipboardList, GraduationCap,
  Moon, Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import Cookies from "js-cookie";
import api from "@/lib/api";
import AdminStatsCards        from "@/components/admin/AdminStatsCards";
import EnrollmentRequests     from "@/components/admin/EnrollmentRequests";
import StudentsTable          from "@/components/admin/StudentsTable";
import CoursesOverview        from "@/components/admin/CoursesOverview";
import AddEnrollmentModal     from "@/components/admin/AddEnrollmentModal";
import ManageCoursesTab       from "@/components/admin/ManageCoursesTab";
import ManageInstructorsTab   from "@/components/admin/ManageInstructorsTab";
import type { Enrollment, AdminUser, AdminStats } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";

// ─── Constants ───────────────────────────────────────────
const TABS = [
  { id: "overview",     label: "نظرة عامة",       icon: LayoutDashboard },
  { id: "enrollments",  label: "طلبات التسجيل",   icon: ClipboardList   },
  { id: "students",     label: "الطلاب",           icon: Users           },
  { id: "courses",      label: "الكورسات",         icon: BookOpen        },
  { id: "instructors",  label: "المدربون",         icon: GraduationCap   },
] as const;

type TabId = (typeof TABS)[number]["id"];

const TAB_LABELS: Record<TabId, string> = {
  overview:    "نظرة عامة",
  enrollments: "طلبات التسجيل",
  students:    "الطلاب",
  courses:     "الكورسات",
  instructors: "المدربون",
};

// ─── ThemeToggle ─────────────────────────────────────────
function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl text-foreground/70 hover:bg-accent/10 hover:text-primary transition-colors"
      aria-label="تبديل الوضع الليلي"
    >
      {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}

// ─── AdminContent — يستخدم useSearchParams ───────────────
// هذا الـ component هو اللي يحتاج Suspense
function AdminContent() {
  const { user, logout } = useAuthStore();
  const searchParams = useSearchParams();          // ← هنا useSearchParams
  const router       = useRouter();
  const tab          = (searchParams.get("tab") as TabId) ?? "overview";

  const setTab = (newTab: TabId) => {
    router.push(`/admin?tab=${newTab}`, { scroll: false });
  };

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [users,       setUsers]       = useState<AdminUser[]>([]);
  const [showModal,   setShowModal]   = useState(false);
  const [loading,     setLoading]     = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [enrRes, usrRes] = await Promise.all([
        api.get("/admin/enrollments"),
        api.get("/admin/users"),
      ]);
      setEnrollments(enrRes.data.data ?? enrRes.data);
      setUsers(usrRes.data.data ?? usrRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleLogout = () => {
    logout();
    Cookies.remove("auth-token");
    router.push("/");
  };

  // Guard
  if (user && user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
        <div className="text-center">
          <Shield className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground">غير مصرح لك بالدخول</h2>
          <p className="text-muted-foreground mt-2">هذه الصفحة للأدمن فقط</p>
        </div>
      </div>
    );
  }

  const stats: AdminStats = {
    totalStudents:       users.filter(u => u.role !== "admin").length,
    totalCourses:        0,
    totalInstructors:    0,
    pendingEnrollments:  enrollments.filter(e => e.status === "pending").length,
  };

  return (
    <div className="min-h-screen bg-background font-arabic" dir="rtl">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-card border-l border-border fixed right-0 top-0 z-30">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-foreground text-sm">لوحة الأدمن</p>
                <p className="text-xs text-muted-foreground">future house</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  tab === t.id
                    ? "bg-primary text-white shadow-md"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
                {t.id === "enrollments" && stats.pendingEnrollments > 0 && (
                  <span className={`mr-auto text-xs px-2 py-0.5 rounded-full font-bold ${
                    tab === "enrollments"
                      ? "bg-white/20 text-white"
                      : "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                  }`}>
                    {stats.pendingEnrollments}
                  </span>
                )}
              </button>
            ))}
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

        {/* Main */}
        <main className="flex-1 lg:mr-64 min-h-screen">
          <header className="sticky top-0 z-20 bg-card/80 backdrop-blur-xl border-b border-border px-4 sm:px-6 h-16 flex items-center justify-between">
            <div>
              <h1 className="font-bold text-foreground text-sm sm:text-base">{TAB_LABELS[tab]}</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">مرحباً {user?.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="lg:hidden"><ThemeToggle /></div>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 text-white rounded-xl h-9"
                onClick={() => setShowModal(true)}
              >
                <Plus className="w-4 h-4 ml-1" />
                <span className="hidden sm:inline">تسجيل طالب</span>
              </Button>
            </div>
          </header>

          {/* Mobile Tabs */}
          <div className="lg:hidden flex overflow-x-auto gap-2 p-4 border-b border-border bg-card">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  tab === t.id ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                }`}
              >
                <t.icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {tab === "overview" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <AdminStatsCards stats={stats} />
                    <div className="grid lg:grid-cols-2 gap-6">
                      <EnrollmentRequests enrollments={enrollments.filter(e => e.status === "pending")} onRefresh={fetchData} />
                      <CoursesOverview enrollments={enrollments} />
                    </div>
                  </motion.div>
                )}
                {tab === "enrollments" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <EnrollmentRequests enrollments={enrollments} onRefresh={fetchData} />
                  </motion.div>
                )}
                {tab === "students" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <StudentsTable users={users} enrollments={enrollments} onRefresh={fetchData} />
                  </motion.div>
                )}
                {tab === "courses" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <ManageCoursesTab enrollments={enrollments} />
                  </motion.div>
                )}
                {tab === "instructors" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <ManageInstructorsTab />
                  </motion.div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {showModal && (
        <AddEnrollmentModal
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); fetchData(); }}
        />
      )}
    </div>
  );
}

// ─── Default Export — غلّف بـ Suspense هنا ────────────────
export default function AdminPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <AdminContent />
    </Suspense>
  );
}