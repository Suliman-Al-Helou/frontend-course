'use client';

import { motion } from 'framer-motion';
import { Users, BookOpen, GraduationCap, Clock } from 'lucide-react';
import type { AdminStats } from '@/types';

export default function AdminStatsCards({ stats }: { stats: AdminStats }) {
  const cards = [
    { label: 'إجمالي الطلاب',    value: stats.totalStudents,      icon: Users,          color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'     },
    { label: 'الكورسات المتاحة', value: stats.totalCourses,       icon: BookOpen,       color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
    { label: 'المدربون',         value: stats.totalInstructors,   icon: GraduationCap,  color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'   },
    { label: 'طلبات معلّقة',    value: stats.pendingEnrollments, icon: Clock,          color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-card border border-border rounded-2xl p-5 shadow-sm"
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
            <card.icon className="w-5 h-5" />
          </div>
          <p className="text-2xl font-bold text-foreground">{card.value}</p>
          <p className="text-sm text-muted-foreground mt-1">{card.label}</p>
        </motion.div>
      ))}
    </div>
  );
}