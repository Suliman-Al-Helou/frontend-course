'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, Loader2, Users, X, Video } from 'lucide-react';
import api from '@/lib/api';
import flatpickr from 'flatpickr';
import type { Instance } from 'flatpickr/dist/types/instance';
import { Arabic } from 'flatpickr/dist/l10n/ar.js';
import 'flatpickr/dist/flatpickr.min.css';

interface ZoomMeeting {
  id: number;
  course_name: string;
  title: string;
  description: string | null;
  zoom_link: string;
  starts_at: string; // ISO (UTC)
  attendances_count?: number;
}

interface Attendance {
  id: number;
  attended_at: string;
  user: { id: number; name: string; email: string };
}

const EMPTY = { course_name: '', title: '', zoom_link: '', starts_at: '', description: '' };

const inputCls =
  'w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring';

// ISO (UTC) -> نص بنفس صيغة flatpickr ("Y-m-d H:i") بتوقيت المتصفح
function toLocalInput(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// "2026-09-30 18:00" -> Date بتوقيت المتصفح (استبدال المسافة بـ T ليعمل على كل المتصفحات)
const parseLocal = (v: string) => new Date(v.replace(' ', 'T'));

const fmt = (iso: string) =>
  new Date(iso).toLocaleString('ar', { dateStyle: 'medium', timeStyle: 'short' });

export default function ManageZoomTab() {
  const [meetings, setMeetings] = useState<ZoomMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // قائمة الحضور للقاء مفتوح
  const [openId, setOpenId] = useState<number | null>(null);
  const [attendees, setAttendees] = useState<Attendance[]>([]);
  const [loadingAtt, setLoadingAtt] = useState(false);

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/zoom-meetings');
      setMeetings(res.data.data ?? res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchMeetings();
  }, []);

  const set = (k: keyof typeof EMPTY, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const valid = form.course_name.trim() && form.title.trim() && form.zoom_link.trim();

  // منتقي التاريخ (flatpickr): يُنشأ مرة واحدة ويُدمَّر عند مغادرة التاب
  const dateRef = useRef<HTMLInputElement>(null);
  const fpRef = useRef<Instance | null>(null);

  useEffect(() => {
    if (!dateRef.current) return;
    const fp = flatpickr(dateRef.current, {
      enableTime: true,
      dateFormat: 'Y-m-d H:i',
      time_24hr: false,
      locale: Arabic,
      onChange: (_dates, dateStr) => setForm((p) => ({ ...p, starts_at: dateStr })),
    }) as Instance;
    fpRef.current = fp;
    return () => fp.destroy();
  }, []);

  const reset = () => {
    setForm(EMPTY);
    fpRef.current?.clear(false);
    setEditingId(null);
    setError(null);
  };

  const handleSave = async () => {
    if (!valid) return;
    if (!form.starts_at) {
      setError('الرجاء اختيار تاريخ ووقت اللقاء');
      return;
    }
    setSaving(true);
    setError(null);
    const payload = {
      course_name: form.course_name.trim(),
      title: form.title.trim(),
      zoom_link: form.zoom_link.trim(),
      description: form.description.trim() || null,
      starts_at: parseLocal(form.starts_at).toISOString(), // يخزّن UTC
    };
    try {
      if (editingId) await api.put(`/admin/zoom-meetings/${editingId}`, payload);
      else await api.post('/admin/zoom-meetings', payload);
      reset();
      await fetchMeetings();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message ?? 'تعذّر حفظ اللقاء');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (m: ZoomMeeting) => {
    const startsAt = toLocalInput(m.starts_at);
    setEditingId(m.id);
    setForm({
      course_name: m.course_name,
      title: m.title,
      zoom_link: m.zoom_link,
      starts_at: startsAt,
      description: m.description ?? '',
    });
    fpRef.current?.setDate(startsAt, false); // يزامن المنتقي مع اللقاء المعدّل
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('سيتم حذف اللقاء وسجلات حضوره. متأكد؟')) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/zoom-meetings/${id}`);
      if (editingId === id) reset();
      await fetchMeetings();
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingId(null);
    }
  };

  const toggleAttendees = async (id: number) => {
    if (openId === id) return setOpenId(null);
    setOpenId(id);
    setLoadingAtt(true);
    try {
      const res = await api.get(`/admin/zoom-meetings/${id}/attendances`);
      setAttendees(res.data.data ?? res.data);
    } catch (e) {
      console.error(e);
      setAttendees([]);
    } finally {
      setLoadingAtt(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" />
            {editingId ? 'تعديل اللقاء' : 'إضافة لقاء Zoom'}
          </h2>
          {editingId && (
            <button onClick={reset} className="text-xs text-muted-foreground flex items-center gap-1">
              <X className="w-3.5 h-3.5" /> إلغاء التعديل
            </button>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label htmlFor="zoom-course-name" className="text-sm font-medium text-foreground">اسم الكورس *</label>
            <input id="zoom-course-name" value={form.course_name} onChange={(e) => set('course_name', e.target.value)}
              placeholder="مثال: الأمن السيبراني" className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="zoom-title" className="text-sm font-medium text-foreground">عنوان اللقاء *</label>
            <input id="zoom-title" value={form.title} onChange={(e) => set('title', e.target.value)}
              placeholder="مثال: مراجعة الأسبوع الأول" className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="zoom-link" className="text-sm font-medium text-foreground">رابط Zoom *</label>
            <input id="zoom-link" value={form.zoom_link} onChange={(e) => set('zoom_link', e.target.value)}
              placeholder="https://zoom.us/j/..." dir="ltr" className={inputCls} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="zoom-starts-at" className="text-sm font-medium text-foreground">التاريخ والوقت *</label>
            <input id="zoom-starts-at" ref={dateRef} type="text" value={form.starts_at} readOnly
              placeholder="اضغط لاختيار التاريخ والوقت..." className={inputCls} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="zoom-description" className="text-sm font-medium text-foreground">وصف (اختياري)</label>
            <textarea id="zoom-description" value={form.description} onChange={(e) => set('description', e.target.value)}
              rows={2}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none" />
          </div>
        </div>

        {error && <p className="text-sm text-destructive mt-3">{error}</p>}

        <button onClick={handleSave} disabled={saving || !valid}
          className="mt-4 flex items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-60 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {editingId ? 'حفظ التعديلات' : 'إضافة اللقاء'}
        </button>
      </div>

      {/* List */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-base font-bold text-foreground">لقاءات Zoom ({meetings.length})</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : meetings.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground text-sm">
            لا توجد لقاءات بعد — أضف لقاءً من الأعلى
          </div>
        ) : (
          <div className="divide-y divide-border">
            {meetings.map((m) => (
              <div key={m.id} className="p-4">
                <div className="flex items-center gap-3">
                  <Video className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{m.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {m.course_name} • {fmt(m.starts_at)}
                    </p>
                  </div>
                  <button onClick={() => toggleAttendees(m.id)}
                    className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                    <Users className="w-3.5 h-3.5" />
                    {m.attendances_count ?? 0}
                  </button>
                  <button onClick={() => handleEdit(m)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(m.id)} disabled={deletingId === m.id}
                    className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors">
                    {deletingId === m.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>

                {openId === m.id && (
                  <div className="mt-3 bg-muted/30 rounded-xl p-3">
                    {loadingAtt ? (
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    ) : attendees.length === 0 ? (
                      <p className="text-xs text-muted-foreground">لم يحضر أحد بعد</p>
                    ) : (
                      <ul className="space-y-1.5">
                        {attendees.map((a) => (
                          <li key={a.id} className="flex items-center justify-between text-xs">
                            <span className="text-foreground">{a.user.name}
                              <span className="text-muted-foreground"> — {a.user.email}</span>
                            </span>
                            <span className="text-muted-foreground">{fmt(a.attended_at)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}