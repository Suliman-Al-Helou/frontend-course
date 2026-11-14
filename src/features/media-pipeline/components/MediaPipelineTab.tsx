"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Video, Film, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { notify } from "@/components/ui/sonner";
import ConfirmModal from "@/components/shared/ConfirmModal";
import ZoomMeetingModal from "./ZoomMeetingModal";
import VideoAssetModal from "./VideoAssetModal";
import LiveMeetingsView from "./LiveMeetingsView";
import VideoAssetsView from "./VideoAssetsView";
import { mediaPipelineQueries, mediaPipelineKeys } from "../queries/mediaPipeline.queries";
import {
  useZoomMeetingMutations,
  useVideoAssetMutations,
} from "../queries/mediaPipeline.mutations";
import { getYouTubeAuthUrl, sendYouTubeCallback, disconnectYouTube } from "../api";
import { adminCourseQueries } from "@/features/admin-courses/queries/adminCourses.queries";
import type {
  AdminZoomMeeting,
  AdminVideoAsset,
  ZoomMeetingFormData,
  VideoAssetFormData,
} from "../types";

export default function MediaPipelineTab() {
  const queryClient = useQueryClient();

  // Active Sub-view: "meetings" (Zoom) vs "videos" (Video Bank)
  const [activeSubTab, setActiveSubTab] = useState<"meetings" | "videos">("meetings");

  // Filter for video assets by course
  const [selectedCourseId, setSelectedCourseId] = useState<string>("all");

  // TanStack Queries
  const { data: rawMeetings = [], isLoading: meetingsLoading } = useQuery(
    mediaPipelineQueries.zoomMeetings(),
  );
  const { data: rawVideos = [], isLoading: videosLoading } = useQuery(
    mediaPipelineQueries.videoAssets(),
  );
  const { data: rawCourses = [], isLoading: coursesLoading } = useQuery(adminCourseQueries.list());
  const { data: youtubeStatus } = useQuery(mediaPipelineQueries.youtubeStatus());

  // Mutations
  const { createMeeting, updateMeeting, deleteMeeting } = useZoomMeetingMutations();
  const { createAsset, updateAsset, deleteAsset } = useVideoAssetMutations();

  // Modals state
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<AdminZoomMeeting | null>(null);

  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<AdminVideoAsset | null>(null);

  // Deletion confirm modal state
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "meeting" | "video" | "youtube_disconnect";
    id: number;
    title: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const isDeletingRef = useRef(false);

  // YouTube OAuth handling
  const [isConnectingYouTube, setIsConnectingYouTube] = useState(false);
  const isConnectingRef = useRef(false);
  const callbackProcessedRef = useRef(false);

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
      if (callbackProcessedRef.current) return;
      callbackProcessedRef.current = true;
      window.history.replaceState({}, "", "/admin?tab=zoom");
      setActiveSubTab("videos");

      setIsConnectingYouTube(true);
      sendYouTubeCallback(code, state)
        .then((res) => {
          notify.success(
            `تم ربط القناة بنجاح (${res.channel_title}). يمكنك الآن إنشاء Playlists ورفع الفيديوهات آلياً!`,
          );
          void queryClient.invalidateQueries({ queryKey: mediaPipelineKeys.youtube() });
        })
        .catch((err: unknown) => {
          const e = err as { response?: { data?: { message?: string } } };
          notify.error(e.response?.data?.message || "فشل إكمال ربط قناة YouTube مع Google.");
        })
        .finally(() => {
          setIsConnectingYouTube(false);
        });
    }
  }, [queryClient]);

  const handleConnectYouTube = async () => {
    if (isConnectingRef.current || isConnectingYouTube) return;
    isConnectingRef.current = true;
    setIsConnectingYouTube(true);
    try {
      const { url } = await getYouTubeAuthUrl();
      if (url) {
        window.location.href = url;
      }
    } catch {
      notify.error("تعذر توليد رابط المصادقة من Google.");
      setIsConnectingYouTube(false);
      isConnectingRef.current = false;
    }
  };

  const handleDisconnectYouTube = () => {
    setDeleteTarget({
      type: "youtube_disconnect",
      id: 0,
      title: "قناة YouTube الرسمية",
    });
  };

  // Form Save Handlers
  const handleSaveMeeting = async (data: ZoomMeetingFormData) => {
    try {
      if (editingMeeting) {
        await updateMeeting.mutateAsync({ id: editingMeeting.id, data });
        notify.success("تم تحديث بيانات اللقاء بنجاح");
      } else {
        await createMeeting.mutateAsync(data);
        notify.success("تم إنشاء لقاء Zoom الجديد بنجاح");
      }
    } catch {
      notify.error("حدث خطأ أثناء حفظ اللقاء.");
    }
  };

  const handleSaveVideo = async (data: VideoAssetFormData) => {
    try {
      if (editingVideo) {
        await updateAsset.mutateAsync({ id: editingVideo.id, data });
        notify.success("تم تحديث بيانات الفيديو بنجاح");
      } else {
        await createAsset.mutateAsync(data);
        notify.success("تم إدراج الفيديو في بنك الوسائط بنجاح");
      }
    } catch {
      notify.error("حدث خطأ أثناء حفظ الفيديو.");
    }
  };

  // Confirm Delete Handler with concurrency lock
  const handleConfirmDelete = async () => {
    if (isDeletingRef.current || !deleteTarget) return;

    isDeletingRef.current = true;
    setIsDeleting(true);
    try {
      if (deleteTarget.type === "meeting") {
        await deleteMeeting.mutateAsync(deleteTarget.id);
        notify.success("تم حذف اللقاء بنجاح");
      } else if (deleteTarget.type === "video") {
        await deleteAsset.mutateAsync(deleteTarget.id);
        notify.success("تم حذف الفيديو من بنك الوسائط بنجاح");
      } else if (deleteTarget.type === "youtube_disconnect") {
        await disconnectYouTube();
        void queryClient.invalidateQueries({ queryKey: mediaPipelineKeys.youtube() });
        notify.success("تم فصل قناة YouTube عن المنصة بنجاح");
      }
      setDeleteTarget(null);
    } catch (e) {
      console.error("فشل الإجراء:", e);
      notify.error(
        deleteTarget.type === "youtube_disconnect" ? "تعذر فصل القناة." : "فشل إتمام عملية الحذف.",
      );
    } finally {
      isDeletingRef.current = false;
      setIsDeleting(false);
    }
  };

  const meetings = Array.isArray(rawMeetings) ? rawMeetings : [];
  const videos = Array.isArray(rawVideos) ? rawVideos : [];
  const courses = Array.isArray(rawCourses)
    ? rawCourses.map((c) => ({ id: c.id, title: c.title }))
    : [];

  return (
    <div className="space-y-6">
      {/* ─── 1. Minimalist Header with Segmented Navigation ─── */}
      <Card className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title & Description */}
        <div>
          <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
            {activeSubTab === "meetings" ? (
              <Video className="w-5 h-5 text-primary" />
            ) : (
              <Film className="w-5 h-5 text-primary" />
            )}
            <span>
              {activeSubTab === "meetings"
                ? "إدارة لقاءات Zoom المباشرة"
                : "بنك وسائط وتسجيلات الفيديو"}
            </span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {activeSubTab === "meetings"
              ? "جدولة لقاءات Zoom ومتابعة سجلات حضور الطلاب للجلسات التفاعلية"
              : "رفع وإدارة التسجيلات المرئية وربطها بدروس الكورسات"}
          </p>
        </div>

        {/* Action Button & Segmented Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Segmented Control */}
          <div className="flex items-center p-1 rounded-xl bg-muted/60 border border-border">
            <button
              type="button"
              onClick={() => setActiveSubTab("meetings")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSubTab === "meetings"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>اللقاءات ({meetings.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab("videos")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSubTab === "videos"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>بنك الفيديوهات ({videos.length})</span>
            </button>
          </div>

          {/* Primary Action Button */}
          {activeSubTab === "meetings" ? (
            <Button
              type="button"
              onClick={() => {
                setEditingMeeting(null);
                setIsZoomModalOpen(true);
              }}
              disabled={coursesLoading}
              className="rounded-xl h-10 px-4 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ إضافة لقاء Zoom</span>
            </Button>
          ) : (
            <Button
              type="button"
              onClick={() => {
                setEditingVideo(null);
                setIsVideoModalOpen(true);
              }}
              disabled={coursesLoading}
              className="rounded-xl h-10 px-4 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>+ رفع / إدراج فيديو</span>
            </Button>
          )}
        </div>
      </Card>

      {/* ─── 2. Active Sub-View ─────────────────────────────── */}
      {activeSubTab === "meetings" ? (
        <LiveMeetingsView
          meetings={meetings}
          isLoading={meetingsLoading}
          onEdit={(meeting) => {
            setEditingMeeting(meeting);
            setIsZoomModalOpen(true);
          }}
          onDelete={(meeting) => {
            setDeleteTarget({
              type: "meeting",
              id: meeting.id,
              title: meeting.title,
            });
          }}
        />
      ) : (
        <VideoAssetsView
          videos={videos}
          isLoading={videosLoading}
          courses={courses}
          selectedCourseId={selectedCourseId}
          onSelectCourseId={setSelectedCourseId}
          youtubeStatus={youtubeStatus}
          isConnectingYouTube={isConnectingYouTube}
          onConnectYouTube={handleConnectYouTube}
          onDisconnectYouTube={handleDisconnectYouTube}
          onEdit={(video) => {
            setEditingVideo(video);
            setIsVideoModalOpen(true);
          }}
          onDelete={(video) => {
            setDeleteTarget({
              type: "video",
              id: video.id,
              title: video.title,
            });
          }}
        />
      )}

      {/* ─── 3. Modals ──────────────────────────────────────── */}
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

      {/* Delete / Disconnect Confirmation Dialog */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title={
          deleteTarget?.type === "youtube_disconnect"
            ? "تأكيد فصل قناة YouTube"
            : deleteTarget?.type === "meeting"
              ? "تأكيد حذف لقاء Zoom"
              : "تأكيد حذف الفيديو"
        }
        description={
          deleteTarget?.type === "youtube_disconnect"
            ? "هل أنت متأكد من رغبتك في فصل قناة YouTube عن المنصة؟ سيتطلب رفع الفيديوهات مستقبلاً إعادة المصادقة."
            : `هل أنت متأكد من رغبتك في حذف "${deleteTarget?.title}" نهائياً؟ لا يمكن التراجع عن هذا الإجراء.`
        }
        confirmText={
          deleteTarget?.type === "youtube_disconnect" ? "نعم، افصل القناة" : "نعم، احذف نهائياً"
        }
        cancelText="إلغاء"
        variant="destructive"
        isLoading={isDeleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
