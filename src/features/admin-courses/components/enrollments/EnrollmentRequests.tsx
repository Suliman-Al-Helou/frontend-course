"use client";

import { useState, useMemo, useRef } from "react";
import { Clock, CheckCircle, XCircle, Check, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { notify } from "@/components/ui/sonner";
import { adminEnrollmentQueries } from "../../queries/adminCourses.queries";
import { useEnrollmentMutations } from "../../queries/adminCourses.mutations";
import type { AdminEnrollment, EnrollmentStatus } from "../../types";

const statusConfig: Record<
  EnrollmentStatus,
  { label: string; variant: "warning" | "success" | "destructive"; icon: typeof Clock }
> = {
  pending: {
    label: "معلّق",
    variant: "warning",
    icon: Clock,
  },
  approved: {
    label: "مقبول",
    variant: "success",
    icon: CheckCircle,
  },
  rejected: {
    label: "مرفوض",
    variant: "destructive",
    icon: XCircle,
  },
};

function formatRequestsCount(count: number): string {
  if (count === 0) return "لا توجد طلبات";
  if (count === 1) return "طلب واحد";
  if (count === 2) return "طلبان";
  if (count >= 3 && count <= 10) return `${count} طلبات`;
  return `${count} طلباً`;
}

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
    paymentConfirmed: boolean,
    studentName: string,
    courseTitle: string,
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

      if (status === "approved") {
        notify.success(`تم قبول وتفعيل تسجيل "${studentName}" في كورس "${courseTitle}" بنجاح`);
      } else if (status === "rejected") {
        notify.warning(`تم رفض طلب تسجيل الطالب "${studentName}"`);
      } else {
        notify.success("تم تحديث حالة طلب التسجيل بنجاح");
      }
    } catch (err: any) {
      console.error("فشل تحديث حالة التسجيل:", err);
      const msg = err?.response?.data?.message || "تعذر تحديث حالة الطلب، يرجى المحاولة لاحقاً";
      notify.error(msg);
    } finally {
      updatingIdRef.current = null;
      setActiveUpdatingId(null);
    }
  };

  return (
    <Card className="shadow-sm overflow-hidden border-border bg-card">
      {/* Header & Controls */}
      <div className="p-5 sm:p-6 border-b border-border space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">طلبات التسجيل في الكورسات</h2>
          <span className="text-xs bg-muted px-2.5 py-1 rounded-full text-muted-foreground font-medium">
            {formatRequestsCount(enrollments.length)} إجمالي
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <SearchInput
            placeholder="ابحث باسم الطالب، البريد الإلكتروني، أو عنوان الكورس..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
            className="flex-1 text-sm"
          />

          <div className="flex gap-1.5 p-1 bg-muted/50 rounded-xl shrink-0 self-start sm:self-auto min-h-[44px] items-center">
            {(["all", "pending", "approved", "rejected"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all min-h-[38px] ${
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
            <div className="w-7 h-7 border-3 border-primary/30 border-t-primary rounded-full animate-spin motion-reduce:animate-none" />
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
                  <Avatar name={studentName} size="md" shape="square" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-foreground text-sm truncate">
                        {studentName}
                      </p>
                      <Badge variant={cfg.variant} shape="rounded" size="sm">
                        <StatusIcon className="w-3 h-3" />
                        {cfg.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5 font-mono text-left" dir="ltr">
                      {studentEmail}
                    </p>
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
                        onClick={() =>
                          void handleUpdateStatus(
                            enrollment.id,
                            "approved",
                            true,
                            studentName,
                            courseTitle,
                          )
                        }
                        className="rounded-xl h-11 min-h-[44px] px-4 text-xs bg-success hover:bg-success/90 text-success-foreground font-semibold shadow-xs focus-visible:ring-2 focus-visible:ring-success"
                        aria-label={`قبول وتفعيل تسجيل ${studentName} في ${courseTitle}`}
                      >
                        <Check className="w-4 h-4 ml-1" />
                        قبول وتفعيل
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={isUpdating}
                        onClick={() =>
                          void handleUpdateStatus(
                            enrollment.id,
                            "rejected",
                            false,
                            studentName,
                            courseTitle,
                          )
                        }
                        className="rounded-xl h-11 min-h-[44px] px-4 text-xs border-destructive/20 text-destructive hover:bg-destructive/10 focus-visible:ring-2 focus-visible:ring-destructive"
                        aria-label={`رفض طلب تسجيل ${studentName} في ${courseTitle}`}
                      >
                        <X className="w-4 h-4 ml-1" />
                        رفض
                      </Button>
                    </>
                  )}

                  {enrollment.status === "approved" && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isUpdating}
                      onClick={() =>
                        void handleUpdateStatus(
                          enrollment.id,
                          "rejected",
                          false,
                          studentName,
                          courseTitle,
                        )
                      }
                      className="rounded-xl h-11 min-h-[44px] px-3.5 text-xs text-muted-foreground hover:text-destructive focus-visible:ring-2 focus-visible:ring-destructive"
                      aria-label={`إلغاء تفعيل تسجيل ${studentName} في ${courseTitle}`}
                    >
                      إلغاء التفعيل
                    </Button>
                  )}

                  {enrollment.status === "rejected" && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isUpdating}
                      onClick={() =>
                        void handleUpdateStatus(
                          enrollment.id,
                          "approved",
                          true,
                          studentName,
                          courseTitle,
                        )
                      }
                      className="rounded-xl h-11 min-h-[44px] px-3.5 text-xs text-success hover:bg-success/10 focus-visible:ring-2 focus-visible:ring-success"
                      aria-label={`إعادة قبول تسجيل ${studentName} في ${courseTitle}`}
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
    </Card>
  );
}
