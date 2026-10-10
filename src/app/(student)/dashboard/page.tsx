"use client";

import { useAuthStore } from "@/store/authStore";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import ExamResults from "@/components/dashboard/ExamResults";
import ZoomCalendar from "@/components/student/ZoomCalendar";
import { useDashboardStats } from "@/components/dashboard/_hooks/Usedashboardstats";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  // نفس الـ query تبع StatsCards و ExamResults ← طلب واحد مشترك، بدون state ولا useEffect
  const { data } = useDashboardStats();
  const streak = data?.stats.streak ?? 0;

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