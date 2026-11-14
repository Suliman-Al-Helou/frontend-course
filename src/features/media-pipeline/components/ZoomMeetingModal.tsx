"use client";

import { useState, useEffect, useRef } from "react";
import { Video, Calendar, Clock, Link as LinkIcon, FileText } from "lucide-react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import type { AdminZoomMeeting, ZoomMeetingFormData } from "../types";

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
    <Modal isOpen={open} onClose={onClose} size="lg">
      <ModalHeader
        title={editingMeeting ? "تعديل لقاء Zoom" : "إضافة لقاء Zoom مباشر"}
        description="جدولة رابط اللقاء المباشر وتحديد موعد الجلسة لطلاب الكورس"
        icon={<Video className="w-5 h-5 text-primary" />}
      />

      <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
        <ModalBody className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
              {error}
            </div>
          )}

          {/* الكورس المرتبط */}
          <div className="space-y-1.5">
            <Label htmlFor="zoom-modal-course" className="text-xs font-semibold text-foreground">
              الكورس المرتبط *
            </Label>
            <Select dir="rtl" value={courseId} onValueChange={setCourseId} disabled={isSubmitting}>
              <SelectTrigger id="zoom-modal-course" className="h-10 w-full rounded-xl">
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
            <Label
              htmlFor="zoom-modal-title-input"
              className="text-xs font-semibold text-foreground"
            >
              عنوان اللقاء *
            </Label>
            <Input
              id="zoom-modal-title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: جلسة الأسئلة والأجوبة الأسبوعية"
              disabled={isSubmitting}
            />
          </div>

          {/* رابط Zoom */}
          <div className="space-y-1.5">
            <Label
              htmlFor="zoom-modal-link-input"
              className="text-xs font-semibold text-foreground flex items-center gap-1.5"
            >
              <LinkIcon className="w-3.5 h-3.5 text-muted-foreground" />
              <span>رابط اللقاء (Zoom Link) *</span>
            </Label>
            <Input
              id="zoom-modal-link-input"
              type="url"
              dir="ltr"
              value={zoomLink}
              onChange={(e) => setZoomLink(e.target.value)}
              placeholder="https://zoom.us/j/..."
              disabled={isSubmitting}
              className="text-left font-mono"
            />
          </div>

          {/* الموعد والمدة */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="zoom-modal-date-picker"
                className="text-xs font-semibold text-foreground flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                <span>موعد البداية *</span>
              </Label>
              <Input
                id="zoom-modal-date-picker"
                ref={dateInputRef}
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                placeholder="اختر التاريخ والوقت..."
                disabled={isSubmitting}
                readOnly
                className="cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="zoom-modal-duration-input"
                className="text-xs font-semibold text-foreground flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                <span>المدة التقريبية (بالدقائق)</span>
              </Label>
              <Input
                id="zoom-modal-duration-input"
                type="number"
                min={15}
                max={360}
                step={15}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number.parseInt(e.target.value, 10) || 60)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* الوصف (اختياري) */}
          <div className="space-y-1.5">
            <Label
              htmlFor="zoom-modal-desc-input"
              className="text-xs font-semibold text-foreground flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-muted-foreground" />
              <span>ملاحظات أو أجندة الجلسة (اختياري)</span>
            </Label>
            <textarea
              id="zoom-modal-desc-input"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب نقاط النقاش أو شروط الحضور..."
              disabled={isSubmitting}
              className="w-full rounded-xl border border-border bg-background p-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 resize-none transition-colors motion-reduce:transition-none"
            />
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl h-10 px-4 text-xs font-medium"
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            loading={isSubmitting}
            className="rounded-xl h-10 px-5 text-xs font-semibold"
          >
            {editingMeeting ? "حفظ التعديلات" : "إنشاء اللقاء"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
