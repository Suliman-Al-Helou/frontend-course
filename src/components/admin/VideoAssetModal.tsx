"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  X,
  Loader2,
  Video,
  Film,
  Clock,
  Link as LinkIcon,
  FileText,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  UploadCloud,
  FileVideo,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { extractYouTubeVideoId } from "@/lib/youtube";
import { uploadVideoChunk } from "@/features/admin-courses/api";
import { adminVideoAssetQueries, adminYouTubeQueries } from "@/features/admin-courses/queries/adminCourses.queries";
import type { AdminVideoAsset, VideoAssetFormData, AdminZoomMeeting } from "@/features/admin-courses/types";

interface Props {
  open: boolean;
  onClose: () => void;
  editingAsset: AdminVideoAsset | null;
  courses: Array<{ id: number; title: string }>;
  meetings: AdminZoomMeeting[];
  onSave: (data: VideoAssetFormData) => Promise<unknown>;
}

export default function VideoAssetModal({
  open,
  onClose,
  editingAsset,
  courses,
  meetings,
  onSave,
}: Props) {
  const queryClient = useQueryClient();
  const { data: ytStatus } = useQuery(adminYouTubeQueries.status());

  // Mode: "upload" (file dropzone) or "manual" (YouTube link/ID)
  const [mode, setMode] = useState<"upload" | "manual">("upload");

  // Form Fields
  const [courseId, setCourseId] = useState<string>("");
  const [zoomMeetingId, setZoomMeetingId] = useState<string>("none");
  const [title, setTitle] = useState("");
  const [rawVideoInput, setRawVideoInput] = useState("");
  const [durationMinutes, setDurationMinutes] = useState<string>("45");
  const [type, setType] = useState<"recording" | "lesson">("recording");
  const [description, setDescription] = useState("");

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSubmittingRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractedId = extractYouTubeVideoId(rawVideoInput.trim());

  useEffect(() => {
    if (!open) return;

    if (editingAsset) {
      setMode("manual");
      setCourseId(String(editingAsset.course_id));
      setZoomMeetingId(editingAsset.zoom_meeting_id ? String(editingAsset.zoom_meeting_id) : "none");
      setTitle(editingAsset.title);
      setRawVideoInput(editingAsset.provider_video_id);
      setDurationMinutes(String(Math.round(editingAsset.duration_seconds / 60) || 0));
      setType(editingAsset.type);
      setDescription(editingAsset.description || "");
      setSelectedFile(null);
    } else {
      setMode("upload");
      setCourseId(courses.length > 0 ? String(courses[0].id) : "");
      setZoomMeetingId("none");
      setTitle("");
      setRawVideoInput("");
      setDurationMinutes("45");
      setType("recording");
      setDescription("");
      setSelectedFile(null);
    }
    setUploadProgress(0);
    setError(null);
  }, [open, editingAsset, courses]);

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileSelected(file);
    }
  };

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    if (!title.trim()) {
      // Auto-populate title from clean filename
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setTitle(cleanName);
    }
  };

  // Close on Escape
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

  const filteredMeetings = meetings.filter((m) => {
    const meetingCourseId = m.course_id || m.course?.id;
    return String(meetingCourseId) === courseId;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;

    if (!courseId) {
      setError("الرجاء اختيار الكورس المرتبط بالفيديو");
      return;
    }
    if (!title.trim()) {
      setError("عنوان الفيديو مطلوب");
      return;
    }

    // MODE 1: CHUNKED FILE UPLOAD
    if (mode === "upload") {
      if (!ytStatus?.connected) {
        setError("قناة YouTube غير مربوطة بعد. يرجى ربط القناة أولاً من تبويب لقاءات Zoom لتفعيل رفع الفيديوهات.");
        return;
      }

      if (!selectedFile) {
        setError("الرجاء اختيار ملف فيديو للرفع (.mp4 أو .webm)");
        return;
      }

      isSubmittingRef.current = true;
      setIsSubmitting(true);
      setError(null);
      setUploadProgress(1);

      try {
        const chunkSize = 5 * 1024 * 1024; // 5 MB per chunk
        const totalChunks = Math.ceil(selectedFile.size / chunkSize);
        const uploadId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        for (let i = 0; i < totalChunks; i++) {
          const start = i * chunkSize;
          const end = Math.min(start + chunkSize, selectedFile.size);
          const chunkBlob = selectedFile.slice(start, end);

          const result = await uploadVideoChunk({
            chunk: chunkBlob,
            chunkIndex: i,
            totalChunks,
            uploadId,
            fileName: selectedFile.name,
            courseId: Number.parseInt(courseId, 10),
            zoomMeetingId: zoomMeetingId !== "none" ? Number.parseInt(zoomMeetingId, 10) : null,
            title: title.trim(),
            description: description.trim() || undefined,
            type,
          });

          setUploadProgress(result.progress);
        }

        void queryClient.invalidateQueries({ queryKey: adminVideoAssetQueries.all() });
        onClose();
      } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } };
        setError(e.response?.data?.message || "فشل رفع الفيديو على مراحل. تحقق من الاتصال بالإنترنت.");
      } finally {
        isSubmittingRef.current = false;
        setIsSubmitting(false);
      }
      return;
    }

    // MODE 2: MANUAL YOUTUBE LINK / ID
    if (!extractedId && !rawVideoInput.trim()) {
      setError("رابط يوتيوب أو معرّف الفيديو (11 حرفاً) مطلوب");
      return;
    }

    const durationSec = Math.max(0, (Number.parseInt(durationMinutes, 10) || 0) * 60);

    isSubmittingRef.current = true;
    setIsSubmitting(true);
    setError(null);

    try {
      await onSave({
        course_id: Number.parseInt(courseId, 10),
        zoom_meeting_id: zoomMeetingId !== "none" ? Number.parseInt(zoomMeetingId, 10) : null,
        title: title.trim(),
        provider: "youtube",
        provider_video_id: extractedId || rawVideoInput.trim(),
        duration_seconds: durationSec,
        type,
        description: description.trim() || undefined,
      });
      onClose();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setError(e.response?.data?.message || "تعذر حفظ الفيديو. تأكد من صحة البيانات.");
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 motion-reduce:animate-none">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0 bg-emerald-500/5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 id="video-modal-title" className="text-base font-bold text-foreground">
                {editingAsset ? "تعديل الفيديو" : "رفع / إدراج فيديو جديد"}
              </h2>
              <p className="text-xs text-muted-foreground">
                رفع ملف فيديو من جهازك مباشرة أو إدراج رابط YouTube لبنك الوسائط
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

        {/* Mode Selector Tabs (فقط في حالة الإضافة الجديدة) */}
        {!editingAsset && (
          <div className="px-6 pt-3 shrink-0 flex items-center gap-2 border-b border-border bg-muted/20 pb-2">
            <button
              type="button"
              onClick={() => setMode("upload")}
              disabled={isSubmitting}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                mode === "upload"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>رفع ملف فيديو من الجهاز (موصى به)</span>
            </button>

            <button
              type="button"
              onClick={() => setMode("manual")}
              disabled={isSubmitting}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                mode === "manual"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>إدخال رابط / معرّف يوتيوب يدوياً</span>
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
              {error}
            </div>
          )}

          {/* تنبيه واضح في حال عدم ربط قناة YouTube */}
          {mode === "upload" && !ytStatus?.connected && (
            <div className="p-3.5 rounded-xl border bg-amber-500/10 border-amber-500/25 text-amber-900 dark:text-amber-300 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <div className="space-y-1">
                <p className="font-bold">قناة YouTube غير مربوطة بعد</p>
                <p className="text-[11px] leading-relaxed opacity-90">
                  لم يتم ربط قناة YouTube رسمية بالمنصة بعد. لن تتمكن من رفع ملفات الفيديو من جهازك حتى تقوم بربط القناة من زر <strong>&quot;الاتصال بـ YouTube&quot;</strong> في تبويب لقاءات Zoom.
                </p>
              </div>
            </div>
          )}

          {/* الكورس والنوع */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="video-modal-course" className="text-xs font-semibold text-foreground">
                الكورس المرتبط *
              </label>
              <Select dir="rtl" value={courseId} onValueChange={(v) => { setCourseId(v); setZoomMeetingId("none"); }} disabled={isSubmitting}>
                <SelectTrigger id="video-modal-course" className="h-10 w-full rounded-xl border border-input bg-background">
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

            <div className="space-y-1.5">
              <label htmlFor="video-modal-type" className="text-xs font-semibold text-foreground">
                تصنيف الفيديو
              </label>
              <Select dir="rtl" value={type} onValueChange={(v: "recording" | "lesson") => setType(v)} disabled={isSubmitting}>
                <SelectTrigger id="video-modal-type" className="h-10 w-full rounded-xl border border-input bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recording">تسجيل لقاء مباشر (Zoom Replay)</SelectItem>
                  <SelectItem value="lesson">درس مسجل مسبقاً (Pre-recorded)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ربط اختياري بلقاء Zoom */}
          {filteredMeetings.length > 0 && (
            <div className="space-y-1.5 p-3 rounded-xl bg-muted/30 border border-border/60">
              <label htmlFor="video-modal-meeting" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-primary" />
                <span>ربط بلقاء Zoom سابق (اختياري)</span>
              </label>
              <Select dir="rtl" value={zoomMeetingId} onValueChange={setZoomMeetingId} disabled={isSubmitting}>
                <SelectTrigger id="video-modal-meeting" className="h-9 w-full rounded-lg border border-input bg-background text-xs">
                  <SelectValue placeholder="بدون ربط بلقاء زووم محدد" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">-- بدون ربط بلقاء زووم محدد --</SelectItem>
                  {filteredMeetings.map((m) => (
                    <SelectItem key={m.id} value={String(m.id)}>
                      {m.title} ({new Date(m.starts_at).toLocaleDateString("ar")})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* MODE 1: FILE DRAG & DROP DROPZONE */}
          {mode === "upload" && !editingAsset ? (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <FileVideo className="w-3.5 h-3.5 text-emerald-600" />
                <span>ملف الفيديو (.mp4, .webm, .mov) *</span>
              </label>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isSubmitting && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-emerald-500 bg-emerald-500/10 scale-[1.01]"
                    : selectedFile
                    ? "border-emerald-500/50 bg-emerald-500/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/30"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*,.mp4,.webm,.mov"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelected(e.target.files[0]);
                    }
                  }}
                  disabled={isSubmitting}
                />

                {selectedFile ? (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
                      <FileVideo className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-foreground max-w-sm truncate">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                      الحجم: {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                    </p>
                    <span className="text-[11px] text-emerald-600 font-medium mt-1">
                      اضغط لاختيار ملف آخر إن أردت
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-2xl bg-muted text-muted-foreground flex items-center justify-center mb-2">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      اسحب وأفلت ملف الفيديو هنا، أو اضغط للاختيار من جهازك
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      يدعم ملفات MP4 و WebM الكبيرة. يتم الرفع بتقنية التقطيع (Chunking) بأمان تام.
                    </p>
                  </div>
                )}
              </div>

              {/* Progress Bar during Chunked Upload */}
              {isSubmitting && (
                <div className="space-y-1.5 p-3 rounded-xl bg-muted/40 border border-border">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-foreground">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                      <span>جارٍ رفع الفيديو على مراحل إلى السيرفر...</span>
                    </span>
                    <span className="font-mono text-emerald-600">{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* MODE 2: MANUAL YOUTUBE LINK / ID */
            <div className="space-y-1.5">
              <label htmlFor="video-modal-id-input" className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>رابط الفيديو على YouTube أو المعرف (ID) *</span>
                </span>
                {extractedId ? (
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> تم التعرف على المعرف ({extractedId})
                  </span>
                ) : rawVideoInput.trim() ? (
                  <span className="text-[11px] text-amber-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> تأكد من صحة الرابط أو الـ ID
                  </span>
                ) : null}
              </label>
              <input
                id="video-modal-id-input"
                value={rawVideoInput}
                onChange={(e) => setRawVideoInput(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... أو dQw4w9WgXcQ"
                dir="ltr"
                disabled={isSubmitting}
                className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />

              {extractedId && (
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-card border border-border mt-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://img.youtube.com/vi/${extractedId}/mqdefault.jpg`}
                    alt="معاينة الفيديو"
                    className="w-24 h-14 object-cover rounded-lg shrink-0 border border-border"
                  />
                  <div className="text-xs min-w-0">
                    <p className="font-semibold text-foreground truncate">معاينة غلاف الفيديو الجاهز</p>
                    <p className="text-[11px] text-muted-foreground font-mono mt-0.5">ID: {extractedId}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* عنوان الفيديو */}
          <div className="space-y-1.5">
            <label htmlFor="video-modal-title-input" className="text-xs font-semibold text-foreground">
              عنوان الفيديو أو المحاضرة *
            </label>
            <input
              id="video-modal-title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: تسجيل الجلسة الأولى - أساسيات React"
              disabled={isSubmitting}
              className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* المدة والوصف (في الوضع اليدوي فقط) */}
          {mode === "manual" && (
            <div className="space-y-1.5">
              <label htmlFor="video-modal-duration" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                <span>مدة الفيديو التقريبية (بالدقائق)</span>
              </label>
              <input
                id="video-modal-duration"
                type="number"
                min={0}
                max={1440}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                disabled={isSubmitting}
                className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="video-modal-desc" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-muted-foreground" />
              <span>وصف محتوى التسجيل (اختياري)</span>
            </label>
            <textarea
              id="video-modal-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب النقاط الرئيسية التي تم شرحها في هذا التسجيل..."
              disabled={isSubmitting}
              className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
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
              disabled={isSubmitting || (mode === "upload" && !ytStatus?.connected)}
              className="rounded-xl h-10 px-5 gap-2 min-w-[120px] bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{mode === "upload" ? `جارٍ الرفع (${uploadProgress}%)` : "جارٍ الحفظ..."}</span>
                </>
              ) : (
                <span>
                  {editingAsset ? "حفظ التعديلات" : mode === "upload" ? "بدء الرفع على مراحل" : "إدراج الفيديو"}
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
