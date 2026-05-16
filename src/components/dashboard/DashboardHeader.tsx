'use client';

import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDashboardHeader } from './_hooks/useDashboardHeader';

// تعريف الـ Type بدل any
interface User {
  name: string;
  email: string;
}

interface DashboardHeaderProps {
  user: User | null;
  streak?: number; // أيام متواصلة — قابل للتخصيص
}

export default function DashboardHeader({ user, streak = 0 }: DashboardHeaderProps) {
  const { greeting } = useDashboardHeader();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-700 to-blue-500 rounded-2xl p-6 sm:p-8 text-white mb-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-white/70 text-sm mb-1">{greeting}!</p>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {user?.name || 'الطالب'}
          </h1>
          <p className="text-white/60 text-sm mt-1">{user?.email}</p>
        </div>

        {/* Streak Counter */}
        <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-3 w-fit">
          <Flame className="w-5 h-5 text-orange-400" />
          <div>
            <p className="text-white font-bold text-lg leading-none">{streak}</p>
            <p className="text-white/60 text-xs">أيام متواصلة</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}