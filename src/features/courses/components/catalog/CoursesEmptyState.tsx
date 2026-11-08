"use client";

import { BookOpen, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface CoursesEmptyStateProps {
  search?: string;
  level?: string;
  onReset?: () => void;
}

export function CoursesEmptyState({
  search,
  level,
  onReset,
}: CoursesEmptyStateProps) {
  const hasActiveFilters = Boolean(search?.trim()) || (level && level !== "الكل");

  return (
    <div
      role="status"
      aria-live="polite"
      className="text-center py-20 px-4 text-muted-foreground"
    >
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/60 flex items-center justify-center">
        <BookOpen className="w-8 h-8 opacity-40 text-foreground" aria-hidden="true" />
      </div>

      <h3 className="text-xl font-bold text-foreground mb-2">
        لا توجد كورسات تطابق بحثك
      </h3>

      <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
        {hasActiveFilters
          ? "جرب كلمة بحث مختلفة أو قم بإعادة ضبط الفلاتر لعرض كافة الكورسات المتاحة."
          : "لم يتم العثور على أي كورسات في هذا القسم حالياً."}
      </p>

      {hasActiveFilters && onReset && (
        <Button
          onClick={onReset}
          variant="outline"
          className="min-h-[44px] gap-2 rounded-xl px-5 text-sm font-semibold hover:border-primary/50"
        >
          <RotateCcw className="w-4 h-4" />
          إعادة ضبط البحث
        </Button>
      )}
    </div>
  );
}

