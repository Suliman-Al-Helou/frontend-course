"use client";

import { useState, useEffect, useRef } from "react";
import { X, Loader2, Video, Calendar, Clock, Link as LinkIcon, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import flatpickr from "flatpickr";
import type { Instance } from "flatpickr/dist/types/instance";
import { Arabic } from "flatpickr/dist/l10n/ar.js";
import "flatpickr/dist/flatpickr.min.css";
import type { AdminZoomMeeting, ZoomMeetingFormData } from "@/features/admin-courses/types";

interface Props {
  open: boolean;
  onClose: () => void;
  editingMeeting: AdminZoomMeeting | null;
  courses: Array<{ id: number; title: string }>;
  onSave: (data: ZoomMeetingFormData) => Promise<unknown>;
}

function toLocalInput(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const parseLocal = (v: string) => new Date(v.replace(" ", "T"));

export default function ZoomMeetingModal({
  open,
  onClose,
  editingMeeting,
  courses,
  onSave,
}: Props) {
  const [courseId, setCourseId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [zoomLink, setZoomLink] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSubmittingRef = useRef(false);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const fpInstanceRef = useRef<Instance | null>(null);

  useEffect(() => {
    if (!open) return;

    if (editingMeeting) {
      setCourseId(String(editingMeeting.course_id || editingMeeting.course?.id || ""));
      setTitle(editingMeeting.title);
      setZoomLink(editingMeeting.zoom_link);
      const localTime = toLocalInput(editingMeeting.starts_at);
      setStartsAt(localTime);
      setDurationMinutes(editingMeeting.duration_minutes || 60);
      setDescription(editingMeeting.description || "");
    } else {
      setCourseId(courses.length > 0 ? String(courses[0].id) : "");
      setTitle("");
      setZoomLink("");
      setStartsAt("");
      setDurationMinutes(60);
      setDescription("");
    }
    setError(null);
  }, [open, editingMeeting, courses]);

  // تهيئة flatpickr عند فتح المودال
  useEffect(() => {
    if (!open || !dateInputRef.current) return;

    const fp = flatpickr(dateInputRef.current, {
      enableTime: true,
      dateFormat: "Y-m-d H:i",
      time_24hr: false,
      locale: Arabic,
      defaultDate: startsAt || undefined,
      onChange: (_dates, dateStr) => setStartsAt(dateStr),
    }) as Instance;

    fpInstanceRef.current = fp;

    return () => {
      fp.destroy();
      fpInstanceRef.current = null;
    };
  }, [open]);

  // إغلاق عبر Escape
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmittingRef.current) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;

    if (!courseId) {
      setError("الرجاء اختيار الكورس المرتبط باللقاء");
      return;
    }
    if (!title.trim()) {
      setError("عنوان اللقاء مطلوب");
      return;
    }
    if (!zoomLink.trim()) {
      setError("رابط لقاء Zoom مطلوب");
      return;
    }
    if (!startsAt) {
      setError("الرجاء تحديد تاريخ ووقت بداية اللقاء");
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setError(null);

    try {
      await onSave({
        course_id: Number.parseInt(courseId, 10),
        title: title.trim(),
        zoom_link: zoomLink.trim(),
        starts_at: parseLocal(startsAt).toISOString(),
        duration_minutes: durationMinutes,
        description: description.trim() || undefined,
      });
      onClose();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "تعذر حفظ اللقاء. تأكد من صحة البيانات.");
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="zoom-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 motion-reduce:animate-none">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0 bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 id="zoom-modal-title" className="text-base font-bold text-foreground">
                {editingMeeting ? "تعديل لقاء Zoom" : "إضافة لقاء Zoom مباشر"}
              </h2>
              <p className="text-xs text-muted-foreground">
                جدولة رابط اللقاء المباشر وتحديد موعد الجلسة لطلاب الكورس
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
            aria-label="إغلاق النافذة"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
              {error}
            </div>
          )}

          {/* الكورس المرتبط */}
          <div className="space-y-1.5">
            <label htmlFor="zoom-modal-course" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <span>الكورس المرتبط *</span>
            </label>
            <Select dir="rtl" value={courseId} onValueChange={setCourseId} disabled={isSubmitting}>
              <SelectTrigger id="zoom-modal-course" className="h-10 w-full rounded-xl border border-input bg-background">
                <SelectValue placeholder="اختر الكورس..." />
              </SelectTrigger>
              <SelectContent>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* عنوان اللقاء */}
          <div className="space-y-1.5">
            <label htmlFor="zoom-modal-title-input" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <span>عنوان اللقاء *</span>
            </label>
            <input
              id="zoom-modal-title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: جلسة الأسئلة والأجوبة الأسبوعية"
              disabled={isSubmitting}
              className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* رابط Zoom */}
          <div className="space-y-1.5">
            <label htmlFor="zoom-modal-link-input" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-muted-foreground" />
              <span>رابط لقاء Zoom *</span>
            </label>
            <input
              id="zoom-modal-link-input"
              value={zoomLink}
              onChange={(e) => setZoomLink(e.target.value)}
              placeholder="https://zoom.us/j/123456789"
              dir="ltr"
              disabled={isSubmitting}
              className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* الموعد والمدة */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="zoom-modal-starts-at" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                <span>التاريخ والوقت *</span>
              </label>
              <input
                id="zoom-modal-starts-at"
                ref={dateInputRef}
                type="text"
                value={startsAt}
                readOnly
                placeholder="اضغط لاختيار الموعد..."
                disabled={isSubmitting}
                className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="zoom-modal-duration" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                <span>المدة المتوقعة (بالدقائق)</span>
              </label>
              <input
                id="zoom-modal-duration"
                type="number"
                min={15}
                max={480}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number.parseInt(e.target.value, 10) || 60)}
                disabled={isSubmitting}
                className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* وصف اللقاء */}
          <div className="space-y-1.5">
            <label htmlFor="zoom-modal-desc" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-muted-foreground" />
              <span>وصف أو ملاحظات (اختياري)</span>
            </label>
            <textarea
              id="zoom-modal-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب تفاصيل المحاور أو المتطلبات السابقة للجلسة..."
              disabled={isSubmitting}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl h-10 px-4 min-w-[80px]"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl h-10 px-5 gap-2 min-w-[120px] bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جارٍ الحفظ...</span>
                </>
              ) : (
                <span>{editingMeeting ? "حفظ التعديلات" : "إضافة اللقاء"}</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
