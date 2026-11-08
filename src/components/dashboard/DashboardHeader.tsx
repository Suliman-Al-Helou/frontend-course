'use client';

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
      className="bg-gradient-to-tr from-primary/50 to-40% rounded-2xl p-6 sm:p-8 text-white mb-8 w-fit"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className=" text-foreground text-sm mb-1 bg-gradient-to-t  from-primary/40 to-100% w-fit">{greeting}!</p>
          <h1 className="text-foreground text-2xl sm:text-3xl font-bold">
            {user?.name || 'الطالب'}
          </h1>
          <p className="text-foreground text-sm mt-1">{user?.email}</p>
        </div>

      
      </div>
    </motion.div>
  );
}