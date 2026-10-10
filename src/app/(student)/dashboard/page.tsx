"use client";

import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import ExamResults from "@/components/dashboard/ExamResults";
import ZoomCalendar from "@/components/student/ZoomCalendar";
import { getDashboardStats } from "@/lib/dashboardStats";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    getDashboardStats()
      .then((data) => setStreak(data.stats?.streak ?? 0))
      .catch(() => {});
  }, []);

  return (
    <div>
      <div className="mt-10">
        <StatsCards />
      </div>
      <div className="mt-10">
      <DashboardHeader user={user} streak={streak} />
      </div>
      <div className="mt-10">
        <ExamResults />
      </div>

      <div className="mt-10">
        <ZoomCalendar />
      </div>
    </div>
  );
}
