"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Users,
  Video,
  Film,
  Calendar,
  Clock,
  ExternalLink,
  AlertTriangle,
  Play,
  CheckCircle2,
  Radio,
  Unlink,
} from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import ZoomMeetingModal from "./ZoomMeetingModal";
import VideoAssetModal from "./VideoAssetModal";
import {
  adminZoomQueries,
  adminVideoAssetQueries,
  adminCourseQueries,
  adminYouTubeQueries,
} from "@/features/admin-courses/queries/adminCourses.queries";
import {
  useZoomMeetingMutations,
  useVideoAssetMutations,
} from "@/features/admin-courses/queries/adminCourses.mutations";
import {
  getYouTubeAuthUrl,
  sendYouTubeCallback,
  disconnectYouTube,
} from "@/features/admin-courses/api";
import type {
  AdminZoomMeeting,
  AdminVideoAsset,
  ZoomMeetingFormData,
  VideoAssetFormData,
} from "@/features/admin-courses/types";

interface Attendance {
  id: number;
  attended_at: string;
  user: { id: number; name: string; email: string };
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("ar", { dateStyle: "medium", timeStyle: "short" });

export default function ManageZoomTab() {
  const queryClient = useQueryClient();

  // Queries via TanStack Query v5
  const { data: rawMeetings = [], isLoading: meetingsLoading } = useQuery(adminZoomQueries.list());
  const { data: rawVideos = [], isLoading: videosLoading } = useQuery(adminVideoAssetQueries.list());
  const { data: rawCourses = [], isLoading: coursesLoading } = useQuery(adminCourseQueries.list());
  const { data: youtubeStatus, isLoading: youtubeLoading } = useQuery(adminYouTubeQueries.status());

  const [isConnectingYouTube, setIsConnectingYouTube] = useState(false);
  const [youtubeAlert, setYoutubeAlert] = useState<{ message: string; success: boolean } | null>(null);

  // Check for Google OAuth callback in URL
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const state = params.get("state");
    const isYtCallback =
      params.get("youtube_callback") ||
      state === "youtube_callback" ||
      Boolean(state?.startsWith("yt_"));

    if (code && isYtCallback) {
      setIsConnectingYouTube(true);
      sendYouTubeCallback(code, state)
        .then((res) => {
          setYoutubeAlert({
            message: `تم ربط القناة بنجاح (${res.channel_title}). يمكنك الآن إنشاء Playlists ورفع الفيديوهات آلياً!`,
            success: true,
          });
          void queryClient.invalidateQueries({ queryKey: adminYouTubeQueries.all() });
          // Clean the query params from the URL without reload
          window.history.replaceState({}, "", "/admin?tab=zoom");
        })
        .catch((err: unknown) => {
          const e = err as { response?: { data?: { message?: string } } };
          setYoutubeAlert({
            message: e.response?.data?.message || "فشل إكمال ربط قناة YouTube مع Google.",
            success: false,
          });
        })
        .finally(() => {
          setIsConnectingYouTube(false);
        });
    }
  }, [queryClient]);

  const handleConnectYouTube = async () => {
    setIsConnectingYouTube(true);
    try {
      const { url } = await getYouTubeAuthUrl();
      if (url) {
        window.location.href = url;
      }
    } catch {
      setYoutubeAlert({ message: "تعذر توليد رابط المصادقة من Google.", success: false });
      setIsConnectingYouTube(false);
    }
  };

  const handleDisconnectYouTube = async () => {
    if (!confirm("هل أنت متأكد من رغبتك في فصل قناة YouTube عن المنصة؟")) return;
    try {
      await disconnectYouTube();
      void queryClient.invalidateQueries({ queryKey: adminYouTubeQueries.all() });
      setYoutubeAlert({ message: "تم فصل قناة YouTube عن المنصة.", success: true });
    } catch {
      setYoutubeAlert({ message: "تعذر فصل القناة.", success: false });
    }
  };

  const meetings = Array.isArray(rawMeetings) ? rawMeetings : [];
  const videos = Array.isArray(rawVideos) ? rawVideos : [];
  const courses = Array.isArray(rawCourses)
    ? rawCourses.map((c) => ({ id: c.id, title: c.title }))
    : [];

  // Mutations
  const { createMeeting, updateMeeting, deleteMeeting } = useZoomMeetingMutations();
  const { createAsset, updateAsset, deleteAsset } = useVideoAssetMutations();

  // Modals state
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<AdminZoomMeeting | null>(null);

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<AdminVideoAsset | null>(null);

  // Accessible Delete confirmation dialog state
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "meeting" | "video";
    id: number;
    title: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const isDeletingRef = useRef(false);

  // Attendees drawer state
  const [openMeetingId, setOpenMeetingId] = useState<number | null>(null);
  const [attendees, setAttendees] = useState<Attendance[]>([]);
  const [loadingAtt, setLoadingAtt] = useState(false);

  const toggleAttendees = async (id: number) => {
    if (openMeetingId === id) return setOpenMeetingId(null);
    setOpenMeetingId(id);
    setLoadingAtt(true);
    try {
      const res = await api.get(`/admin/zoom-meetings/${id}/attendances`);
      setAttendees(res.data?.data ?? res.data ?? []);
    } catch {
      setAttendees([]);
    } finally {
      setLoadingAtt(false);
    }
  };

  // Save Handlers
  const handleSaveMeeting = async (data: ZoomMeetingFormData) => {
    if (editingMeeting) {
      await updateMeeting.mutateAsync({ id: editingMeeting.id, data });
    } else {
      await createMeeting.mutateAsync(data);
    }
  };

  const handleSaveVideo = async (data: VideoAssetFormData) => {
    if (editingVideo) {
      await updateAsset.mutateAsync({ id: editingVideo.id, data });
    } else {
      await createAsset.mutateAsync(data);
    }
  };

  // Delete Handler with Concurrency Lock
  const handleConfirmDelete = async () => {
    if (isDeletingRef.current || !deleteTarget) return;

    isDeletingRef.current = true;
    setIsDeleting(true);
    try {
      if (deleteTarget.type === "meeting") {
        await deleteMeeting.mutateAsync(deleteTarget.id);
        if (openMeetingId === deleteTarget.id) setOpenMeetingId(null);
      } else {
        await deleteAsset.mutateAsync(deleteTarget.id);
      }
      setDeleteTarget(null);
    } catch (e) {
      console.error("فشل الحذف:", e);
    } finally {
      isDeletingRef.current = false;
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ─── 1. Top Action Header ───────────────────────────── */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Video className="w-5 h-5 text-primary" />
            <span>إدارة اللقاءات والتسجيلات</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            جدولة لقاءات Zoom الحية وإدارة تسجيلات الفيديوهات المرفوعة وربطها بالكورسات
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* زر لقاء زووم */}
          <Button
            type="button"
            onClick={() => {
              setEditingMeeting(null);
              setIsZoomModalOpen(true);
            }}
            disabled={coursesLoading}
            className="rounded-xl h-10 px-4 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ إضافة لقاء Zoom</span>
          </Button>

          {/* زر رفع/إدراج فيديو */}
          <Button
            type="button"
            onClick={() => {
              setEditingVideo(null);
              setIsVideoModalOpen(true);
            }}
            disabled={coursesLoading}
            className="rounded-xl h-10 px-4 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Film className="w-4 h-4" />
            <span>+ رفع / إدراج فيديو</span>
          </Button>
        </div>
      </div>

      {/* ─── YouTube Channel Integration Banner ─────────────── */}
      {youtubeAlert && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-medium animate-in fade-in-0 ${
            youtubeAlert.success
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : "bg-destructive/10 border-destructive/20 text-destructive"
          }`}
        >
          <span>{youtubeAlert.message}</span>
          <button
            type="button"
            onClick={() => setYoutubeAlert(null)}
            className="text-xs opacity-70 hover:opacity-100"
          >
            ×
          </button>
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center shrink-0">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">ربط قناة YouTube الرسمية</span>
              {youtubeStatus?.connected ? (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> متصلة: {youtubeStatus.channel_title}
                </span>
              ) : (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-semibold">
                  غير متصلة
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {youtubeStatus?.connected
                ? "يتم إنشاء قوائم التشغيل (Playlists) ورفع الفيديوهات غير المدرجة (Unlisted) إلى هذه القناة تلقائياً."
                : "اربط قناتك على YouTube لتفعيل إنشاء Playlists تلقائية باسم الكورس ورفع الفيديوهات عبر المنصة."}
            </p>
          </div>
        </div>

        <div className="shrink-0">
          {youtubeStatus?.connected ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDisconnectYouTube}
              className="rounded-xl h-9 text-xs text-muted-foreground hover:text-destructive gap-1.5"
            >
              <Unlink className="w-3.5 h-3.5" />
              <span>فصل القناة</span>
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              onClick={handleConnectYouTube}
              disabled={isConnectingYouTube || youtubeLoading}
              className="rounded-xl h-9 text-xs bg-red-600 hover:bg-red-700 text-white gap-1.5 shadow-xs"
            >
              {isConnectingYouTube ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>جارٍ الاتصال بـ Google...</span>
                </>
              ) : (
                <>
                  <Radio className="w-3.5 h-3.5" />
                  <span>ربط قناة YouTube الآن</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* ─── 2. Top Section: Live Zoom Meetings (Blue Accent) ─── */}
      <section aria-labelledby="live-meetings-heading" className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
            <h2 id="live-meetings-heading" className="text-sm font-bold text-foreground">
              لقاءات Zoom الحية والمجدولة
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono font-medium">
              {meetings.length}
            </span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          {meetingsLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground text-xs">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span>جارٍ تحميل لقاءات Zoom...</span>
            </div>
          ) : meetings.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                <Video className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-foreground">لا توجد لقاءات مجدولة حالياً</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                يمكنك الضغط على زر &quot;إضافة لقاء Zoom&quot; بالأعلى لجدولة موعد جلسة حية لطلابك.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {meetings.map((m) => {
                const courseName = m.course?.title || m.course_name || "كورس غير محدد";
                return (
                  <div key={m.id} className="p-4 transition-colors hover:bg-muted/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Left: Info */}
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                          <Video className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-bold text-foreground truncate">{m.title}</h3>
                            <span className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium">
                              {courseName}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{fmt(m.starts_at)}</span>
                            </span>
                            {m.duration_minutes ? (
                              <span className="flex items-center gap-1 font-mono">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{m.duration_minutes} دقيقة</span>
                              </span>
                            ) : null}
                          </div>
                          {m.description && (
                            <p className="text-xs text-muted-foreground/80 mt-1 line-clamp-1">
                              {m.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <a
                          href={m.zoom_link}
                          target="_blank"
                          rel="noreferrer"
                          className="h-8 px-2.5 rounded-lg border border-border bg-background hover:bg-muted text-xs text-foreground font-medium flex items-center gap-1.5 transition-colors"
                        >
                          <span className="font-mono" dir="ltr">Zoom</span>
                          <ExternalLink className="w-3 h-3 text-muted-foreground" />
                        </a>

                        <button
                          type="button"
                          onClick={() => toggleAttendees(m.id)}
                          className="h-8 px-2.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-xs font-medium flex items-center gap-1.5 transition-colors"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>{m.attendances_count ?? 0}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingMeeting(m);
                            setIsZoomModalOpen(true);
                          }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          aria-label="تعديل اللقاء"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setDeleteTarget({
                              type: "meeting",
                              id: m.id,
                              title: m.title,
                            })
                          }
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors"
                          aria-label="حذف اللقاء"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Attendees Accordion */}
                    {openMeetingId === m.id && (
                      <div className="mt-3 bg-muted/30 rounded-xl p-3 border border-border/50 text-xs">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-foreground">قائمة حضور الطلاب ({attendees.length})</span>
                        </div>
                        {loadingAtt ? (
                          <div className="flex items-center justify-center py-4 text-muted-foreground gap-2">
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>جارٍ جلب سجلات الحضور...</span>
                          </div>
                        ) : attendees.length === 0 ? (
                          <p className="text-muted-foreground py-2 text-center">لم يسجل أي طالب حضوره في هذا اللقاء بعد</p>
                        ) : (
                          <ul className="space-y-1.5 max-h-40 overflow-y-auto">
                            {attendees.map((a) => (
                              <li key={a.id} className="flex items-center justify-between p-1.5 rounded-lg bg-background/50">
                                <span className="text-foreground font-medium">
                                  {a.user.name} <span className="text-muted-foreground font-normal">({a.user.email})</span>
                                </span>
                                <span className="text-[11px] text-muted-foreground font-mono">{fmt(a.attended_at)}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ─── 3. Bottom Section: Video Assets Bank (Emerald Accent) ─── */}
      <section aria-labelledby="video-bank-heading" className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h2 id="video-bank-heading" className="text-sm font-bold text-foreground">
              مكتبة الفيديوهات والتسجيلات المرفوعة
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-medium">
              {videos.length}
            </span>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          {videosLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground text-xs">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
              <span>جارٍ تحميل الفيديوهات المسجلة...</span>
            </div>
          ) : videos.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <Film className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-foreground">لا توجد تسجيلات أو فيديوهات مرفوعة بعد</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                اضغط على زر &quot;رفع / إدراج فيديو&quot; بالأعلى لإضافة رابط فيديو من يوتيوب أو تسجيل Zoom ليتاح للاستخدام في الكورسات.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {videos.map((v) => {
                const courseName = v.course?.title || "كورس غير محدد";
                const durationMin = Math.round(v.duration_seconds / 60);
                return (
                  <div key={v.id} className="p-4 transition-colors hover:bg-muted/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Left: Thumbnail & Details */}
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <div className="relative w-16 h-10 rounded-lg overflow-hidden shrink-0 border border-border bg-black/40">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`https://img.youtube.com/vi/${v.provider_video_id}/mqdefault.jpg`}
                            alt={v.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback on invalid image
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <Play className="w-3.5 h-3.5 text-white/80" />
                          </div>
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-bold text-foreground truncate">{v.title}</h3>
                            <span className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium">
                              {courseName}
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                                v.type === "recording"
                                  ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                                  : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                              }`}
                            >
                              {v.type === "recording" ? "تسجيل Zoom" : "درس مسجل"}
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                            <span className="flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3" />
                              <span>{durationMin > 0 ? `${durationMin} دقيقة` : "غير محدد"}</span>
                            </span>
                            <span className="text-[11px] font-mono text-muted-foreground/80" dir="ltr">
                              ID: {v.provider_video_id}
                            </span>
                            {v.zoom_meeting && (
                              <span className="text-[11px] text-primary flex items-center gap-1">
                                <Video className="w-3 h-3" />
                                <span>مرتبط بـ: {v.zoom_meeting.title}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <a
                          href={`https://www.youtube.com/watch?v=${v.provider_video_id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="h-8 px-2.5 rounded-lg border border-border bg-background hover:bg-muted text-xs text-foreground font-medium flex items-center gap-1.5 transition-colors"
                        >
                          <span>معاينة</span>
                          <ExternalLink className="w-3 h-3 text-muted-foreground" />
                        </a>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingVideo(v);
                            setIsVideoModalOpen(true);
                          }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                          aria-label="تعديل الفيديو"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setDeleteTarget({
                              type: "video",
                              id: v.id,
                              title: v.title,
                            })
                          }
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors"
                          aria-label="حذف الفيديو"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ─── 4. Modals ──────────────────────────────────────── */}
      <ZoomMeetingModal
        open={isZoomModalOpen}
        onClose={() => {
          setIsZoomModalOpen(false);
          setEditingMeeting(null);
        }}
        editingMeeting={editingMeeting}
        courses={courses}
        onSave={handleSaveMeeting}
      />

      <VideoAssetModal
        open={isVideoModalOpen}
        onClose={() => {
          setIsVideoModalOpen(false);
          setEditingVideo(null);
        }}
        editingAsset={editingVideo}
        courses={courses}
        meetings={meetings}
        onSave={handleSaveVideo}
      />

      {/* ─── 5. Accessible Delete Confirmation Dialog ───────── */}
      {deleteTarget && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
        >
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in-0 zoom-in-95 motion-reduce:animate-none text-center">
            <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 id="delete-dialog-title" className="text-base font-bold text-foreground">
              تأكيد عملية الحذف
            </h3>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              هل أنت متأكد من رغبتك في حذف{" "}
              <strong className="text-foreground">{deleteTarget.title}</strong>؟
              {deleteTarget.type === "meeting"
                ? " سيتم حذف اللقاء وسجلات حضور الطلاب التابعة له بشكل نهائي."
                : " سيتم حذف هذا الفيديو من بنك الوسائط."}
            </p>

            <div className="mt-5 flex items-center justify-center gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="rounded-xl h-10 px-4 flex-1"
              >
                إلغاء
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="rounded-xl h-10 px-4 flex-1 gap-1.5"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>نعم، احذف</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
