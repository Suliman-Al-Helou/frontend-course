"use client";

import { BookOpen, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/states/EmptyState";

export interface CoursesEmptyStateProps {
  search?: string;
  level?: string;
  onReset?: () => void;
}

export function CoursesEmptyState({ search, level, onReset }: CoursesEmptyStateProps) {
  const hasActiveFilters = Boolean(search?.trim()) || (level && level !== "الكل");

  return (
    <EmptyState
      icon={BookOpen}
      title="لا توجد كورسات تطابق بحثك"
      description={
        hasActiveFilters
          ? "جرب كلمة بحث مختلفة أو قم بإعادة ضبط الفلاتر لعرض كافة الكورسات المتاحة."
          : "لم يتم العثور على أي كورسات في هذا القسم حالياً."
      }
    >
      {hasActiveFilters && onReset && (
        <Button onClick={onReset} variant="outline">
          <RotateCcw className="w-4 h-4" />
          إعادة ضبط البحث
        </Button>
      )}
    </EmptyState>
  );
}
