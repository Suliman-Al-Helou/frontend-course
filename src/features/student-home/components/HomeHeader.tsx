// HomeHeader.tsx
"use client";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useAuthStore } from "@/store/authStore";

export default function HomeHeader() {
  const user = useAuthStore((state) => state.user);
  return <DashboardHeader user={user} />;
}
