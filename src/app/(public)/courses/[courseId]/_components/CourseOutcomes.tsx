// src/app/(public)/courses/[id]/_components/CourseOutcomes.tsx

import { CheckCircle } from 'lucide-react';

interface CourseOutcomesProps {
  outcomes:     string[];
  requirements: string[];
  target:       string[];
}

export function CourseOutcomes({ outcomes, requirements, target }: CourseOutcomesProps) {
  return (
    <>
      {/* What you'll learn */}
      <section>
        <h2 className="text-xl font-bold text-blue-deep mb-5">ستتعلم في هذا الكورس</h2>
        <div className="bg-blue-pale rounded-2xl p-6 grid sm:grid-cols-2 gap-3">
          {outcomes.map((o, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm text-foreground">{o}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Requirements + Target */}
      <div className="grid sm:grid-cols-2 gap-6">
        <section>
          <h2 className="text-lg font-bold text-blue-deep mb-4">المتطلبات</h2>
          <ul className="space-y-2">
            {requirements.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />{r}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-bold text-blue-deep mb-4">هذا الكورس لك إذا كنت...</h2>
          <ul className="space-y-2">
            {target.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />{t}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}