"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

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
        <label htmlFor={id} className="text-sm font-medium text-foreground">
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
          className={`w-full h-11 rounded-xl border bg-background px-4 pe-10 text-sm transition-colors focus:outline-none focus:ring-2 disabled:opacity-60 ${
            error
              ? "border-destructive focus:border-destructive focus:ring-destructive/20 text-foreground"
              : "border-input hover:border-foreground/30 focus:border-primary focus:ring-primary/20"
          }`}
        />
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          disabled={disabled}
          aria-label={show ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
          className="absolute end-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-60 transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
