import { useEffect, useState } from 'react';

/* ───────────────────────── useNow.ts ─────────────────────────
   مهمة الملف: يرجّع الوقت الحالي (ms) ويحدّثه كل دقيقة.
   ليش hook؟ عشان "قادم → فائت" وخط الوقت الحالي يتحدثوا لحالهم
   بدون ما المستخدم يعمل refresh.
   ✏️ EDIT HERE: intervalMs لتغيير سرعة التحديث.
*/

export function useNow(intervalMs = 60_000) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    // cleanup: يوقف المؤقت لما الـ component يختفي (يمنع memory leak)
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}