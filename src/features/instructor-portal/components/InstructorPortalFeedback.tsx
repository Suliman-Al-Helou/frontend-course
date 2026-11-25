"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, LifeBuoy, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface InstructorPortalSkeletonGridProps {
  count?: number;
  showButtonPlaceholder?: boolean;
}

export function InstructorPortalSkeletonGrid({
  count = 3,
  showButtonPlaceholder = false,
}: InstructorPortalSkeletonGridProps) {
  return (
    <div
      role="status"
      aria-label="جاري تحميل المحتوى"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse"
    >
      {Array.from({ length: count }, (_, idx) => (
        <div key={idx} className="rounded-2xl border border-border bg-card/40 p-4 space-y-4">
          <div className="aspect-video w-full rounded-xl bg-muted/60" />
          <div className="space-y-2">
            <div className="h-4 w-3/4 rounded bg-muted/60" />
            <div className="h-3 w-full rounded bg-muted/40" />
          </div>
          {showButtonPlaceholder && <div className="h-10 w-full rounded-xl bg-muted/40" />}
        </div>
      ))}
    </div>
  );
}

export interface InstructorPortalErrorCardProps {
  title?: string;
  message?: string;
  onRetry: () => void;
  isRetrying?: boolean;
}

export function InstructorPortalErrorCard({
  title = "تعذّر جلب البيانات",
  message = "حدث خطأ أثناء محاولة الاتصال بالخادم. يرجى المحاولة مرة ثانية.",
  onRetry,
  isRetrying = false,
}: InstructorPortalErrorCardProps) {
  return (
    <Card className="p-8 text-center border-destructive/20 bg-destructive/5 space-y-4">
      <div className="w-12 h-12 rounded-full bg-destructive/15 text-destructive flex items-center justify-center mx-auto">
        <AlertCircle className="w-6 h-6" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <h3 className="font-bold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      <Button
        onClick={onRetry}
        disabled={isRetrying}
        variant="outline"
        className="min-h-[44px] gap-2 border-border"
      >
        <RefreshCw className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`} />
        <span>إعادة المحاولة</span>
      </Button>
    </Card>
  );
}

export interface InstructorPortalEmptyStateProps {
  title: string;
  description: string;
  supportLinkText?: string;
  supportHref?: string;
}

export function InstructorPortalEmptyState({
  title,
  description,
  supportLinkText = "تواصل مع الإدارة للإسناد والدعم",
  supportHref = "/instructor/support",
}: InstructorPortalEmptyStateProps) {
  return (
    <div
      role="region"
      aria-label={title}
      className="rounded-2xl border border-dashed border-border bg-card/40 p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-4 animate-in fade-in duration-300 motion-reduce:animate-none"
    >
      <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
        <BookOpen className="w-8 h-8" aria-hidden="true" />
      </div>
      <div className="max-w-md space-y-2">
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
      <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
        <Button asChild variant="outline" className="min-h-[44px] gap-2 border-border">
          <Link href={supportHref}>
            <LifeBuoy className="w-4 h-4" aria-hidden="true" />
            <span>{supportLinkText}</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
