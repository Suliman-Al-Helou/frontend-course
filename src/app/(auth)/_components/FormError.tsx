import { AlertCircle } from "lucide-react";

export function FormError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="bg-destructive/10 text-destructive text-sm rounded-xl px-4 py-3 border border-destructive/20 flex items-center gap-2.5 animate-in fade-in-50 duration-200"
    >
      <AlertCircle className="w-4 h-4 shrink-0" />
      <span className="font-medium leading-relaxed">{message}</span>
    </div>
  );
}
