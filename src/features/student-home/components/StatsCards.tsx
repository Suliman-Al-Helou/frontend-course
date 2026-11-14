"use client";

import { QueryState } from "@/components/shared/QueryState";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useStatCards } from "../queries/useStatCards";
import type { StatCardView } from "../types";

function StatCardItem({ stat }: { stat: StatCardView }) {
  const Icon = stat.icon;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between border-b border-border">
        <p className="text-xs font-semibold text-muted-foreground truncate">{stat.label}</p>
        <Icon className="size-4 text-muted-foreground shrink-0 ms-2" aria-hidden />
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-2xl font-semibold font-mono tabular-nums text-foreground">{stat.value}</p>
      </CardContent>
    </Card>
  );
}

function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-24 animate-pulse rounded-md border border-border bg-muted" />
      ))}
    </div>
  );
}

export default function StatsCards() {
  const query = useStatCards();

  return (
    <QueryState query={query} skeleton={<StatsCardsSkeleton />}>
      {(stats) => (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCardItem key={stat.key} stat={stat} />
          ))}
        </div>
      )}
    </QueryState>
  );
}
