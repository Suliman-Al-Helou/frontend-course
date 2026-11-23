"use client";

import React, { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Youtube,
  FileQuestion,
  Eye,
  EyeOff,
  Clock,
  Loader2,
  AlertCircle,
  Film,
  CheckCircle2,
  FolderPlus,
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Label } from "@/components/ui/label";
import {
  instructorPortalQueries,
  instructorPortalKeys,
} from "../queries/instructor-portal.queries";
import {
  createInstructorSection,
  updateInstructorSection,
  deleteInstructorSection,
  createInstructorLesson,
  updateInstructorLesson,
  deleteInstructorLesson,
} from "../api";
import { canMoveUp, canMoveDown, swapArrayItems } from "../utils";
import { InstructorCurriculumVideoPickerModal } from "./InstructorCurriculumVideoPickerModal";
import { InstructorLessonTaskEditor } from "./InstructorLessonTaskEditor";
import type {
  InstructorCourse,
  InstructorSection,
  InstructorLesson,
} from "../types";

interface InstructorCurriculumViewProps {
  courseId: number | string;
  course: InstructorCourse;
}

export function InstructorCurriculumView({
  courseId,
  course,
}: InstructorCurriculumViewProps) {
  const queryClient = useQueryClient();

  // Accordion open/collapse map
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({});

  // Section Modals
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [editingSection, setEditingSection] = useState<InstructorSection | null>(null);
  const [editSectionTitle, setEditSectionTitle] = useState("");

  // Lesson Modals
  const [activeSectionForNewLesson, setActiveSectionForNewLesson] = useState<number | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonDuration, setNewLessonDuration] = useState(10);
  const [editingLesson, setEditingLesson] = useState<{
    lesson: InstructorLesson;
    sectionId: number;
  } | null>(null);
  const [editLessonTitle, setEditLessonTitle] = useState("");
  const [editLessonDuration, setEditLessonDuration] = useState(10);

  // Video Picker Modal State
  const [videoPickerLesson, setVideoPickerLesson] = useState<InstructorLesson | null>(null);

  // Task Editor Modal State
  const [taskEditorLesson, setTaskEditorLesson] = useState<InstructorLesson | null>(null);

  const [isMutating, setIsMutating] = useState(false);
  const isSubmittingRef = useRef(false);

  // Query sections
  const {
    data: sections = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    ...instructorPortalQueries.sections(courseId),
  });

  // Toggle accordion state
  const toggleSection = (sectionId: number) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionId]: prev[sectionId] === undefined ? false : !prev[sectionId],
    }));
  };

  // Section Creation
  const handleCreateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current || !newSectionTitle.trim()) return;
    isSubmittingRef.current = true;
    setIsMutating(true);

    try {
      await createInstructorSection(courseId, {
        title: newSectionTitle.trim(),
        order: sections.length + 1,
      });

      await queryClient.invalidateQueries({
        queryKey: instructorPortalKeys.sections(courseId),
      });

      toast.success("تم إنشاء القسم بنجاح");
      setNewSectionTitle("");
      setIsAddSectionOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل إنشاء القسم");
    } finally {
      isSubmittingRef.current = false;
      setIsMutating(false);
    }
  };

  // Section Editing
  const handleUpdateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current || !editingSection || !editSectionTitle.trim()) return;
    isSubmittingRef.current = true;
    setIsMutating(true);

    try {
      await updateInstructorSection(editingSection.id, {
        title: editSectionTitle.trim(),
      });

      await queryClient.invalidateQueries({
        queryKey: instructorPortalKeys.sections(courseId),
      });

      toast.success("تم تعديل عنوان القسم");
      setEditingSection(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل تعديل القسم");
    } finally {
      isSubmittingRef.current = false;
      setIsMutating(false);
    }
  };

  // Section Deletion
  const handleDeleteSection = async (section: InstructorSection) => {
    if (isSubmittingRef.current) return;
    if (!confirm(`هل أنت متأكد من حذف القسم "${section.title}"؟`)) return;

    isSubmittingRef.current = true;
    setIsMutating(true);

    try {
      await deleteInstructorSection(section.id);
      await queryClient.invalidateQueries({
        queryKey: instructorPortalKeys.sections(courseId),
      });
      toast.success("تم حذف القسم بنجاح");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "فشل حذف القسم (قد يحتوي على دروس بها تقدم للطلاب)",
      );
    } finally {
      isSubmittingRef.current = false;
      setIsMutating(false);
    }
  };

  // Section Directional Arrow Ordering
  const handleMoveSection = async (index: number, direction: "up" | "down") => {
    if (isSubmittingRef.current) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const currentSection = sections[index];
    const targetSection = sections[targetIndex];

    isSubmittingRef.current = true;
    setIsMutating(true);

    // Optimistic cache update
    const previous = queryClient.getQueryData<InstructorSection[]>(
      instructorPortalKeys.sections(courseId),
    );
    const swapped = swapArrayItems(sections, index, targetIndex).map((s, idx) => ({
      ...s,
      order: idx + 1,
    }));
    queryClient.setQueryData(instructorPortalKeys.sections(courseId), swapped);

    try {
      await Promise.all([
        updateInstructorSection(currentSection.id, { order: targetIndex + 1 }),
        updateInstructorSection(targetSection.id, { order: index + 1 }),
      ]);
      toast.success("تم تحديث ترتيب الأقسام");
    } catch (err) {
      queryClient.setQueryData(instructorPortalKeys.sections(courseId), previous);
      toast.error("فشل حفظ الترتيب الجديد");
    } finally {
      isSubmittingRef.current = false;
      setIsMutating(false);
    }
  };

  // Lesson Creation
  const handleCreateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current || !activeSectionForNewLesson || !newLessonTitle.trim()) return;

    const targetSection = sections.find((s) => s.id === activeSectionForNewLesson);
    const currentLessonsCount = targetSection?.lessons?.length ?? 0;

    isSubmittingRef.current = true;
    setIsMutating(true);

    try {
      await createInstructorLesson(activeSectionForNewLesson, {
        title: newLessonTitle.trim(),
        duration: Number(newLessonDuration) * 60,
        order: currentLessonsCount + 1,
        is_published: true,
      });

      await queryClient.invalidateQueries({
        queryKey: instructorPortalKeys.sections(courseId),
      });

      toast.success("تم إنشاء الدرس بنجاح");
      setNewLessonTitle("");
      setActiveSectionForNewLesson(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل إنشاء الدرس");
    } finally {
      isSubmittingRef.current = false;
      setIsMutating(false);
    }
  };

  // Lesson Editing
  const handleUpdateLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current || !editingLesson || !editLessonTitle.trim()) return;

    isSubmittingRef.current = true;
    setIsMutating(true);

    try {
      await updateInstructorLesson(editingLesson.lesson.id, {
        title: editLessonTitle.trim(),
        duration: Number(editLessonDuration) * 60,
      });

      await queryClient.invalidateQueries({
        queryKey: instructorPortalKeys.sections(courseId),
      });

      toast.success("تم تحديث الدرس بنجاح");
      setEditingLesson(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل تحديث الدرس");
    } finally {
      isSubmittingRef.current = false;
      setIsMutating(false);
    }
  };

  // Lesson Publication Toggle
  const handleToggleLessonPublish = async (lesson: InstructorLesson) => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    try {
      await updateInstructorLesson(lesson.id, {
        is_published: !lesson.is_published,
      });

      await queryClient.invalidateQueries({
        queryKey: instructorPortalKeys.sections(courseId),
      });

      toast.success(
        lesson.is_published ? "تم تحويل الدرس إلى مسودة" : "تم نشر الدرس بنجاح",
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل تحديث حالة النشر");
    } finally {
      isSubmittingRef.current = false;
    }
  };

  // Lesson Deletion
  const handleDeleteLesson = async (lesson: InstructorLesson) => {
    if (isSubmittingRef.current) return;
    if (!confirm(`هل أنت متأكد من حذف الدرس "${lesson.title}"؟`)) return;

    isSubmittingRef.current = true;
    setIsMutating(true);

    try {
      await deleteInstructorLesson(lesson.id);
      await queryClient.invalidateQueries({
        queryKey: instructorPortalKeys.sections(courseId),
      });
      toast.success("تم حذف الدرس بنجاح");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "لا يمكن حذف درس به سجلات تقدم مكتملة للطلاب",
      );
    } finally {
      isSubmittingRef.current = false;
      setIsMutating(false);
    }
  };

  // Lesson Directional Arrow Ordering
  const handleMoveLesson = async (
    sectionId: number,
    lessonIndex: number,
    direction: "up" | "down",
  ) => {
    if (isSubmittingRef.current) return;
    const targetSection = sections.find((s) => s.id === sectionId);
    if (!targetSection) return;

    const lessons = targetSection.lessons || [];
    const targetIndex = direction === "up" ? lessonIndex - 1 : lessonIndex + 1;
    if (targetIndex < 0 || targetIndex >= lessons.length) return;

    const currentLesson = lessons[lessonIndex];
    const targetLesson = lessons[targetIndex];

    isSubmittingRef.current = true;
    setIsMutating(true);

    try {
      await Promise.all([
        updateInstructorLesson(currentLesson.id, { order: targetIndex + 1 }),
        updateInstructorLesson(targetLesson.id, { order: lessonIndex + 1 }),
      ]);

      await queryClient.invalidateQueries({
        queryKey: instructorPortalKeys.sections(courseId),
      });

      toast.success("تم تحديث ترتيب الدروس");
    } catch (err) {
      toast.error("فشل حفظ ترتيب الدروس");
    } finally {
      isSubmittingRef.current = false;
      setIsMutating(false);
    }
  };

  // Handle Video Selected from Picker
  const handleVideoAttached = async (video: {
    id: string;
    title: string;
    duration_minutes: number;
  }) => {
    if (!videoPickerLesson) return;

    await updateInstructorLesson(videoPickerLesson.id, {
      video_id: video.id,
      video_provider: "youtube",
      duration: video.duration_minutes * 60,
    });

    await queryClient.invalidateQueries({
      queryKey: instructorPortalKeys.sections(courseId),
    });

    setVideoPickerLesson(null);
  };

  if (isLoading) {
    return <CurriculumSkeleton />;
  }

  if (isError) {
    return (
      <div className="p-8 text-center rounded-2xl border border-destructive/20 bg-destructive/5 space-y-3">
        <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
        <p className="text-sm font-bold text-foreground">تعذر تحميل شجرة المنهج</p>
        <p className="text-xs text-muted-foreground">
          {error instanceof Error ? error.message : "حدث خطأ أثناء جلب أقسام الكورس"}
        </p>
        <Button onClick={() => refetch()} variant="outline" size="sm" className="min-h-[44px]">
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  const totalLessons = sections.reduce(
    (acc, s) => acc + (s.lessons?.length ?? 0),
    0,
  );

  return (
    <div className="space-y-6">
      {/* Curriculum Overview Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border/80">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-foreground">
            شجرة المنهج الدراسي ({sections.length} قسم • {totalLessons} درس)
          </h2>
          <p className="text-xs text-muted-foreground">
            رتب الأقسام والدروس، وارفق فيديوهات اليوتيوب، وانشئ مهام التحقق التفاعلية.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => setIsAddSectionOpen(true)}
          className="min-h-[44px] gap-2 font-bold shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة قسم جديد</span>
        </Button>
      </div>

      {/* Sections List */}
      {sections.length === 0 ? (
        <Card className="p-12 text-center rounded-2xl border-dashed border-2 space-y-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <FolderPlus className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">المنهج فارغ حالياً</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              ابدأ بإضافة أول قسم في الكورس لبناء الدروس والمهام التعليمية.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => setIsAddSectionOpen(true)}
            className="min-h-[44px] gap-1.5 font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة القسم الأول</span>
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {sections.map((section, sIndex) => {
            const isOpen = openSections[section.id] !== false; // default open
            const lessons = section.lessons || [];

            return (
              <div
                key={section.id}
                className="overflow-hidden rounded-2xl border border-border/80 bg-card transition-all"
              >
                {/* Section Header Accordion Trigger */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-muted/40 hover:bg-muted/70 transition-colors border-b border-border/60">
                  <div
                    onClick={() => toggleSection(section.id)}
                    className="flex items-center gap-3 cursor-pointer flex-1 min-w-[200px]"
                    role="button"
                    tabIndex={0}
                    aria-expanded={isOpen}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleSection(section.id);
                      }
                    }}
                  >
                    <button
                      type="button"
                      className="w-7 h-7 rounded-lg bg-background flex items-center justify-center text-muted-foreground border border-border/60"
                      aria-label="تبديل فتح القسم"
                    >
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                          القسم {sIndex + 1}
                        </span>
                        <h3 className="text-sm font-bold text-foreground">
                          {section.title}
                        </h3>
                      </div>
                      <span className="text-[11px] text-muted-foreground block">
                        {lessons.length} درس متضمن
                      </span>
                    </div>
                  </div>

                  {/* Section Controls */}
                  <div className="flex items-center gap-1.5">
                    {/* Move Up */}
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      disabled={!canMoveUp(sIndex) || isMutating}
                      onClick={() => handleMoveSection(sIndex, "up")}
                      className="w-8 h-8 min-h-[38px] min-w-[38px] text-muted-foreground hover:text-foreground"
                      title="تحريك القسم لأعلى"
                      aria-label="تحريك القسم لأعلى"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </Button>

                    {/* Move Down */}
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      disabled={!canMoveDown(sIndex, sections.length) || isMutating}
                      onClick={() => handleMoveSection(sIndex, "down")}
                      className="w-8 h-8 min-h-[38px] min-w-[38px] text-muted-foreground hover:text-foreground"
                      title="تحريك القسم لأسفل"
                      aria-label="تحريك القسم لأسفل"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </Button>

                    {/* Edit Section */}
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditingSection(section);
                        setEditSectionTitle(section.title);
                      }}
                      className="w-8 h-8 min-h-[38px] min-w-[38px] text-muted-foreground hover:text-foreground"
                      title="تعديل عنوان القسم"
                      aria-label="تعديل عنوان القسم"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>

                    {/* Delete Section */}
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteSection(section)}
                      className="w-8 h-8 min-h-[38px] min-w-[38px] text-muted-foreground hover:text-destructive"
                      title="حذف القسم"
                      aria-label="حذف القسم"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>

                    {/* Add Lesson Button */}
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setActiveSectionForNewLesson(section.id);
                        setNewLessonTitle("");
                        setNewLessonDuration(10);
                      }}
                      className="min-h-[38px] text-xs font-bold gap-1 ms-1 bg-background"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ درس</span>
                    </Button>
                  </div>
                </div>

                {/* Section Accordion Body (Lessons) */}
                {isOpen && (
                  <div className="p-4 space-y-3">
                    {lessons.length === 0 ? (
                      <div className="py-6 text-center text-xs text-muted-foreground rounded-xl bg-muted/20 border border-dashed border-border p-4">
                        لا توجد دروس في هذا القسم بعد. اضغط على "+ درس" لإضافة الدرس الأول.
                      </div>
                    ) : (
                      lessons.map((lesson, lIndex) => {
                        const durationMins = lesson.duration
                          ? Math.round(lesson.duration / 60)
                          : null;

                        return (
                          <div
                            key={lesson.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-border/70 bg-card hover:border-primary/30 transition-colors"
                          >
                            {/* Lesson Title & Status */}
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <span className="w-6 h-6 rounded-md bg-muted text-[11px] font-bold text-muted-foreground flex items-center justify-center shrink-0">
                                {lIndex + 1}
                              </span>

                              <div className="min-w-0 space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">
                                    {lesson.title}
                                  </h4>

                                  {/* Publication Badge Toggle */}
                                  <button
                                    type="button"
                                    onClick={() => handleToggleLessonPublish(lesson)}
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors ${
                                      lesson.is_published
                                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                                        : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                                    }`}
                                    title="اضغط لتبديل حالة النشر"
                                  >
                                    {lesson.is_published ? (
                                      <>
                                        <Eye className="w-3 h-3" />
                                        <span>منشور</span>
                                      </>
                                    ) : (
                                      <>
                                        <EyeOff className="w-3 h-3" />
                                        <span>مسودة</span>
                                      </>
                                    )}
                                  </button>
                                </div>

                                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                                  {durationMins && (
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      <span>{durationMins} دقيقة</span>
                                    </span>
                                  )}

                                  {lesson.video_id ? (
                                    <span className="flex items-center gap-1 text-red-500 font-mono">
                                      <Youtube className="w-3 h-3 fill-current" />
                                      <span>ID: {lesson.video_id}</span>
                                    </span>
                                  ) : (
                                    <span className="text-amber-600 dark:text-amber-400">
                                      لم يتم إرفاق فيديو
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                              {/* Video Attachment Button */}
                              <Button
                                type="button"
                                size="sm"
                                variant={lesson.video_id ? "secondary" : "outline"}
                                onClick={() => setVideoPickerLesson(lesson)}
                                className={`min-h-[38px] text-xs font-bold gap-1 px-2.5 ${
                                  !lesson.video_id
                                    ? "border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10"
                                    : ""
                                }`}
                                title="إرفاق أو تغيير فيديو اليوتيوب"
                              >
                                <Youtube className="w-3.5 h-3.5 fill-current" />
                                <span>{lesson.video_id ? "تغيير الفيديو" : "إرفاق فيديو"}</span>
                              </Button>

                              {/* Task Editor Trigger */}
                              <Button
                                type="button"
                                size="sm"
                                variant={lesson.task ? "secondary" : "outline"}
                                onClick={() => setTaskEditorLesson(lesson)}
                                className="min-h-[38px] text-xs font-bold gap-1 px-2.5 border-primary/30 text-primary hover:bg-primary/10"
                                title="إعداد المهمة التفاعلية للدرس"
                              >
                                <FileQuestion className="w-3.5 h-3.5" />
                                <span>{lesson.task ? "تعديل المهمة" : "إضافة مهمة"}</span>
                              </Button>

                              {/* Move Up */}
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                disabled={!canMoveUp(lIndex) || isMutating}
                                onClick={() => handleMoveLesson(section.id, lIndex, "up")}
                                className="w-8 h-8 text-muted-foreground hover:text-foreground"
                                title="تحريك الدرس لأعلى"
                                aria-label="تحريك الدرس لأعلى"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </Button>

                              {/* Move Down */}
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                disabled={!canMoveDown(lIndex, lessons.length) || isMutating}
                                onClick={() => handleMoveLesson(section.id, lIndex, "down")}
                                className="w-8 h-8 text-muted-foreground hover:text-foreground"
                                title="تحريك الدرس لأسفل"
                                aria-label="تحريك الدرس لأسفل"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </Button>

                              {/* Edit Lesson */}
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                onClick={() => {
                                  setEditingLesson({ lesson, sectionId: section.id });
                                  setEditLessonTitle(lesson.title);
                                  setEditLessonDuration(
                                    lesson.duration ? Math.round(lesson.duration / 60) : 10,
                                  );
                                }}
                                className="w-8 h-8 text-muted-foreground hover:text-foreground"
                                title="تعديل الدرس"
                                aria-label="تعديل الدرس"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </Button>

                              {/* Delete Lesson */}
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDeleteLesson(lesson)}
                                className="w-8 h-8 text-muted-foreground hover:text-destructive"
                                title="حذف الدرس"
                                aria-label="حذف الدرس"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Add Section */}
      <Modal isOpen={isAddSectionOpen} onClose={() => setIsAddSectionOpen(false)}>
        <ModalHeader title="إضافة قسم جديد في المنهج" description="أدخل عنوان القسم التعليمي الجديد" />
        <form onSubmit={handleCreateSection}>
          <ModalBody className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-section-title" className="text-xs font-bold text-foreground">
                عنوان القسم *
              </Label>
              <Input
                id="new-section-title"
                type="text"
                placeholder="مثال: مقدمة في بنية المشروع والـ State"
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                className="min-h-[44px]"
                autoFocus
                required
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddSectionOpen(false)}
              className="min-h-[44px]"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isMutating || !newSectionTitle.trim()}
              className="min-h-[44px] font-bold"
            >
              {isMutating ? <Loader2 className="w-4 h-4 animate-spin" /> : "إضافة القسم"}
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Modal: Edit Section */}
      <Modal isOpen={Boolean(editingSection)} onClose={() => setEditingSection(null)}>
        <ModalHeader title="تعديل عنوان القسم" description="تحديث العنوان الظاهر للطلاب في شجرة المنهج" />
        <form onSubmit={handleUpdateSection}>
          <ModalBody className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-section-title" className="text-xs font-bold text-foreground">
                عنوان القسم *
              </Label>
              <Input
                id="edit-section-title"
                type="text"
                value={editSectionTitle}
                onChange={(e) => setEditSectionTitle(e.target.value)}
                className="min-h-[44px]"
                autoFocus
                required
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingSection(null)}
              className="min-h-[44px]"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isMutating || !editSectionTitle.trim()}
              className="min-h-[44px] font-bold"
            >
              {isMutating ? <Loader2 className="w-4 h-4 animate-spin" /> : "حفظ التعديل"}
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Modal: Add Lesson */}
      <Modal
        isOpen={Boolean(activeSectionForNewLesson)}
        onClose={() => setActiveSectionForNewLesson(null)}
      >
        <ModalHeader title="إضافة درس جديد" description="حدد عنوان الدرس والمدة التقديرية بالدقائق" />
        <form onSubmit={handleCreateLesson}>
          <ModalBody className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-lesson-title" className="text-xs font-bold text-foreground">
                عنوان الدرس *
              </Label>
              <Input
                id="new-lesson-title"
                type="text"
                placeholder="مثال: تثبيت البيئة وبناء أول مكون"
                value={newLessonTitle}
                onChange={(e) => setNewLessonTitle(e.target.value)}
                className="min-h-[44px]"
                autoFocus
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-lesson-duration" className="text-xs font-bold text-foreground">
                المدة التقديرية (دقيقة)
              </Label>
              <Input
                id="new-lesson-duration"
                type="number"
                min="1"
                max="600"
                value={newLessonDuration}
                onChange={(e) => setNewLessonDuration(Number(e.target.value) || 1)}
                className="min-h-[44px]"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setActiveSectionForNewLesson(null)}
              className="min-h-[44px]"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isMutating || !newLessonTitle.trim()}
              className="min-h-[44px] font-bold"
            >
              {isMutating ? <Loader2 className="w-4 h-4 animate-spin" /> : "إضافة الدرس"}
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Modal: Edit Lesson */}
      <Modal isOpen={Boolean(editingLesson)} onClose={() => setEditingLesson(null)}>
        <ModalHeader title="تعديل بيانات الدرس" description="تحديث العنوان والمدة التقديرية" />
        <form onSubmit={handleUpdateLesson}>
          <ModalBody className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-lesson-title" className="text-xs font-bold text-foreground">
                عنوان الدرس *
              </Label>
              <Input
                id="edit-lesson-title"
                type="text"
                value={editLessonTitle}
                onChange={(e) => setEditLessonTitle(e.target.value)}
                className="min-h-[44px]"
                autoFocus
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-lesson-duration" className="text-xs font-bold text-foreground">
                المدة التقديرية (دقيقة)
              </Label>
              <Input
                id="edit-lesson-duration"
                type="number"
                min="1"
                max="600"
                value={editLessonDuration}
                onChange={(e) => setEditLessonDuration(Number(e.target.value) || 1)}
                className="min-h-[44px]"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingLesson(null)}
              className="min-h-[44px]"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isMutating || !editLessonTitle.trim()}
              className="min-h-[44px] font-bold"
            >
              {isMutating ? <Loader2 className="w-4 h-4 animate-spin" /> : "حفظ التعديل"}
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Modal: Video Picker */}
      {videoPickerLesson && (
        <InstructorCurriculumVideoPickerModal
          courseId={courseId}
          lessonTitle={videoPickerLesson.title}
          isOpen={Boolean(videoPickerLesson)}
          onClose={() => setVideoPickerLesson(null)}
          onSelectVideo={handleVideoAttached}
        />
      )}

      {/* Modal: Task Editor */}
      {taskEditorLesson && (
        <InstructorLessonTaskEditor
          lessonId={taskEditorLesson.id}
          lessonTitle={taskEditorLesson.title}
          courseId={courseId}
          isOpen={Boolean(taskEditorLesson)}
          onClose={() => setTaskEditorLesson(null)}
        />
      )}
    </div>
  );
}

function CurriculumSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-14 bg-muted rounded-2xl" />
      <div className="space-y-3">
        <div className="h-28 bg-muted rounded-2xl" />
        <div className="h-28 bg-muted rounded-2xl" />
      </div>
    </div>
  );
}
