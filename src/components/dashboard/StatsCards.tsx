"use client";

// 1. Imports
import { motion } from "framer-motion";
import {
  useStatsCards,
  StatCard,
} from "@/components/dashboard/_hooks/Usestatscards";
import { cn } from "@/lib/utils";
import { QueryState } from "@/components/shared/QueryState";

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
      className="bg-card rounded-2xl  border border-border p-5 shadow-sm"
    >
      <div className="border-b border-border flex items-center justify-between pb-3 ">
        <p className="text-xs text-muted-foreground mt-0.5 font-bold">{stat.label}</p>

        <div
          className={cn(
            "w-7 h-7 rounded-sm flex items-center justify-center border",
            stat.color === "blue" && "border-blue-200/10  text-primary",
            stat.color === "green" && "border-green-200/10  text-green-600",
            stat.color === "purple" && "border-purple-200/10  text-purple-600",
            stat.color === "yellow" && "border-yellow-200/10  text-yellow-600",
          )}
        >
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-2xl font-bold text-foreground mt-3 ">{stat.value}</p>
    </motion.div>
  );
}

function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-card rounded-2xl border border-border p-5 shadow-sm animate-pulse"
        >
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="h-3 w-20 rounded bg-muted" />
            <div className="h-7 w-7 rounded-sm bg-muted" />
          </div>
          <div className="mt-3 h-7 w-12 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

// 4. Main Component
export default function StatsCards() {
  const query = useStatsCards();

  return (
    <QueryState query={query} skeleton={<StatsCardsSkeleton />}>
      {(stats) => (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <StatCardItem key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      )}
    </QueryState>
  );
}