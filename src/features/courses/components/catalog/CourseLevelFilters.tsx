"use client";

import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LEVELS, LEVEL_LABELS } from "../../utils/courseLevel";

export interface CourseLevelFiltersProps {
  level: string;
  onChange: (level: string) => void;
}

export function CourseLevelFilters({ level, onChange }: CourseLevelFiltersProps) {
  return (
    <nav
      role="group"
      aria-label="تصفية الكورسات حسب المستوى"
      className="flex items-center justify-center gap-2.5 flex-wrap py-6 px-4 border-b border-border bg-background"
    >
      <div className="flex items-center gap-1.5 text-muted-foreground ml-2">
        <Filter className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
        <span className="text-sm font-medium">المستوى:</span>
      </div>

      {LEVELS.map((l) => {
        const isSelected = level === l;
        return (
          <Button
            key={l}
            variant={isSelected ? "default" : "outline"}
            aria-pressed={isSelected}
            onClick={() => onChange(l)}
            className={`min-h-[44px] px-5 py-2 rounded-xl text-sm font-semibold transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none ${
              isSelected
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-card border-border text-foreground/80 hover:border-primary/50 hover:bg-muted"
            }`}
          >
            {LEVEL_LABELS[l] ?? l}
          </Button>
        );
      })}
    </nav>
  );
}
