import { Check } from "lucide-react";

export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;

  const criteria = [
    { label: "8 أحرف على الأقل", ok: password.length >= 8 },
    { label: "حرف كبير (A-Z)", ok: /[A-Z]/.test(password) },
    { label: "رقم واحد (0-9)", ok: /\d/.test(password) },
  ];

  const passedCount = criteria.filter((c) => c.ok).length;
  const allPassed = passedCount === 3;

  return (
    <div className="mt-2 space-y-2 animate-in fade-in-50 duration-200">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < passedCount
                ? allPassed
                  ? "bg-emerald-500"
                  : passedCount === 2
                  ? "bg-amber-500"
                  : "bg-destructive/80"
                : "bg-muted"
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-xs text-muted-foreground pt-0.5">
        {criteria.map((c, i) => (
          <div
            key={i}
            className={`inline-flex items-center gap-1 transition-colors ${
              c.ok ? "text-emerald-500 font-medium" : "text-muted-foreground/80"
            }`}
          >
            {c.ok ? (
              <Check className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 shrink-0 mx-1" />
            )}
            <span>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
