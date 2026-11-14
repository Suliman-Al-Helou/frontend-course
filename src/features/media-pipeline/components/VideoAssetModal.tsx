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
  Ban,
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
import { notify } from "@/components/ui/sonner";
import { uploadVideoChunk, getYouTubeAuthUrl } from "../api";
import { mediaPipelineQueries, mediaPipelineKeys } from "../queries/mediaPipeline.queries";
import type { AdminVideoAsset, VideoAssetFormData, AdminZoomMeeting } from "../types";

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
  const { data: ytStatus } = useQuery(mediaPipelineQueries.youtubeStatus());

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
  const [isConnectingYouTube, setIsConnectingYouTube] = useState(false);

  // Concurrency & Cancellation Locks
  const isSubmittingRef = useRef(false);
  const isCancelledRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractedId = extractYouTubeVideoId(rawVideoInput.trim());

  useEffect(() => {
    if (!open) return;

    if (editingAsset) {
      setMode("manual");
      setCourseId(String(editingAsset.course_id));
      setZoomMeetingId(
        editingAsset.zoom_meeting_id ? String(editingAsset.zoom_meeting_id) : "none",
      );
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
    setIsConnectingYouTube(false);
    isCancelledRef.current = false;
  }, [open, editingAsset, courses]);

  // Connect to YouTube OAuth
  const handleConnectYouTube = async () => {
    if (isConnectingYouTube) return;
    setIsConnectingYouTube(true);
    try {
      const { url } = await getYouTubeAuthUrl();
      if (url) {
        window.location.href = url;
      }
    } catch {
      setError("تعذر توليد رابط مصادقة Google لربط قناة YouTube.");
      setIsConnectingYouTube(false);
    }
  };

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
    if (!file.type.startsWith("video/") && !/\.(mp4|webm|mov|mkv)$/i.test(file.name)) {
      setError("صيغة الملف غير مدعومة. يرجى اختيار ملف فيديو صالح (.mp4, .webm, .mov).");
      return;
    }
    if (file.size === 0) {
      setError("ملف الفيديو المحدد فارغ.");
      return;
    }

    setError(null);
    setSelectedFile(file);
    if (!title.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      setTitle(cleanName);
    }
  };

  // Cancel in-flight chunked upload
  const handleCancelUpload = () => {
    if (!isSubmittingRef.current) return;
    isCancelledRef.current = true;
    isSubmittingRef.current = false;
    setIsSubmitting(false);
    setUploadProgress(0);
    notify.error("تم إلغاء عملية رفع الفيديو بطلب منك.");
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
        setError("قناة YouTube غير مربوطة بعد. يرجى ربط القناة أولاً لتفعيل رفع الفيديوهات.");
        return;
      }

      if (!selectedFile) {
        setError("الرجاء اختيار ملف فيديو للرفع (.mp4 أو .webm)");
        return;
      }

      isSubmittingRef.current = true;
      isCancelledRef.current = false;
      setIsSubmitting(true);
      setError(null);
      setUploadProgress(1);

      try {
        const chunkSize = 5 * 1024 * 1024; // 5 MB per chunk
        const totalChunks = Math.ceil(selectedFile.size / chunkSize);
        const uploadId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

        for (let i = 0; i < totalChunks; i++) {
          if (isCancelledRef.current) {
            return;
          }

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

          if (isCancelledRef.current) return;

          setUploadProgress(result.progress);
        }

        void queryClient.invalidateQueries({ queryKey: mediaPipelineKeys.videoAssets() });
        notify.success(
          "تم استلام الفيديو بنجاح، وجاري الآن رفعه ومعالجته على قناتك في YouTube بالخلفية.",
        );
        onClose();
      } catch (err: unknown) {
        if (!isCancelledRef.current) {
          const e = err as { response?: { data?: { message?: string } } };
          setError(
            e.response?.data?.message || "فشل رفع الفيديو على مراحل. تحقق من الاتصال بالإنترنت.",
          );
        }
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

  const totalFileSizeMb = selectedFile ? (selectedFile.size / (1024 * 1024)).toFixed(1) : "0";
  const uploadedBytes = selectedFile
    ? Math.min((uploadProgress / 100) * selectedFile.size, selectedFile.size)
    : 0;
  const uploadedMb = (uploadedBytes / (1024 * 1024)).toFixed(1);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="إغلاق النافذة"
        className="fixed inset-0 bg-background/80 backdrop-blur-sm cursor-default"
        onClick={isSubmitting ? undefined : onClose}
      />
      <div className="relative z-10 bg-card border border-border rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 motion-reduce:animate-none">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0 bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="video-modal-title" className="text-base font-bold text-foreground">
                  {editingAsset ? "تعديل الفيديو" : "رفع وإدراج وسائط الفيديو"}
                </h2>
                {ytStatus?.connected ? (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> متصل بـ YouTube
                  </span>
                ) : (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold">
                    غير متصل
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {ytStatus?.connected
                  ? `القناة: ${ytStatus.channel_title}`
                  : "رفع ملفات الفيديو إلى YouTube أو إدراج روابط مباشرة"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-10 w-10 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:opacity-50"
            aria-label="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        {!editingAsset && (
          <div className="px-6 pt-3 shrink-0 flex items-center gap-2 border-b border-border bg-muted/20 pb-3">
            <button
              type="button"
              onClick={() => setMode("upload")}
              disabled={isSubmitting}
              className={`h-10 text-xs font-semibold px-4 rounded-xl flex items-center gap-2 transition-all ${
                mode === "upload"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>رفع ملف فيديو من الجهاز</span>
            </button>

            <button
              type="button"
              onClick={() => setMode("manual")}
              disabled={isSubmitting}
              className={`h-10 text-xs font-semibold px-4 rounded-xl flex items-center gap-2 transition-all ${
                mode === "manual"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <LinkIcon className="w-4 h-4" />
              <span>إدخال رابط / معرّف YouTube</span>
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div
              role="alert"
              aria-live="polite"
              className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {mode === "upload" && !ytStatus?.connected && (
            <div
              role="alert"
              aria-live="polite"
              className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-foreground text-xs space-y-3"
            >
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                <div className="space-y-1">
                  <p className="font-bold text-amber-900 dark:text-amber-200">
                    قناة YouTube غير مربوطة بالمنصة بعد
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    يتطلب رفع ملفات الفيديو من جهازك اتصالاً بقناة YouTube معتمدة لإنشاء قوائم التشغيل
                    التلقائية وحفظ الفيديوهات غير المدرجة (Unlisted).
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Button
                  type="button"
                  size="sm"
                  onClick={handleConnectYouTube}
                  disabled={isConnectingYouTube || isSubmitting}
                  className="h-10 px-4 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white gap-2 shadow-xs"
                >
                  {isConnectingYouTube ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جارٍ الاتصال بـ Google...</span>
                    </>
                  ) : (
                    <span>ربط قناة YouTube الآن</span>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setMode("manual")}
                  className="h-10 px-4 rounded-xl text-xs"
                >
                  إدخال رابط يوتيوب يدوياً
                </Button>
              </div>
            </div>
          )}

          {/* الكورس والنوع */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label htmlFor="video-modal-course" className="text-xs font-semibold text-foreground">
                الكورس المرتبط *
              </label>
              <Select
                dir="rtl"
                value={courseId}
                onValueChange={(v) => {
                  setCourseId(v);
                  setZoomMeetingId("none");
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger
                  id="video-modal-course"
                  className="h-10 w-full rounded-xl border border-input bg-background"
                >
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
              <Select
                dir="rtl"
                value={type}
                onValueChange={(v: "recording" | "lesson") => setType(v)}
                disabled={isSubmitting}
              >
                <SelectTrigger
                  id="video-modal-type"
                  className="h-10 w-full rounded-xl border border-input bg-background"
                >
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
              <label
                htmlFor="video-modal-meeting"
                className="text-xs font-semibold text-foreground flex items-center gap-1.5"
              >
                <Video className="w-3.5 h-3.5 text-primary" />
                <span>ربط بلقاء Zoom سابق (اختياري)</span>
              </label>
              <Select
                dir="rtl"
                value={zoomMeetingId}
                onValueChange={setZoomMeetingId}
                disabled={isSubmitting}
              >
                <SelectTrigger
                  id="video-modal-meeting"
                  className="h-10 w-full rounded-xl border border-input bg-background text-xs"
                >
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
                <FileVideo className="w-3.5 h-3.5 text-primary" />
                <span>ملف الفيديو (.mp4, .webm, .mov) *</span>
              </label>

              <div
                role="button"
                tabIndex={isSubmitting ? -1 : 0}
                aria-label="منطقة اختيار ملف الفيديو. اسحب الملف هنا أو اضغط للاختيار من جهازك"
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === " ") && !isSubmitting) {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !isSubmitting && fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isDragging
                    ? "border-primary bg-primary/10 scale-[1.01]"
                    : selectedFile
                      ? "border-primary/50 bg-primary/5"
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
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-2">
                      <FileVideo className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-foreground max-w-sm truncate">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                      الحجم الإجمالي: {totalFileSizeMb} MB
                    </p>
                    <span className="text-[11px] text-primary font-medium mt-1">
                      اضغط أو اضغط Enter لاختيار ملف آخر إن أردت
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

              {/* Progress Bar & Abort Control */}
              {isSubmitting && (
                <div className="space-y-2 p-3.5 rounded-xl bg-muted/40 border border-border">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-foreground">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                      <span>
                        جارٍ رفع الحزم: {uploadedMb} MB من أصل {totalFileSizeMb} MB
                      </span>
                    </span>
                    <span className="font-mono text-primary font-bold">{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300 motion-reduce:transition-none rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-end pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCancelUpload}
                      className="h-8 text-xs text-destructive hover:bg-destructive/10 border-destructive/30 gap-1.5"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>إلغاء عملية الرفع</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* MODE 2: DIRECT YOUTUBE LINK / ID */
            <div className="space-y-1.5">
              <label
                htmlFor="video-modal-yt-input"
                className="text-xs font-semibold text-foreground flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>رابط الفيديو أو معرف YouTube (11 خانة) *</span>
                </span>
                {extractedId && (
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> تم استخراج المعرّف: {extractedId}
                  </span>
                )}
              </label>
              <input
                id="video-modal-yt-input"
                dir="ltr"
                value={rawVideoInput}
                onChange={(e) => setRawVideoInput(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... أو معرّف مباشر"
                disabled={isSubmitting}
                className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-left font-mono"
              />
            </div>
          )}

          {/* عنوان الفيديو */}
          <div className="space-y-1.5">
            <label
              htmlFor="video-modal-title-field"
              className="text-xs font-semibold text-foreground"
            >
              عنوان الفيديو *
            </label>
            <input
              id="video-modal-title-field"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: تسجيل الجلسة الأولى - مقدمة في هندسة البيانات"
              disabled={isSubmitting}
              className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* المدة المقدرة */}
          <div className="space-y-1.5">
            <label
              htmlFor="video-modal-duration-field"
              className="text-xs font-semibold text-foreground flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <span>المدة التقريبية (بالدقائق)</span>
            </label>
            <input
              id="video-modal-duration-field"
              type="number"
              min={1}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              disabled={isSubmitting}
              className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* الوصف */}
          <div className="space-y-1.5">
            <label
              htmlFor="video-modal-desc-field"
              className="text-xs font-semibold text-foreground flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-muted-foreground" />
              <span>وصف أو محاور الفيديو (اختياري)</span>
            </label>
            <textarea
              id="video-modal-desc-field"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب نبذة عن محتوى هذا الفيديو والروابط المرفقة..."
              disabled={isSubmitting}
              className="w-full rounded-xl border border-input bg-background p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
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
              className="rounded-xl h-10 px-5 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
            >
              {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>
                {isSubmitting
                  ? "جارٍ الرفع والحفظ..."
                  : editingAsset
                    ? "حفظ التعديلات"
                    : mode === "upload"
                      ? "بدء الرفع الآمن"
                      : "إدراج الفيديو"}
              </span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
