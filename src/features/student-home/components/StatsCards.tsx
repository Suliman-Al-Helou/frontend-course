"use client";

import { QueryState } from "@/components/shared/QueryState";
import { Card } from "@/components/ui/card";
import { useStatCards } from "../queries/useStatCards";
import type { StatCardView } from "../types";

function StatCardItem({ stat }: { stat: StatCardView }) {
  const Icon = stat.icon;

  return (
    <Card className="p-4 sm:p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between gap-2">
        <dt className="text-xs sm:text-sm font-semibold text-muted-foreground truncate">
          {stat.label}
        </dt>
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
          aria-hidden="true"
        >
          <Icon className="size-4" />
        </span>
      </div>
      <dd className="mt-3 text-2xl sm:text-3xl font-semibold text-foreground">
        {stat.value}
      </dd>
    </Card>
  );
}

function StatsCardsSkeleton() {
  return (
    <div
      className="grid grid-cols-2 gap-4 lg:grid-cols-4"
      aria-busy="true"
      aria-label="جاري تحميل الإحصائيات"
    >
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <div className="h-4 w-20 rounded bg-muted animate-pulse motion-reduce:animate-none" />
            <div className="size-8 rounded-lg bg-muted animate-pulse motion-reduce:animate-none shrink-0" />
          </div>
          <div className="mt-3 h-8 w-16 rounded bg-muted animate-pulse motion-reduce:animate-none" />
        </Card>
      ))}
    </div>
  );
}

export default function StatsCards() {
  const query = useStatCards();

  return (
    <QueryState query={query} skeleton={<StatsCardsSkeleton />}>
      {(stats) => (
        <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCardItem key={stat.key} stat={stat} />
          ))}
        </dl>
      )}
    </QueryState>
  );
}
