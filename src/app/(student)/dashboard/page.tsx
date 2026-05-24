'use client';

import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCards from '@/components/dashboard/StatsCards';
import ExamResults from '@/components/dashboard/ExamResults';

export default function DashboardPage() {
  const user = useAuthStore(state => state.user);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(res => setStreak(res.data.stats?.streak ?? 0))
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
    </div>
  );
}