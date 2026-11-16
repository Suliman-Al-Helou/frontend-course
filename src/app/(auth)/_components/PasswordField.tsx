"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  id: string;
  label: React.ReactNode;
  value: string;
  error?: string;
  disabled?: boolean;
  autoComplete?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  extra?: React.ReactNode;
  action?: React.ReactNode;
}

export function PasswordField({
  id,
  label,
  value,
  error,
  disabled,
  autoComplete,
  onChange,
  extra,
  action,
}: Props) {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-semibold text-foreground">
          {label}
        </label>
        {action}
      </div>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          placeholder="••••••••"
          value={value}
          onChange={onChange}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          dir="ltr"
          className={cn(
            "w-full h-11 min-h-[44px] rounded-xl border bg-background px-4 pe-12 text-base text-foreground transition-colors sm:text-sm text-left placeholder:text-right",
            "placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
            "motion-reduce:transition-none",
            error
              ? "border-destructive focus:border-destructive focus:ring-destructive/20"
              : "border-border hover:border-foreground/30 focus:border-primary focus:ring-primary/20",
          )}
        />
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          disabled={disabled}
          aria-label={show ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
          className="absolute end-1 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60 transition-colors"
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {extra}
      {error && (
        <p id={`${id}-error`} className="text-xs text-destructive mt-1 font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
