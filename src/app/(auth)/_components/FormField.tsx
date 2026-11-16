import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

export function FormField({ id, label, error, disabled, className, ...inputProps }: Props) {
  const isEmail = inputProps.type === "email";

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-sm font-semibold text-foreground">
        {label}
      </Label>
      <Input
        id={id}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        dir={isEmail ? "ltr" : inputProps.dir}
        autoCapitalize={isEmail ? "none" : inputProps.autoCapitalize}
        autoCorrect={isEmail ? "off" : inputProps.autoCorrect}
        inputMode={isEmail ? "email" : inputProps.inputMode}
        className={cn(isEmail && "text-left", className)}
        {...inputProps}
      />
      {error && (
        <p id={`${id}-error`} className="text-xs text-destructive mt-1 font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
