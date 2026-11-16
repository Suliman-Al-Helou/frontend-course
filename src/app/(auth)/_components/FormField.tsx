import * as React from "react";
import { cn } from "@/lib/utils";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

export function FormField({ id, label, error, disabled, className, ...inputProps }: Props) {
  const isEmail = inputProps.type === "email";

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-foreground">
        {label}
      </label>
      <input
        id={id}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        dir={isEmail ? "ltr" : inputProps.dir}
        autoCapitalize={isEmail ? "none" : inputProps.autoCapitalize}
        autoCorrect={isEmail ? "off" : inputProps.autoCorrect}
        inputMode={isEmail ? "email" : inputProps.inputMode}
        {...inputProps}
        className={cn(
          "w-full h-11 min-h-[44px] rounded-xl border bg-background px-4 text-base text-foreground transition-colors sm:text-sm",
          "placeholder:text-muted-foreground",
          "focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60",
          "motion-reduce:transition-none",
          isEmail ? "text-left placeholder:text-right" : "",
          error
            ? "border-destructive focus:border-destructive focus:ring-destructive/20"
            : "border-border hover:border-foreground/30 focus:border-primary focus:ring-primary/20",
          className,
        )}
      />
      {error && (
        <p id={`${id}-error`} className="text-xs text-destructive mt-1 font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
