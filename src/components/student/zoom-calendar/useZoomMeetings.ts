import { useEffect, useRef, useState } from 'react';
import api from '@/lib/api';
import type { ZoomMeeting } from './types';

/* ───────────────────────── useZoomMeetings.ts ─────────────────────────
   مهمة الملف: كل ما يخص الـ API (جلب اللقاءات + تسجيل الحضور).
   المنطق منقول من الملف القديم كما هو بدون تغيير، فقط انتقل من
   الـ component لهون ليبقى الـ UI نظيفًا (الـ UI بياخد النتيجة فقط).

   المدخل:  monthKeysSignature = أشهر العرض الحالي مفصولة بفاصلة، مثل "2026-09,2026-10"
            (بيحسبها ZoomCalendar.tsx حسب الفلتر: شهر/أسبوع/يوم)
   المخرج:  { meetings, loading, error, joiningId, attend }
*/

export function useZoomMeetings(monthKeysSignature: string) {
  const [meetings, setMeetings] = useState<ZoomMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  /* ── جلب اللقاءات ── */

  const loadMeetings = async (keys: string[]) => {
    // رقم الطلب: لو المستخدم غيّر الشهر بسرعة، نتجاهل ردود الطلبات القديمة
    const current = ++requestId.current;
    setLoading(true);
    setError(null);

    try {
      // طلب لكل شهر (أسبوع يقع بين شهرين = طلبين)
      const responses = await Promise.all(
        keys.map((key) => api.get(`/zoom-meetings?month=${key}`)),
      );

      // Map بمفتاح id: لو نفس اللقاء رجع من شهرين ما يتكرر
      const merged = new Map<number, ZoomMeeting>();
      for (const res of responses) {
        const data = res.data.data ?? res.data;
        if (Array.isArray(data)) {
          for (const meeting of data as ZoomMeeting[]) merged.set(meeting.id, meeting);
        }
      }

      if (current === requestId.current) setMeetings([...merged.values()]);
    } catch {
      if (current === requestId.current) {
        setMeetings([]);
        // ✏️ EDIT HERE: رسالة فشل التحميل (TODO translate)
        setError('تعذّر تحميل لقاءات Zoom.');
      }
    } finally {
      if (current === requestId.current) setLoading(false);
    }
  };

  useEffect(() => {
    void loadMeetings(monthKeysSignature.split(','));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthKeysSignature]);

  /* ── تسجيل الحضور + فتح Zoom (المنطق كما هو) ── */

  const attend = async (meeting: ZoomMeeting) => {
    if (!meeting.can_join) return;

    // لازم تُفتح النافذة قبل أي await، وإلا يحجبها المتصفح
    const popup = window.open('', '_blank');

    setJoiningId(meeting.id);
    setError(null);

    try {
      const res = await api.post<{ zoom_link: string }>(`/zoom-meetings/${meeting.id}/attend`);
      const zoomLink = res.data.zoom_link;

      setMeetings((current) =>
        current.map((item) => (item.id === meeting.id ? { ...item, attended: true } : item)),
      );

      if (popup) {
        popup.opener = null;
        popup.location.href = zoomLink;
      } else {
        // النافذة انحجبت: نفتح الرابط بنفس التبويب
        window.location.href = zoomLink;
      }
    } catch (e) {
      popup?.close();
      const message = (e as { response?: { data?: { message?: string } } }).response?.data
        ?.message;
      // ✏️ EDIT HERE: رسالة الخطأ الافتراضية (TODO translate)
      setError(message ?? 'لا يمكن الدخول إلى اللقاء في الوقت الحالي.');
    } finally {
      setJoiningId(null);
    }
  };

  return { meetings, loading, error, joiningId, attend };
}