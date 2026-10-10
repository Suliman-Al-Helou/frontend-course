import { STATUS_META, STATUS_ORDER } from './constants';

/* ───────────────────────── Legend.tsx ─────────────────────────
   مهمة الملف: مفتاح الألوان (قادم / تم الحضور / فائت).
   ليش مهم؟ اللون لحاله ما بيوصل المعنى لمن لا يميّز الألوان،
   فالمفتاح + الأيقونة داخل كل chip بيكمّلوا بعض.
   ✏️ EDIT HERE: الترتيب من STATUS_ORDER والنصوص من STATUS_META (constants.ts).
*/

export function Legend() {
  return (
    <ul className="flex flex-wrap items-center gap-4 border-b border-border px-4 py-2 text-xs text-muted-foreground">
      {STATUS_ORDER.map((status) => (
        <li key={status} className="flex items-center gap-2">
          <span className={`size-2 rounded-full ${STATUS_META[status].dot}`} aria-hidden />
          {STATUS_META[status].label}
        </li>
      ))}
    </ul>
  );
}