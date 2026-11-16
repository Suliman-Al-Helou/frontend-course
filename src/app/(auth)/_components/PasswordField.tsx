"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
        <Label htmlFor={id} className="text-sm font-semibold text-foreground">
          {label}
        </Label>
        {action}
      </div>
      {/* Explicitly dir="ltr" so the eye toggle sits on the right end and text starts on the left without collision */}
      <div className="relative" dir="ltr">
        <Input
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
          className="pe-12 text-left"
        />
        <Button
          type="button"
          variant="ghost"
          size="iconSm"
          onClick={() => setShow((p) => !p)}
          disabled={disabled}
          aria-label={show ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
          className="absolute end-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </Button>
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
