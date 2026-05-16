'use client';

import { useAuthStore } from '@/store/authStore';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCards from '@/components/dashboard/StatsCards';
import ExamResults from '@/components/dashboard/ExamResults';

export default function DashboardPage() {
  const user = useAuthStore(state => state.user);

  return (
    <div>
      <DashboardHeader user={user} />
      <div className="mt-6">
        <StatsCards />
      </div>
      <div className="mt-6">
        <ExamResults />
      </div>
    </div>
  );
}