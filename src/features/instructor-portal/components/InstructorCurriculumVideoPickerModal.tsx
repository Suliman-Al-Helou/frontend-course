"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import {
  Youtube,
  Link as LinkIcon,
  Film,
  Check,
  Search,
  Clock,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { instructorPortalQueries } from "../queries/instructor-portal.queries";
import { extractYouTubeVideoId } from "../utils";

interface InstructorCurriculumVideoPickerModalProps {
  courseId: number | string;
  sectionTitle?: string;
  lessonTitle?: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectVideo: (video: { id: string; title: string; duration_minutes: number }) => Promise<void>;
}

export function InstructorCurriculumVideoPickerModal({
  courseId,
  sectionTitle,
  isOpen,
  onClose,
  onSelectVideo,
}: InstructorCurriculumVideoPickerModalProps) {
  const [activeMode, setActiveMode] = useState<"direct" | "playlist">("direct");
  const [urlInput, setUrlInput] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSubmittingRef = useRef(false);

  // Extracted Video ID from direct input
  const extractedId = extractYouTubeVideoId(urlInput);

  // Playlist query
  const { data: playlistData, isLoading: isLoadingPlaylist } = useQuery({
    ...instructorPortalQueries.youtubeVideos(courseId),
    enabled: isOpen && activeMode === "playlist",
  });

  const playlistVideos = playlistData?.videos ?? [];
  const filteredPlaylistVideos = playlistVideos.filter((v) =>
    searchQuery.trim() ? v.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) : true,
  );

  const handleDirectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;

    if (!extractedId) {
      toast.error("يرجى إدخال رابط فيديو YouTube صحيح أو معرّف صالح مكون من 11 رمزاً");
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      await onSelectVideo({
        id: extractedId,
        title: customTitle.trim() || `فيديو درس (${extractedId})`,
        duration_minutes: Number(durationMinutes) || 10,
      });

      toast.success("تم إرفاق فيديو الدرس بنجاح");
      handleClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل إرفاق الفيديو");
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handlePlaylistSelect = async (video: {
    id: string;
    title: string;
    duration_minutes: number;
  }) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      await onSelectVideo({
        id: video.id,
        title: video.title,
        duration_minutes: video.duration_minutes || 10,
      });

      toast.success("تم إرفاق الفيديو من قائمة التشغيل");
      handleClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل إرفاق الفيديو");
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setUrlInput("");
    setCustomTitle("");
    setSearchQuery("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalHeader
        title="إرفاق فيديو يوتيوب للدرس"
        description={
          sectionTitle
            ? `إضافة فيديو تعليمي إلى القسم: ${sectionTitle}`
            : "حدد مصدر الفيديو للدرس التعليمي"
        }
      />

      <ModalBody className="space-y-6">
        {/* Dual Mode Selector */}
        <div className="flex rounded-xl bg-muted p-1 border border-border">
          <button
            type="button"
            onClick={() => setActiveMode("direct")}
            className={`flex-1 min-h-[44px] py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeMode === "direct"
                ? "bg-card text-foreground shadow-sm border border-border/60"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LinkIcon className="w-4 h-4 text-red-500" aria-hidden="true" />
            <span>رابط مباشر (Direct URL)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode("playlist")}
            className={`flex-1 min-h-[44px] py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              activeMode === "playlist"
                ? "bg-card text-foreground shadow-sm border border-border/60"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Youtube className="w-4 h-4 text-red-600 fill-current" aria-hidden="true" />
            <span>قائمة تشغيل المقرر (Playlist)</span>
          </button>
        </div>

        {/* Mode 1: Direct Unlisted YouTube URL */}
        {activeMode === "direct" && (
          <form onSubmit={handleDirectSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="youtube-url" className="text-xs font-bold text-foreground">
                رابط الفيديو على YouTube (أو معرّف الفيديو) *
              </Label>
              <div className="relative">
                <Input
                  id="youtube-url"
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=... أو https://youtu.be/..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="min-h-[44px] pe-10 font-mono text-xs sm:text-sm"
                  dir="ltr"
                  autoFocus
                />
                <div className="absolute inset-y-0 end-3 flex items-center pointer-events-none text-muted-foreground">
                  <Youtube className="w-5 h-5 text-red-500" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                يمكنك لصق أي رابط فيديو غير مدرج (Unlisted) على YouTube، وسيتم استخراج المعرّف
                تلقائياً.
              </p>
            </div>

            {/* Live Video Preview Box */}
            {extractedId && (
              <div className="flex items-center gap-4 p-3.5 rounded-xl border border-primary/30 bg-primary/5 animate-in fade-in duration-200">
                <div className="relative aspect-video w-28 overflow-hidden rounded-lg bg-black shrink-0 border border-border/80">
                  <Image
                    src={`https://img.youtube.com/vi/${extractedId}/mqdefault.jpg`}
                    alt="معاينة الفيديو"
                    fill
                    sizes="112px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[11px] font-bold">
                    <Check className="w-3 h-3" />
                    <span>معرّف صالح</span>
                  </div>
                  <p className="text-xs font-mono font-semibold text-foreground truncate">
                    ID: {extractedId}
                  </p>
                  <a
                    href={`https://youtube.com/watch?v=${extractedId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors"
                  >
                    <span>فتح في YouTube</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-2">
                <Label htmlFor="video-title" className="text-xs font-bold text-foreground">
                  عنوان الدرس المرفق
                </Label>
                <Input
                  id="video-title"
                  type="text"
                  placeholder="عنوان توضيحي للدرس..."
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  className="min-h-[44px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="video-duration" className="text-xs font-bold text-foreground">
                  المدة التقديرية (دقيقة)
                </Label>
                <Input
                  id="video-duration"
                  type="number"
                  min="1"
                  max="600"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value) || 1)}
                  className="min-h-[44px]"
                />
              </div>
            </div>

            <ModalFooter className="px-0 pt-4 pb-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="min-h-[44px]"
                disabled={isSubmitting}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={!extractedId || isSubmitting}
                className="min-h-[44px] gap-2 font-bold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري الإرفاق...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>تأكيد إرفاق الفيديو</span>
                  </>
                )}
              </Button>
            </ModalFooter>
          </form>
        )}

        {/* Mode 2: Course Playlist Gallery */}
        {activeMode === "playlist" && (
          <div className="space-y-4">
            {isLoadingPlaylist ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3 text-muted-foreground">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <p className="text-xs">جاري جلب فيديوهات قائمة التشغيل...</p>
              </div>
            ) : playlistVideos.length === 0 ? (
              <div className="py-8 text-center rounded-xl border border-dashed border-border p-6 space-y-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                  <Film className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground">
                    لا توجد قائمة تشغيل مربوطة بهذا المقرر حالياً
                  </p>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    يمكنك استخدام "الرابط المباشر" لإرفاق أي فيديو يوتيوب غير مدرج في ثوانٍ معدودة.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveMode("direct")}
                  className="min-h-[44px] gap-1.5 text-xs font-bold"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>التحويل إلى الرابط المباشر</span>
                </Button>
              </div>
            ) : (
              <>
                {/* Search in Playlist */}
                <div className="relative">
                  <Input
                    placeholder="ابحث في فيديوهات القائمة..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="min-h-[44px] pe-9 text-xs"
                  />
                  <Search className="w-4 h-4 text-muted-foreground absolute inset-y-0 end-3 my-auto pointer-events-none" />
                </div>

                {/* Videos Grid */}
                <div className="max-h-72 overflow-y-auto space-y-2 pe-1">
                  {filteredPlaylistVideos.map((video) => (
                    <div
                      key={video.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-border/80 bg-card hover:border-primary/40 transition-colors gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative aspect-video w-20 overflow-hidden rounded-lg bg-black shrink-0 border border-border/60">
                          {video.thumbnail ? (
                            <Image
                              src={video.thumbnail}
                              alt={video.title}
                              fill
                              sizes="80px"
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <Film className="w-4 h-4 text-muted-foreground m-auto" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-foreground truncate">
                            {video.title}
                          </h4>
                          <span className="text-[11px] font-mono text-muted-foreground">
                            ID: {video.id}
                          </span>
                        </div>
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        disabled={video.is_already_added || isSubmitting}
                        onClick={() => handlePlaylistSelect(video)}
                        variant={video.is_already_added ? "secondary" : "default"}
                        className="min-h-[44px] min-w-[44px] px-3 shrink-0 text-xs font-bold gap-1"
                      >
                        {video.is_already_added ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-primary" />
                            <span>مضاف مسبقاً</span>
                          </>
                        ) : (
                          <span>إرفاق</span>
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </>
            )}

            <ModalFooter className="px-0 pt-4 pb-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="min-h-[44px]"
              >
                إغلاق
              </Button>
            </ModalFooter>
          </div>
        )}
      </ModalBody>
    </Modal>
  );
}
