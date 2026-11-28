"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { notificationKeys, notificationQueries } from "../queries/notifications.queries";
import { markAllNotificationsAsRead, markNotificationAsRead } from "../api/notificationsApi";
import type { NotificationItem } from "../types";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery(notificationQueries.list());
  const notifications = data?.data ?? [];
  const unreadCount = data?.meta?.unread_count ?? 0;

  const markOneMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });

  const markAllMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleNotificationClick = (item: NotificationItem) => {
    if (!item.read_at && !markOneMutation.isPending) {
      markOneMutation.mutate(item.id);
    }
    setOpen(false);
    if (item.action_url) {
      router.push(item.action_url);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="الإشعارات"
        aria-expanded={open}
        className="relative inline-flex items-center justify-center size-11 rounded-xl border border-border/70 bg-card/80 text-foreground hover:bg-muted/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Bell className="size-5" aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            data-testid="notification-badge"
            className="absolute -top-1 -end-1 min-w-5 h-5 px-1 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="region"
          aria-label="قائمة الإشعارات"
          className="absolute end-0 mt-2 w-80 sm:w-96 rounded-2xl border border-border bg-card shadow-xl z-50 overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">الإشعارات</h3>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllMutation.mutate()}
                disabled={markAllMutation.isPending}
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline disabled:opacity-50"
              >
                <CheckCheck className="size-3.5" aria-hidden="true" />
                <span>تحديد الكل كمقروء</span>
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-border/60">
            {isPending ? (
              <div className="p-4 text-center text-xs text-muted-foreground">جاري التحميل...</div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                لا توجد إشعارات حالياً
              </div>
            ) : (
              notifications.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNotificationClick(item)}
                  className={`w-full text-start px-4 py-3 hover:bg-muted/50 transition-colors flex flex-col gap-1 ${
                    item.read_at ? "opacity-75" : "bg-primary/5"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-foreground line-clamp-1">
                      {item.title}
                    </span>
                    {!item.read_at && (
                      <span
                        className="size-2 rounded-full bg-primary shrink-0"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  {item.body && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{item.body}</p>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
