"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  label: string;
  items: string[];
  placeholder: string;
  badgePrefix?: string;
  helperText?: string;
  onChange: (items: string[]) => void;
}

export default function CourseTagListField({
  label,
  items,
  placeholder,
  badgePrefix = "✓",
  helperText,
  onChange,
}: Props) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    // دعم لصق عناصر متعددة مفصولة بأسطر جديدة أو فواصل
    const newItems = trimmed
      .split(/[\n,]/)
      .map((s) => s.trim().replace(/^[-•*✓📌🎯]\s*/u, ""))
      .filter((s) => s.length > 0 && !items.includes(s));

    if (newItems.length > 0) {
      onChange([...items, ...newItems]);
      setInputValue("");
    }
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        {items.length > 0 && (
          <span className="text-xs text-muted-foreground font-medium">
            {items.length} {items.length === 1 ? "عنصر" : "عناصر"}
          </span>
        )}
      </div>

      {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}

      {/* العناصر المضافة */}
      {items.length > 0 && (
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {items.map((item, idx) => (
            <div
              key={`${item}-${idx}`}
              className="flex items-center justify-between gap-3 bg-muted/40 border border-border/60 rounded-xl px-3.5 py-2 text-sm group hover:border-border transition-colors"
            >
              <span className="text-foreground text-xs sm:text-sm leading-relaxed flex items-center gap-2 min-w-0 break-words">
                <span className="text-primary font-bold shrink-0">{badgePrefix}</span>
                <span className="truncate">{item}</span>
              </span>
              <Button
                type="button"
                variant="ghost"
                size="iconSm"
                onClick={() => handleRemove(idx)}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                aria-label={`حذف العنصر: ${item}`}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* حقل الإضافة */}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outlinePrimary"
          onClick={handleAdd}
          disabled={!inputValue.trim()}
          className="shrink-0"
          aria-label="إضافة عنصر"
        >
          <Plus className="w-4 h-4 ml-1" />
          إضافة
        </Button>
      </div>
    </div>
  );
}
