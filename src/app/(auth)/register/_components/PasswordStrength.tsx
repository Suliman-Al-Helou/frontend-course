export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;

  const checks = [
    { ok: password.length >= 8 },
    { ok: /[A-Z]/.test(password) },
    { ok: /\d/.test(password) },
  ];
  const score  = checks.filter(c => c.ok).length;
  const colors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];
  const labels = ['', 'ضعيفة', 'مقبولة', 'قوية'];

  return (
    <div className="mt-1.5">
      <div className="flex gap-1 mb-1">
        {[0, 1, 2].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < score ? colors[score] : 'bg-muted'}`} />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{labels[score]}</p>
    </div>
  );
}