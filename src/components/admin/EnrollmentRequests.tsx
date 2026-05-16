"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Search, Clock, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import type { Enrollment } from "@/types";

const statusConfig = {
  pending: {
    label: "معلّق",
    color:
      "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
    icon: Clock,
  },
  approved: {
    label: "مقبول",
    color:
      "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    icon: CheckCircle,
  },
  rejected: {
    label: "مرفوض",
    color: "bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400",
    icon: XCircle,
  },
} as const;

interface Props {
  enrollments: Enrollment[];
  onRefresh: () => void;
}

export default function EnrollmentRequests({ enrollments, onRefresh }: Props) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");
  const [loading, setLoading] = useState<number | null>(null);

  const filtered = enrollments.filter((e) => {
    const name = e.student_name ?? e.user?.name ?? "";
    const email = e.student_email ?? e.user?.email ?? "";
    const title = e.course_title ?? e.course?.title ?? "";

    const matchSearch =
      name.includes(search) || email.includes(search) || title.includes(search);
    const matchFilter = filter === "all" || e.status === filter;
    return matchSearch && matchFilter;
  });

  const updateStatus = async (
    id: number,
    status: "approved" | "rejected" | "pending",
  ) => {
    setLoading(id);
    try {
      await api.patch(`/admin/enrollments/${id}`, {
        status,
        payment_confirmed: status === "approved",
      });
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  const filterLabels = {
    all: "الكل",
    pending: "معلّق",
    approved: "مقبول",
    rejected: "مرفوض",
  } as const;

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-bold text-foreground mb-4">
          طلبات التسجيل
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ابحث بالاسم أو الإيميل أو الكورس..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-10 h-10"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "pending", "approved", "rejected"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === f
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {filterLabels[f]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="divide-y divide-border">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            لا توجد طلبات
          </div>
        ) : (
          filtered.map((enrollment, i) => {
            const cfg = statusConfig[enrollment.status] ?? statusConfig.pending;
            const Icon = cfg.icon;
            return (
              <motion.div
                key={enrollment.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                    {(enrollment.student_name ??
                      enrollment.user?.name ??
                      enrollment.student_email ??
                      enrollment.user?.email ??
                      "?")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {enrollment.student_name ?? enrollment.user?.name ?? "—"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {enrollment.student_email ?? enrollment.user?.email}
                    </p>
                    <p className="text-xs text-primary mt-1">
                      {enrollment.course_title ?? enrollment.course?.title}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${cfg.color}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {cfg.label}
                  </span>
                  {enrollment.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="h-8 bg-green-500 hover:bg-green-600 text-white rounded-lg px-3"
                        disabled={loading === enrollment.id}
                        onClick={() => updateStatus(enrollment.id, "approved")}
                      >
                        <Check className="w-3.5 h-3.5 ml-1" /> قبول
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 border-red-200 text-red-500 hover:bg-red-50 rounded-lg px-3"
                        disabled={loading === enrollment.id}
                        onClick={() => updateStatus(enrollment.id, "rejected")}
                      >
                        <X className="w-3.5 h-3.5 ml-1" /> رفض
                      </Button>
                    </div>
                  )}
                  {enrollment.status === "approved" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 border-orange-200 text-orange-500 hover:bg-orange-50 rounded-lg px-3"
                        disabled={loading === enrollment.id}
                        onClick={() => updateStatus(enrollment.id, "pending")}
                      >
                        <Clock className="w-3.5 h-3.5 ml-1" /> تعليق
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 border-red-200 text-red-500 hover:bg-red-50 rounded-lg px-3"
                        disabled={loading === enrollment.id}
                        onClick={() => updateStatus(enrollment.id, "rejected")}
                      >
                        <X className="w-3.5 h-3.5 ml-1" /> رفض
                      </Button>
                    </div>
                  )}
                  {enrollment.status === "rejected" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="h-8 bg-green-500 hover:bg-green-600 text-white rounded-lg px-3"
                        disabled={loading === enrollment.id}
                        onClick={() => updateStatus(enrollment.id, "approved")}
                      >
                        <Check className="w-3.5 h-3.5 ml-1" /> قبول
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 border-orange-200 text-orange-500 hover:bg-orange-50 rounded-lg px-3"
                        disabled={loading === enrollment.id}
                        onClick={() => updateStatus(enrollment.id, "pending")}
                      >
                        <Clock className="w-3.5 h-3.5 ml-1" /> تعليق
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
