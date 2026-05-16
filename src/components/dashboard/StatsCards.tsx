'use client';

// 1. Imports
import { motion } from 'framer-motion';
import { useStatsCards, StatCard } from '@/components/dashboard/_hooks/Usestatscards';

// 2. Types
interface StatCardItemProps {
  stat: StatCard;
  index: number;
}

// 3. Sub Components
function StatCardItem({ stat, index }: StatCardItemProps) {
  const Icon = stat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="bg-card rounded-2xl border border-border p-5 shadow-sm"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
    </motion.div>
  );
}

// 4. Main Component
export default function StatsCards() {
  const stats = useStatsCards();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <StatCardItem key={i} stat={stat} index={i} />
      ))}
    </div>
  );
}