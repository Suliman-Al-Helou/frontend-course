"use client";

import { Users, BookOpen, GraduationCap, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { adminCourseQueries, adminEnrollmentQueries } from "../../queries/adminCourses.queries";
import type { AdminStats } from "../../types";

interface Props {
  stats?: AdminStats;
}

export default function AdminStatsCards({ stats }: Props) {
  const { data: courses = [] } = useQuery(adminCourseQueries.list());
  const { data: enrollments = [] } = useQuery(adminEnrollmentQueries.list());

  const totalCourses = stats?.totalCourses ?? courses.length;
  const pendingEnrollments =
    stats?.pendingEnrollments ??
    enrollments.filter((e) => e.status === "pending").length;
  const totalStudents = stats?.totalStudents ?? 0;
  const totalInstructors = stats?.totalInstructors ?? 0;

  const cards = [
    {
      label: "إجمالي الطلاب",
      value: totalStudents,
      icon: Users,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    },
    {
      label: "الكورسات المتاحة",
      value: totalCourses,
      icon: BookOpen,
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
    },
    {
      label: "المدربون المعتمدون",
      value: totalInstructors,
      icon: GraduationCap,
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
    {
      label: "طلبات تسجيل معلّقة",
      value: pendingEnrollments,
      icon: Clock,
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="bg-card border border-border rounded-2xl p-5 shadow-xs transition-all hover:shadow-sm"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 border ${card.color}`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-foreground tracking-tight">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-1 font-medium">{card.label}</p>
          </div>
        );
      })}
    </div>
  );
}

