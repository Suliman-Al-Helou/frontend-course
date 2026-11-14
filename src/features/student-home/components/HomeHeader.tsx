"use client";

import { useMemo } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";

function getGreeting(hour: number): string {
  if (hour < 12) return "صباح الخير";
  if (hour < 18) return "مساء الخير";
  return "مساء النور";
}

export default function HomeHeader() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  const greeting = useMemo(() => {
    return getGreeting(new Date().getHours());
  }, []);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-4 animate-pulse">
          <div className="size-12 rounded-full bg-muted shrink-0" />
          <div className="space-y-2">
            <div className="h-3 w-28 rounded bg-muted" />
            <div className="h-6 w-44 rounded bg-muted" />
            <div className="h-3 w-40 rounded bg-muted" />
          </div>
        </div>
      </Card>
    );
  }

  const displayName = user?.name?.trim() || "الطالب";

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <Avatar name={displayName} size="lg" bordered className="shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-primary">{greeting}، مرحباً بك 👋</p>
            <h1 className="text-xl sm:text-2xl font-semibold text-foreground truncate mt-0.5">
              {displayName}
            </h1>
            {user?.email && (
              <p
                dir="ltr"
                className="text-xs text-muted-foreground mt-0.5 truncate text-end sm:text-end"
              >
                {user.email}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
