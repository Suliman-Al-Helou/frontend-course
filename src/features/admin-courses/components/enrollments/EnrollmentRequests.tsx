"use client";

import { useState, useMemo, useRef } from "react";
import { Search, Clock, CheckCircle, XCircle, Check, X, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminEnrollmentQueries } from "../../queries/adminCourses.queries";
import { useEnrollmentMutations } from "../../queries/adminCourses.mutations";
import type { AdminEnrollment, EnrollmentStatus } from "../../types";

const statusConfig: Record<
  EnrollmentStatus,
  { label: string; color: string; icon: typeof Clock }
> = {
  pending: {
    label: "معلّق",
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
    icon: Clock,
  },
  approved: {
    label: "مقبول",
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
    icon: CheckCircle,
  },
  rejected: {
    label: "مرفوض",
    color: "bg-destructive/10 text-destructive border border-destructive/20",
    icon: XCircle,
  },
};

const FILTER_LABELS = {
  all: "الكل",
  pending: "معلّق",
  approved: "مقبول",
  rejected: "مرفوض",
} as const;

export default function EnrollmentRequests() {
  const { data: enrollments = [], isLoading } = useQuery(adminEnrollmentQueries.list());
  const { updateStatus } = useEnrollmentMutations();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | EnrollmentStatus>("all");
  const updatingIdRef = useRef<number | null>(null);
  const [activeUpdatingId, setActiveUpdatingId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return enrollments.filter((e) => {
      const name = (e.student_name ?? e.user?.name ?? "").toLowerCase();
      const email = (e.student_email ?? e.user?.email ?? "").toLowerCase();
      const title = (e.course_title ?? e.course?.title ?? "").toLowerCase();

      const matchSearch = !q || name.includes(q) || email.includes(q) || title.includes(q);
      const matchFilter = filter === "all" || e.status === filter;
      return matchSearch && matchFilter;
    });
  }, [enrollments, search, filter]);

  const handleUpdateStatus = async (
    id: number,
    status: EnrollmentStatus,
    paymentConfirmed: boolean
  ) => {
    if (updatingIdRef.current !== null) return;
    updatingIdRef.current = id;
    setActiveUpdatingId(id);

    try {
      await updateStatus.mutateAsync({
        id,
        status,
        paymentConfirmed,
      });
    } catch (err) {
      console.error("فشل تحديث حالة التسجيل:", err);
    } finally {
      updatingIdRef.current = null;
      setActiveUpdatingId(null);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      {/* Header & Controls */}
      <div className="p-5 sm:p-6 border-b border-border space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">طلبات التسجيل في الكورسات</h2>
          <span className="text-xs bg-muted px-2.5 py-1 rounded-full text-muted-foreground font-medium">
            {enrollments.length} طلب إجمالي
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ابحث باسم الطالب، البريد الإلكتروني، أو عنوان الكورس..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-10 h-10 rounded-xl"
            />
          </div>

          <div className="flex gap-1.5 p-1 bg-muted/50 rounded-xl shrink-0 self-start sm:self-auto">
            {(["all", "pending", "approved", "rejected"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === f
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {FILTER_LABELS[f]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-border">
        {isLoading ? (
          <div className="py-16 flex items-center justify-center">
            <div className="w-7 h-7 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground text-sm">
            لا توجد أي طلبات مطابقة للبحث أو التصفية الحالية.
          </div>
        ) : (
          filtered.map((enrollment: AdminEnrollment) => {
            const cfg = statusConfig[enrollment.status] ?? statusConfig.pending;
            const StatusIcon = cfg.icon;
            const studentName = enrollment.student_name ?? enrollment.user?.name ?? "مستخدم";
            const studentEmail = enrollment.student_email ?? enrollment.user?.email ?? "";
            const courseTitle = enrollment.course_title ?? enrollment.course?.title ?? "كورس";
            const isUpdating = activeUpdatingId === enrollment.id;

            return (
              <div
                key={enrollment.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:px-6 hover:bg-muted/20 transition-colors"
              >
                {/* User info */}
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-foreground text-sm truncate">
                        {studentName}
                      </p>
                      <span
                        className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${cfg.color}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{studentEmail}</p>
                    <p className="text-xs text-foreground font-medium mt-1 truncate">
                      الكورس: <span className="text-primary">{courseTitle}</span>
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {enrollment.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        disabled={isUpdating}
                        onClick={() => void handleUpdateStatus(enrollment.id, "approved", true)}
                        className="rounded-xl h-8 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5 ml-1" />
                        قبول وتفعيل
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isUpdating}
                        onClick={() => void handleUpdateStatus(enrollment.id, "rejected", false)}
                        className="rounded-xl h-8 px-3 text-xs border-destructive/20 text-destructive hover:bg-destructive/10"
                      >
                        <X className="w-3.5 h-3.5 ml-1" />
                        رفض
                      </Button>
                    </>
                  )}

                  {enrollment.status === "approved" && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isUpdating}
                      onClick={() => void handleUpdateStatus(enrollment.id, "rejected", false)}
                      className="rounded-xl h-8 px-2.5 text-xs text-muted-foreground hover:text-destructive"
                    >
                      إلغاء التفعيل
                    </Button>
                  )}

                  {enrollment.status === "rejected" && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isUpdating}
                      onClick={() => void handleUpdateStatus(enrollment.id, "approved", true)}
                      className="rounded-xl h-8 px-2.5 text-xs text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                    >
                      إعادة القبول
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

