"use client";

import { useState, useMemo, useRef } from "react";
import {
  Search,
  Clock,
  Check,
  RefreshCw,
  Youtube,
  Plus,
  AlertCircle,
  ExternalLink,
  Film,
  Link as LinkIcon,
  Loader2,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import { adminCourseQueries } from "../../queries/adminCourses.queries";
import {
  useCreateCoursePlaylistMutation,
  useUpdateCourseMutation,
} from "../../queries/adminCourses.mutations";
import type { AdminCourse } from "../../types";

interface Props {
  course: AdminCourse;
  sectionTitle?: string;
  isOpen: boolean;
  onClose: () => void;
  onAddLesson: (video: { id: string; title: string; duration_minutes: number }) => Promise<void>;
}

export default function CurriculumVideoPickerModal({
  course,
  sectionTitle,
  isOpen,
  onClose,
  onAddLesson,
}: Props) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [manualPlaylistId, setManualPlaylistId] = useState("");
  const [showChangePlaylist, setShowChangePlaylist] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [addingVideoId, setAddingVideoId] = useState<string | null>(null);
  const [createPlaylistError, setCreatePlaylistError] = useState<string | null>(null);

  const isAddingLessonRef = useRef(false);
  const isCreatingPlaylistRef = useRef(false);
  const isLinkingPlaylistRef = useRef(false);

  const {
    data: playlistData,
    isLoading,
    refetch,
  } = useQuery({
    ...adminCourseQueries.youtubeVideos(course.id),
    enabled: isOpen,
  });

  const createPlaylistMutation = useCreateCoursePlaylistMutation(course.id);
  const updateCourseMutation = useUpdateCourseMutation();

  const videos = playlistData?.videos ?? [];
  const playlistId = playlistData?.playlist_id;
  const isConnected = playlistData?.connected ?? true;

  // Client-side instant title filter
  const filteredVideos = useMemo(() => {
    if (!searchQuery.trim()) return videos;
    const q = searchQuery.toLowerCase().trim();
    return videos.filter((v) => v.title.toLowerCase().includes(q));
  }, [videos, searchQuery]);

  const addedCount = useMemo(() => videos.filter((v) => v.is_already_added).length, [videos]);

  const handleManualRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await queryClient.invalidateQueries({
        queryKey: adminCourseQueries.youtubeVideos(course.id).queryKey,
      });
      await refetch();
      toast.success("تم تحديث قائمة الفيديوهات من YouTube");
    } catch {
      toast.error("فشل تحديث البيانات من YouTube");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCreatePlaylist = async () => {
    if (isCreatingPlaylistRef.current || createPlaylistMutation.isPending) return;
    isCreatingPlaylistRef.current = true;
    setCreatePlaylistError(null);
    try {
      await createPlaylistMutation.mutateAsync();
      await queryClient.invalidateQueries({
        queryKey: adminCourseQueries.youtubeVideos(course.id).queryKey,
      });
      await refetch();
      toast.success("تم إنشاء وربط قائمة التشغيل على YouTube بنجاح!");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "تعذر إنشاء قائمة التشغيل على YouTube. تأكد من ربط القناة وصلاحيات الوصول.";
      setCreatePlaylistError(msg);
      toast.error(msg);
    } finally {
      isCreatingPlaylistRef.current = false;
    }
  };

  const handleLinkExistingPlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      isLinkingPlaylistRef.current ||
      updateCourseMutation.isPending ||
      !manualPlaylistId.trim()
    ) {
      return;
    }

    isLinkingPlaylistRef.current = true;
    try {
      // Extract clean playlist ID if full URL pasted
      let cleanId = manualPlaylistId.trim();
      const listMatch = cleanId.match(/[?&]list=([a-zA-Z0-9_-]+)/);
      if (listMatch) {
        cleanId = listMatch[1];
      }

      await updateCourseMutation.mutateAsync({
        id: course.id,
        data: {
          ...course,
          youtube_playlist_id: cleanId,
        } as any,
      });

      setManualPlaylistId("");
      setShowChangePlaylist(false);
      await queryClient.invalidateQueries({
        queryKey: adminCourseQueries.youtubeVideos(course.id).queryKey,
      });
      await refetch();
      toast.success("تم ربط قائمة التشغيل الجديدة بنجاح!");
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "فشل ربط قائمة التشغيل.";
      toast.error(msg);
    } finally {
      isLinkingPlaylistRef.current = false;
    }
  };

  const handleAddVideoAsLesson = async (video: {
    id: string;
    title: string;
    duration_minutes: number;
  }) => {
    if (isAddingLessonRef.current || addingVideoId) return;

    isAddingLessonRef.current = true;
    setAddingVideoId(video.id);
    try {
      await onAddLesson(video);
      toast.success(`تمت إضافة الدرس "${video.title}" بنجاح!`);
      // Invalidate to reflect assigned marker immediately
      await queryClient.invalidateQueries({
        queryKey: adminCourseQueries.youtubeVideos(course.id).queryKey,
      });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "فشل إضافة الدرس.";
      toast.error(msg);
    } finally {
      setAddingVideoId(null);
      isAddingLessonRef.current = false;
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalHeader
        title="إضافة درس من فيديوهات YouTube"
        description={
          sectionTitle
            ? `اختيار وإضافة الفيديوهات مباشرة إلى قسم: ${sectionTitle}`
            : `تصفح فيديوهات قائمة الكورس: ${course.title}`
        }
      />

      <ModalBody className="p-4 sm:p-5 space-y-4 max-h-[70vh] overflow-y-auto">
        {/* Loading Query State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-xs text-muted-foreground font-medium">
              جارِ فحص ومزامنة فيديوهات الكورس من YouTube...
            </p>
          </div>
        ) : !isConnected ? (
          /* YouTube Not Connected Warning */
          <div className="text-center py-10 bg-destructive/10 border border-destructive/20 rounded-2xl p-6 space-y-3">
            <AlertCircle className="w-10 h-10 text-destructive mx-auto" />
            <h3 className="font-bold text-destructive text-sm">قناة YouTube غير مربوطة بالمنصة</h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              يرجى التوجه إلى قسم Media Pipeline وربط حساب Google/YouTube لتفعيل مزامنة الفيديوهات
              وقوائم التشغيل.
            </p>
          </div>
        ) : createPlaylistMutation.isPending ? (
          /* Creating Playlist Progress Barrier */
          <div className="p-8 rounded-2xl bg-primary/5 border border-primary/20 text-center space-y-3">
            <RefreshCw className="w-9 h-9 text-primary animate-spin mx-auto" />
            <h4 className="font-bold text-sm text-foreground">
              قيد إنشاء قائمة التشغيل على YouTube للكورس...
            </h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
              يتم التواصل مع خوادم YouTube لإنشاء قائمة تشغيل خاصة بالكورس وحفظها تلقائياً. يرجى
              الانتظار ثوانٍ معدودة وعدم إغلاق النافذة.
            </p>
          </div>
        ) : !playlistId ? (
          /* Initial State: No Playlist Attached Yet */
          <div className="bg-card border border-border rounded-2xl p-6 space-y-5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <Youtube className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-foreground text-sm">
                لم يتم إنشاء أو ربط قائمة تشغيل لهذا الكورس بعد
              </h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                يمكنك إنشاء قائمة تشغيل خاصة بالكورس على YouTube بنقرة واحدة، لتتمكن من إضافة الدروس
                بسلاسة وبدون إدخال يدوي.
              </p>
            </div>

            {/* Error Message if Creation Failed */}
            {createPlaylistError && (
              <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs space-y-2 text-right">
                <div className="flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>فشل إنشاء قائمة التشغيل</span>
                </div>
                <p className="text-[11px] leading-relaxed">{createPlaylistError}</p>
              </div>
            )}

            {/* The 1-Click Create Button (ONLY appears when NO playlist is linked) */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
              <p className="text-xs font-semibold text-foreground">
                الخيار الأسرع (تلقائي بنقرة واحدة):
              </p>
              <Button
                type="button"
                onClick={() => void handleCreatePlaylist()}
                disabled={createPlaylistMutation.isPending}
                className="w-full sm:w-auto h-9 text-xs font-medium bg-primary text-primary-foreground"
              >
                <Plus className="w-3.5 h-3.5 ml-1.5" />
                إنشاء وربط قائمة تشغيل لهذا الكورس الآن
              </Button>
            </div>

            {/* Alternative: Link Existing Playlist */}
            <div className="pt-2 border-t border-border">
              <form onSubmit={handleLinkExistingPlaylist} className="space-y-2">
                <span className="text-[11px] text-muted-foreground block text-right font-medium">
                  أو ألصق رابط أو معرّف قائمة تشغيل موجودة مسبقاً:
                </span>
                <div className="flex gap-2">
                  <Input
                    placeholder="https://youtube.com/playlist?list=PL... أو ID"
                    value={manualPlaylistId}
                    onChange={(e) => setManualPlaylistId(e.target.value)}
                    className="h-9 min-h-0 text-xs flex-1 text-left ltr"
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={updateCourseMutation.isPending || !manualPlaylistId.trim()}
                    className="h-9 text-xs px-3 shrink-0"
                  >
                    ربط القائمة
                  </Button>
                </div>
              </form>
            </div>
          </div>
        ) : videos.length === 0 ? (
          /* Success Playlist Linked BUT Empty Videos */
          <div className="text-center py-10 bg-muted/10 border border-dashed border-border rounded-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-foreground text-sm">تم ربط قائمة التشغيل بنجاح!</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                لا يوجد أي فيديو مدرج في هذه القائمة على YouTube بعد.
              </p>
              <p className="text-[11px] font-mono text-muted-foreground/70">
                معرّف القائمة: {playlistId}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap justify-center items-center gap-2">
              <a
                href={`https://youtube.com/playlist?list=${playlistId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs bg-red-600 text-white hover:bg-red-700 px-3.5 py-2 rounded-xl font-medium transition-colors shadow-xs"
              >
                <Youtube className="w-4 h-4 fill-current" />
                <span>فتح القائمة في YouTube لإضافة الفيديوهات</span>
                <ExternalLink className="w-3 h-3 mr-0.5" />
              </a>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void handleManualRefresh()}
                disabled={isRefreshing}
                className="h-9 text-xs px-3.5 rounded-xl"
              >
                <RefreshCw className={`w-3.5 h-3.5 ml-1.5 ${isRefreshing ? "animate-spin" : ""}`} />
                تحديث الفيديوهات
              </Button>
            </div>

            {/* Option to change playlist via URL confirmation (Button hidden, only URL link) */}
            <div className="pt-3 border-t border-border">
              {!showChangePlaylist ? (
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => setShowChangePlaylist(true)}
                  className="h-auto p-0 text-[11px] text-muted-foreground hover:text-foreground gap-1"
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>هل تريد ربط قائمة تشغيل أخرى عبر الرابط؟</span>
                </Button>
              ) : (
                <form
                  onSubmit={handleLinkExistingPlaylist}
                  className="p-3 bg-card border border-border rounded-xl space-y-2 text-right animate-in fade-in-0"
                >
                  <span className="text-[11px] font-medium text-foreground block">
                    ألصق رابط قائمة التشغيل الجديدة لتأكيد الربط:
                  </span>
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://youtube.com/playlist?list=PL..."
                      value={manualPlaylistId}
                      onChange={(e) => setManualPlaylistId(e.target.value)}
                      className="h-8 min-h-0 text-xs flex-1 text-left ltr"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={updateCourseMutation.isPending || !manualPlaylistId.trim()}
                      className="h-8 text-xs px-3"
                    >
                      تأكيد الربط
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowChangePlaylist(false);
                        setManualPlaylistId("");
                      }}
                      className="h-8 text-xs px-2"
                    >
                      إلغاء
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        ) : (
          /* Videos List with Direct Add Action */
          <div className="space-y-3">
            {/* Header controls: Search & Refresh */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-muted/20 p-2.5 rounded-xl border border-border">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="ابحث في عناوين الفيديوهات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 min-h-0 text-xs pr-8 bg-background"
                />
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
                <span className="text-[11px] text-muted-foreground font-medium">
                  {videos.length} فيديو ({addedCount} مضاف)
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => void handleManualRefresh()}
                  disabled={isRefreshing}
                  className="h-8 px-2 text-xs hover:bg-muted"
                  title="تحديث البيانات من YouTube"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ml-1 ${isRefreshing ? "animate-spin" : ""}`} />
                  تحديث
                </Button>
              </div>
            </div>

            {/* Video Cards Grid */}
            <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
              {filteredVideos.length === 0 ? (
                <p className="text-center text-xs text-muted-foreground py-8">
                  لا توجد فيديوهات مطابقة لكلمة البحث.
                </p>
              ) : (
                filteredVideos.map((video) => {
                  const isAdded = video.is_already_added;
                  const isBeingAdded = addingVideoId === video.id;

                  return (
                    <div
                      key={video.id}
                      className={`group flex items-center gap-3 p-2.5 rounded-xl border transition-all text-right ${
                        isAdded
                          ? "bg-muted/30 border-border/50 opacity-60 select-none"
                          : "bg-card border-border hover:border-primary/40 hover:bg-primary/5 shadow-2xs hover:shadow-xs"
                      }`}
                    >
                      {/* Video Thumbnail */}
                      <div className="relative w-24 sm:w-28 aspect-video rounded-lg overflow-hidden bg-muted shrink-0 border border-border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={video.thumbnail_url}
                          alt={video.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <span className="absolute bottom-1 left-1 bg-black/80 text-white text-[10px] px-1 py-0.5 rounded font-mono font-medium leading-none">
                          {video.duration_formatted}
                        </span>
                      </div>

                      {/* Video Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="font-semibold text-foreground text-xs leading-snug line-clamp-2">
                            {video.title}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap text-[11px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-muted-foreground/70" />
                            {video.duration_formatted} ({video.duration_minutes} دقيقة)
                          </span>
                          <span>•</span>
                          <span className="font-mono text-[10px] text-muted-foreground/70">
                            ID: {video.id}
                          </span>
                        </div>
                      </div>

                      {/* Status / Direct Add Button */}
                      <div className="shrink-0 self-center">
                        {isAdded ? (
                          <Badge
                            variant="secondary"
                            size="sm"
                            shape="rounded"
                            className="bg-muted text-muted-foreground text-[10px] py-1 px-2.5"
                          >
                            <Check className="w-3 h-3 ml-1" /> تمت إضافته كدرس
                          </Badge>
                        ) : (
                          <Button
                            type="button"
                            size="sm"
                            onClick={() =>
                              void handleAddVideoAsLesson({
                                id: video.id,
                                title: video.title,
                                duration_minutes: video.duration_minutes,
                              })
                            }
                            disabled={isBeingAdded || Boolean(addingVideoId)}
                            className="h-8 text-xs px-3 font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-2xs"
                          >
                            {isBeingAdded ? (
                              <>
                                <RefreshCw className="w-3 h-3 ml-1.5 animate-spin" />
                                جاري الإضافة...
                              </>
                            ) : (
                              <>
                                <Plus className="w-3 h-3 ml-1" />
                                إضافة كدرس
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Switch Playlist option via link verification */}
            <div className="pt-2 border-t border-border flex items-center justify-between">
              {!showChangePlaylist ? (
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => setShowChangePlaylist(true)}
                  className="h-auto p-0 text-[11px] text-muted-foreground hover:text-foreground gap-1"
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>ربط قائمة تشغيل أخرى عبر الرابط</span>
                </Button>
              ) : (
                <form
                  onSubmit={handleLinkExistingPlaylist}
                  className="w-full p-2.5 bg-muted/20 border border-border rounded-xl space-y-1.5 text-right animate-in fade-in-0"
                >
                  <span className="text-[11px] font-medium text-foreground block">
                    ألصق رابط قائمة التشغيل البديلة:
                  </span>
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://youtube.com/playlist?list=PL..."
                      value={manualPlaylistId}
                      onChange={(e) => setManualPlaylistId(e.target.value)}
                      className="h-7 min-h-0 text-xs flex-1 text-left ltr"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={updateCourseMutation.isPending || !manualPlaylistId.trim()}
                      className="h-7 text-xs px-2.5"
                    >
                      تأكيد
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowChangePlaylist(false);
                        setManualPlaylistId("");
                      }}
                      className="h-7 text-xs px-2"
                    >
                      إلغاء
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </ModalBody>

      <ModalFooter className="p-3 bg-muted/10 border-t border-border flex justify-between items-center">
        {playlistId && (
          <a
            href={`https://youtube.com/playlist?list=${playlistId}`}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            <Youtube className="w-3.5 h-3.5 text-red-500" />
            فتح قائمة التشغيل على YouTube
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          className="h-8 text-xs px-3 mr-auto"
        >
          تم / إغلاق
        </Button>
      </ModalFooter>
    </Modal>
  );
}
