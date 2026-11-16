"use client";

import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  LogOut,
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardList,
  GraduationCap,
  ChevronDown,
  MessageCircleQuestion,
  Video,
  Loader2,
} from "lucide-react";
import { useCurrentUser } from "@/features/auth";
import ThemeToggle from "@/components/shared/Themetoggle";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import {
  AdminStatsCards,
  EnrollmentRequests,
  CoursesPriceOverview,
  ManageCoursesTab,
  adminCourseQueries,
  adminEnrollmentQueries,
} from "@/features/admin-courses";
import { StudentsManagementTab, adminUserQueries } from "@/features/admin-users";
import { MediaPipelineTab } from "@/features/media-pipeline";
import { ManageInstructorsTab, instructorQueries } from "@/features/instructors";
import { ManageFaqTab } from "@/features/faqs";
import type { AdminStats } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";

const TABS = [
  { id: "overview", label: "نظرة عامة", icon: LayoutDashboard },
  { id: "enrollments", label: "طلبات التسجيل", icon: ClipboardList },
  { id: "students", label: "الطلاب", icon: Users },
  { id: "courses", label: "الكورسات", icon: BookOpen },
  { id: "instructors", label: "المدربون", icon: GraduationCap },
  { id: "faqs", label: "الأسئلة الشائعة", icon: MessageCircleQuestion },
  { id: "zoom", label: "لقاءات Zoom", icon: Video },
] as const;

type TabId = (typeof TABS)[number]["id"];

const TAB_LABELS: Record<TabId, string> = {
  overview: "نظرة عامة",
  enrollments: "طلبات التسجيل",
  students: "الطلاب",
  courses: "الكورسات",
  instructors: "المدربون",
  faqs: "الأسئلة الشائعة",
  zoom: "لقاءات Zoom",
};

function AdminContent() {
  const { user, logout } = useCurrentUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawTab = searchParams.get("tab") as TabId | null;
  const isYoutubeCallback =
    searchParams.get("state") === "youtube_callback" ||
    Boolean(searchParams.get("youtube_callback")) ||
    Boolean(searchParams.get("state")?.startsWith("yt_"));
  const tab: TabId =
    rawTab && rawTab in TAB_LABELS ? rawTab : isYoutubeCallback ? "zoom" : "overview";

  const setTab = (newTab: TabId) => {
    router.push(`/admin?tab=${newTab}`, { scroll: false });
    setMobileMenuOpen(false);
  };

  const { data: enrollments = [] } = useQuery(adminEnrollmentQueries.list());
  const { data: courses = [] } = useQuery(adminCourseQueries.list());
  const { data: users = [], isLoading: usersLoading } = useQuery(adminUserQueries.list());
  const { data: instructors = [], isLoading: instructorsLoading } = useQuery(
    instructorQueries.adminList(),
  );

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingEnrollmentsCount = enrollments.filter((e) => e.status === "pending").length;

  const stats: AdminStats = {
    totalStudents: users.filter((u) => u.role !== "admin").length,
    totalCourses: courses.length,
    totalInstructors: instructors.length,
    pendingEnrollments: pendingEnrollmentsCount,
  };

  const loading = usersLoading || instructorsLoading;

  const handleLogout = () => {
    logout();
  };

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

  const currentTab = TABS.find((t) => t.id === tab);

  return (
    <div className="min-h-screen bg-background font-arabic" dir="rtl">
      <div className="flex">
        {/* Sidebar — Desktop */}
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
            {TABS.map((t) => (
              <Button
                key={t.id}
                variant={tab === t.id ? "default" : "ghost"}
                onClick={() => setTab(t.id)}
                className="w-full justify-start gap-3 h-11 px-4 text-sm font-medium"
              >
                <t.icon className="w-4 h-4 shrink-0" />
                <span>{t.label}</span>
                {t.id === "enrollments" && pendingEnrollmentsCount > 0 && (
                  <span
                    className={`mr-auto text-xs px-2 py-0.5 rounded-full font-bold ${
                      tab === "enrollments"
                        ? "bg-white/20 text-white"
                        : "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                    }`}
                  >
                    {pendingEnrollmentsCount}
                  </span>
                )}
              </Button>
            ))}
          </nav>

          <div className="p-4 border-t border-border space-y-2">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs text-muted-foreground">الوضع الليلي</span>
              <ThemeToggle />
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive gap-3"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج</span>
            </Button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 lg:mr-64 min-h-screen">
          {/* Header */}
          <header className="sticky top-0 z-20 bg-card/80 backdrop-blur-xl border-b border-border px-4 sm:px-6 h-16 flex items-center justify-between">
            <div>
              <h1 className="font-bold text-foreground text-sm sm:text-base">{TAB_LABELS[tab]}</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">مرحباً {user?.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="lg:hidden">
                <ThemeToggle />
              </div>
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
                {currentTab && <currentTab.icon className="w-4 h-4 text-primary" />}
                {TAB_LABELS[tab]}
                {tab === "enrollments" && pendingEnrollmentsCount > 0 && (
                  <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 text-xs px-2 py-0.5 rounded-full font-bold">
                    {pendingEnrollmentsCount}
                  </span>
                )}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform ${mobileMenuOpen ? "rotate-180" : ""}`}
              />
            </Button>

            {mobileMenuOpen && (
              <div className="absolute top-full right-4 left-4 mt-1 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
                {TABS.map((t) => (
                  <Button
                    key={t.id}
                    variant={tab === t.id ? "secondary" : "ghost"}
                    onClick={() => {
                      setTab(t.id);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full justify-start gap-3 h-12 px-4 text-sm font-medium rounded-none border-b border-border/50 last:border-0"
                  >
                    <t.icon className="w-4 h-4 shrink-0" />
                    <span>{t.label}</span>
                    {t.id === "enrollments" && pendingEnrollmentsCount > 0 && (
                      <span className="mr-auto bg-orange-100 dark:bg-orange-900/30 text-orange-600 text-xs px-2 py-0.5 rounded-full font-bold">
                        {pendingEnrollmentsCount}
                      </span>
                    )}
                    {tab === t.id && <span className="mr-auto text-primary text-xs">✓</span>}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive gap-3 border-t border-border rounded-none mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج</span>
                </Button>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            ) : (
              <>
                {tab === "overview" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <AdminStatsCards stats={stats} />
                    <div className="grid lg:grid-cols-2 gap-6">
                      <EnrollmentRequests />
                      <CoursesPriceOverview />
                    </div>
                  </motion.div>
                )}
                {tab === "enrollments" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <EnrollmentRequests />
                  </motion.div>
                )}
                {tab === "students" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <StudentsManagementTab />
                  </motion.div>
                )}
                {tab === "courses" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <ManageCoursesTab />
                  </motion.div>
                )}
                {tab === "instructors" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <ManageInstructorsTab />
                  </motion.div>
                )}
                {tab === "faqs" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <ManageFaqTab />
                  </motion.div>
                )}
                {tab === "zoom" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <MediaPipelineTab />
                  </motion.div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      }
    >
      <AdminContent />
    </Suspense>
  );
}
