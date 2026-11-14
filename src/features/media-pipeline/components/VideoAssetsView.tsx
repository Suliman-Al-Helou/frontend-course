"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Film,
  Play,
  Pencil,
  Trash2,
  Loader2,
  Radio,
  CheckCircle2,
  Unlink,
  ExternalLink,
  Clock,
  Video,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AdminVideoAsset, YouTubeStatus } from "../types";

interface VideoAssetsViewProps {
  videos: AdminVideoAsset[];
  isLoading: boolean;
  courses: Array<{ id: number; title: string }>;
  selectedCourseId: string;
  onSelectCourseId: (id: string) => void;
  youtubeStatus?: YouTubeStatus;
  isConnectingYouTube: boolean;
  onConnectYouTube: () => void;
  onDisconnectYouTube: () => void;
  onEdit: (video: AdminVideoAsset) => void;
  onDelete: (video: AdminVideoAsset) => void;
}

const fmtDuration = (sec: number) => {
  if (!sec) return "0:00";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

export default function VideoAssetsView({
  videos,
  isLoading,
  courses,
  selectedCourseId,
  onSelectCourseId,
  youtubeStatus,
  isConnectingYouTube,
  onConnectYouTube,
  onDisconnectYouTube,
  onEdit,
  onDelete,
}: VideoAssetsViewProps) {
  const [previewVideo, setPreviewVideo] = useState<AdminVideoAsset | null>(null);

  const filteredVideos = videos.filter((v) => {
    if (selectedCourseId === "all") return true;
    return String(v.course_id) === selectedCourseId;
  });

  return (
    <div className="space-y-4">
      {/* ─── Compact Controls Bar (Filter + Compact YouTube Pill) ─── */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Course Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground shrink-0">تصفية حسب الكورس:</span>
          <Select dir="rtl" value={selectedCourseId} onValueChange={onSelectCourseId}>
            <SelectTrigger className="h-9 w-60 rounded-xl text-xs bg-background">
              <SelectValue placeholder="جميع الكورسات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الكورسات ({videos.length})</SelectItem>
              {courses.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Minimalist YouTube Status Pill */}
        <div className="flex items-center gap-2.5 self-end md:self-auto">
          {youtubeStatus?.connected ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>YouTube: {youtubeStatus.channel_title}</span>
              </span>
              <button
                type="button"
                onClick={onDisconnectYouTube}
                className="text-muted-foreground hover:text-destructive p-0.5 rounded transition-colors"
                title="فصل قناة YouTube"
                aria-label="فصل قناة YouTube"
              >
                <Unlink className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onConnectYouTube}
              disabled={isConnectingYouTube}
              className="h-9 rounded-xl text-xs gap-1.5 border-red-500/30 text-red-600 hover:bg-red-500/10"
            >
              {isConnectingYouTube ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Radio className="w-3.5 h-3.5 text-red-600" />
              )}
              <span>ربط قناة YouTube</span>
            </Button>
          )}
        </div>
      </div>

      {/* ─── Video Assets Grid / List ─────────────────────────────── */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 space-y-3 bg-card border border-border rounded-2xl">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground">جارٍ تحميل بنك الفيديوهات...</p>
        </div>
      ) : filteredVideos.length === 0 ? (
        <div className="p-12 text-center bg-card border border-border rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Film className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-foreground">لا توجد فيديوهات في بنك الوسائط</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            ابدأ برفع ملف فيديو من جهازك أو أدرج رابط YouTube لربطه بدروس الكورسات.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVideos.map((video) => {
            const courseTitle = video.course?.title || "كورس غير محدد";
            const isProcessing = video.status === "processing" || video.status === "uploading";
            const isFailed = video.status === "failed";
            const thumbnail = `https://img.youtube.com/vi/${video.provider_video_id}/mqdefault.jpg`;

            return (
              <div
                key={video.id}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between transition-all hover:border-primary/40 group"
              >
                {/* Thumbnail Preview Area */}
                <div className="relative aspect-video bg-muted/50 overflow-hidden">
                  <Image
                    src={thumbnail}
                    alt={video.title}
                    fill
                    unoptimized
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setPreviewVideo(video)}
                      className="rounded-full w-10 h-10 p-0 bg-primary/90 text-primary-foreground hover:scale-110 transition-transform"
                      aria-label="معاينة الفيديو"
                    >
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </Button>
                  </div>

                  {/* Duration Badge */}
                  <span className="absolute bottom-2 left-2 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded-md flex items-center gap-1 backdrop-blur-xs">
                    <Clock className="w-2.5 h-2.5" />
                    {fmtDuration(video.duration_seconds)}
                  </span>

                  {/* Status Indicator */}
                  {isProcessing && (
                    <span className="absolute top-2 right-2 bg-amber-500/90 text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-xs">
                      <Loader2 className="w-2.5 h-2.5 animate-spin" />
                      جارٍ المعالجة
                    </span>
                  )}
                  {isFailed && (
                    <span className="absolute top-2 right-2 bg-destructive/90 text-white text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-xs">
                      فشلت المعالجة
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary truncate max-w-[200px]">
                        {courseTitle}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {video.type === "recording" ? "تسجيل لقاء" : "درس مسجل"}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-foreground line-clamp-2" title={video.title}>
                      {video.title}
                    </h4>

                    {video.zoom_meeting && (
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Video className="w-3 h-3 text-muted-foreground/70" />
                        <span className="truncate">مرتبط بـ: {video.zoom_meeting.title}</span>
                      </p>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                    <a
                      href={`https://youtube.com/watch?v=${video.provider_video_id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-[11px] transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>YouTube</span>
                    </a>

                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(video)}
                        className="w-8 h-8 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
                        aria-label="تعديل الفيديو"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(video)}
                        className="w-8 h-8 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                        aria-label="حذف الفيديو"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Video Preview Modal */}
      {previewVideo && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={() => setPreviewVideo(null)}
        >
          <div
            className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in-0 zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-3 border-b border-border flex items-center justify-between bg-muted/20">
              <h3 className="text-sm font-bold text-foreground truncate">{previewVideo.title}</h3>
              <button
                type="button"
                onClick={() => setPreviewVideo(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="إغلاق المعاينة"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${previewVideo.provider_video_id}?autoplay=1`}
                title={previewVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
