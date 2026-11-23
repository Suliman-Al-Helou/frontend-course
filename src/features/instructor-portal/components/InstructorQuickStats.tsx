"use client";

import React from "react";
import { BookOpen, Users, Star, GraduationCap } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { InstructorDashboardStats } from "../utils/stats";

interface InstructorQuickStatsProps {
  stats: InstructorDashboardStats;
}

export function InstructorQuickStats({ stats }: InstructorQuickStatsProps) {
  const statItems = [
    {
      label: "المقررات الموكلة",
      value: stats.assignedCoursesCount,
      suffix: "مقرر",
      icon: BookOpen,
      description: "المقررات الدراسية المخصصة لإدارتها",
    },
    {
      label: "إجمالي الطلاب",
      value: stats.totalStudentsEnrolled,
      suffix: "طالب",
      icon: Users,
      description: "الطلاب المسجلون في مقرراتك",
    },
    {
      label: "متوسط التقييم",
      value: stats.averageRating !== null ? stats.averageRating : "—",
      suffix: stats.averageRating !== null ? "/ 5" : "",
      icon: stats.averageRating !== null ? Star : GraduationCap,
      description: "تقييم الطلاب للمقررات والدروس",
    },
  ];

  return (
    <div
      role="region"
      aria-label="مؤشرات وإحصائيات المدرب"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
    >
      {statItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <Card
            key={idx}
            className="p-5 sm:p-6 rounded-2xl border border-border bg-card/60 backdrop-blur-xs flex items-center gap-4 transition-all hover:border-primary/30 shadow-xs"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Icon className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <p className="text-xs font-normal text-muted-foreground truncate">{item.label}</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl sm:text-3xl font-bold text-foreground">{item.value}</span>
                {item.suffix && (
                  <span className="text-xs font-normal text-muted-foreground">{item.suffix}</span>
                )}
              </div>
              <p className="text-[11px] font-normal text-muted-foreground/80 truncate">
                {item.description}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
