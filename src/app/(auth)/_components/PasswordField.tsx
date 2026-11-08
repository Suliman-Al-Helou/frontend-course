'use client';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface Props {
  id: string;
  label: React.ReactNode;
  value: string;
  error?: string;
  disabled?: boolean;
  autoComplete?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  extra?: React.ReactNode;
}

export function PasswordField({ id, label, value, error, disabled, autoComplete, onChange, extra }: Props) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          placeholder="••••••••"
          value={value}
          onChange={onChange}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="w-full h-11 rounded-xl border border-input bg-background px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
        />
        <button type="button" onClick={() => setShow(p => !p)} disabled={disabled}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-60">
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {extra}
      {error && <p id={`${id}-error`} className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}