"use client";

import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCards from "@/components/dashboard/StatsCards";
import ExamResults from "@/components/dashboard/ExamResults";
import { BookOpen } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    api
      .get("/dashboard/stats")
      .then((res) => setStreak(res.data.stats?.streak ?? 0))
      .catch(() => {});
  }, []);

  return (
    <div>
      <DashboardHeader user={user} streak={streak} />
      <div className="mt-6">
        <StatsCards />
      </div>
      <div className="mt-6">
        <ExamResults />
      </div>

      <div className="text-center py-20">
        <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
        <Link
          href="/courses"
          className="bg-primary text-white px-6 py-2 rounded-xl text-sm hover:bg-primary/90 transition"
        >
         تصفح الكورسات
        </Link>
      </div>
    </div>
  );
}
