"use client";

import React, { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Loader2, AlertCircle, FolderPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  instructorPortalQueries,
  instructorPortalKeys,
} from "../queries/instructor-portal.queries";
import {
  useCreateInstructorSection,
  useUpdateInstructorSection,
  useDeleteInstructorSection,
  useCreateInstructorLesson,
  useUpdateInstructorLesson,
  useDeleteInstructorLesson,
} from "../queries/instructor-portal.mutations";
import { swapArrayItems } from "../utils";
import { InstructorCurriculumSectionItem } from "./InstructorCurriculumSectionItem";
import { InstructorCurriculumModals } from "./InstructorCurriculumModals";
import { InstructorCurriculumVideoPickerModal } from "./InstructorCurriculumVideoPickerModal";
import { InstructorLessonTaskEditor } from "./InstructorLessonTaskEditor";
import type { InstructorCourse, InstructorSection, InstructorLesson } from "../types";

interface InstructorCurriculumViewProps {
  courseId: number | string;
  course: InstructorCourse;
}

export function InstructorCurriculumView({ courseId }: InstructorCurriculumViewProps) {
  const queryClient = useQueryClient();

  // Accordion open/collapse map
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({});

  // Section Modals
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [sectionError, setSectionError] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<InstructorSection | null>(null);
  const [editSectionTitle, setEditSectionTitle] = useState("");

  // Lesson Modals
  const [activeSectionForNewLesson, setActiveSectionForNewLesson] = useState<number | null>(null);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonDuration, setNewLessonDuration] = useState(10);
  const [newLessonIsPreview, setNewLessonIsPreview] = useState(false);

  const [editingLesson, setEditingLesson] = useState<{
    lesson: InstructorLesson;
    sectionId: number | string;
  } | null>(null);
  const [editLessonTitle, setEditLessonTitle] = useState("");
  const [editLessonDuration, setEditLessonDuration] = useState(10);
  const [editLessonIsPreview, setEditLessonIsPreview] = useState(false);

  // Video Picker Modal State
  const [videoPickerLesson, setVideoPickerLesson] = useState<InstructorLesson | null>(null);

  // Task Editor Modal State
  const [taskEditorLesson, setTaskEditorLesson] = useState<InstructorLesson | null>(null);

  // Confirm Delete Modal State
  const [confirmDeleteTarget, setConfirmDeleteTarget] = useState<
    { type: "section"; item: InstructorSection } | { type: "lesson"; item: InstructorLesson } | null
  >(null);

  const [isMutating, setIsMutating] = useState(false);
  const isSubmittingRef = useRef(false);

  // Mutation Hooks
  const createSectionMutation = useCreateInstructorSection();
  const updateSectionMutation = useUpdateInstructorSection();
  const deleteSectionMutation = useDeleteInstructorSection();
  const createLessonMutation = useCreateInstructorLesson();
  const updateLessonMutation = useUpdateInstructorLesson();
  const deleteLessonMutation = useDeleteInstructorLesson();

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
    if (newSectionTitle.trim().length < 2) {
      setSectionError("يجب أن يتكون عنوان الفصل من حرفين على الأقل");
      return;
    }
    setSectionError(null);
    isSubmittingRef.current = true;
    setIsMutating(true);

    try {
      await createSectionMutation.mutateAsync({
        courseId,
        payload: {
          title: newSectionTitle.trim(),
          order: sections.length + 1,
        },
      });

      toast.success("تم إنشاء القسم بنجاح");
      setNewSectionTitle("");
      setSectionError(null);
      setIsAddSectionOpen(false);
    } catch (err: unknown) {
      const apiErr = err as {
        response?: { data?: { message?: string; errors?: Record<string, string[]> } };
      };
      const errorMsg =
        apiErr?.response?.data?.errors?.title?.[0] ||
        apiErr?.response?.data?.message ||
        (err instanceof Error ? err.message : "فشل إنشاء القسم");
      setSectionError(errorMsg);
      toast.error(errorMsg);
    } finally {
      isSubmittingRef.current = false;
      setIsMutating(false);
    }
  };

  // Section Updating
  const handleUpdateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current || !editingSection || !editSectionTitle.trim()) return;

    isSubmittingRef.current = true;
    setIsMutating(true);

    try {
      await updateSectionMutation.mutateAsync({
        sectionId: editingSection.id,
        courseId,
        payload: { title: editSectionTitle.trim() },
      });

      toast.success("تم تحديث عنوان القسم بنجاح");
      setEditingSection(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل تحديث عنوان القسم");
    } finally {
      isSubmittingRef.current = false;
      setIsMutating(false);
    }
  };

  // Section Deletion (Enforcing Empty Section Guard)
  const handleDeleteSection = (section: InstructorSection) => {
    if (isSubmittingRef.current) return;
    const lessonCount = section.lessons?.length ?? 0;
    if (lessonCount > 0) {
      toast.error("لا يمكن حذف قسم يحتوي على دروس. يرجى حذف أو نقل الدروس أولاً.");
      return;
    }
    setConfirmDeleteTarget({ type: "section", item: section });
  };

  // Lesson Deletion
  const handleDeleteLesson = (lesson: InstructorLesson) => {
    if (isSubmittingRef.current) return;
    setConfirmDeleteTarget({ type: "lesson", item: lesson });
  };

  const executeConfirmDelete = async () => {
    if (!confirmDeleteTarget || isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setIsMutating(true);

    try {
      if (confirmDeleteTarget.type === "section") {
        await deleteSectionMutation.mutateAsync({
          sectionId: confirmDeleteTarget.item.id,
          courseId,
        });
        toast.success("تم حذف القسم بنجاح");
      } else {
        await deleteLessonMutation.mutateAsync({
          lessonId: confirmDeleteTarget.item.id,
          courseId,
        });
        toast.success("تم حذف الدرس بنجاح");
      }
      setConfirmDeleteTarget(null);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : confirmDeleteTarget.type === "section"
            ? "فشل حذف القسم (قد يحتوي على دروس بها تقدم للطلاب)"
            : "لا يمكن حذف درس به سجلات تقدم مكتملة للطلاب",
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
        updateSectionMutation.mutateAsync({
          sectionId: currentSection.id,
          payload: { order: targetIndex + 1 },
        }),
        updateSectionMutation.mutateAsync({
          sectionId: targetSection.id,
          payload: { order: index + 1 },
        }),
      ]);
      await queryClient.invalidateQueries({
        queryKey: instructorPortalKeys.sections(courseId),
      });
      toast.success("تم تحديث ترتيب الأقسام");
    } catch (_err) {
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
      await createLessonMutation.mutateAsync({
        sectionId: activeSectionForNewLesson,
        courseId,
        payload: {
          title: newLessonTitle.trim(),
          duration: Number(newLessonDuration) * 60,
          order: currentLessonsCount + 1,
          is_preview: newLessonIsPreview,
          is_published: true,
        },
      });

      toast.success("تم إنشاء الدرس بنجاح");
      setNewLessonTitle("");
      setNewLessonIsPreview(false);
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
      await updateLessonMutation.mutateAsync({
        lessonId: editingLesson.lesson.id,
        courseId,
        payload: {
          title: editLessonTitle.trim(),
          duration: Number(editLessonDuration) * 60,
          is_preview: editLessonIsPreview,
        },
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
      await updateLessonMutation.mutateAsync({
        lessonId: lesson.id,
        courseId,
        payload: {
          is_published: !lesson.is_published,
        },
      });

      toast.success(lesson.is_published ? "تم تحويل الدرس إلى مسودة" : "تم نشر الدرس بنجاح");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل تحديث حالة النشر");
    } finally {
      isSubmittingRef.current = false;
    }
  };

  // Lesson Directional Arrow Ordering
  const handleMoveLesson = async (
    sectionId: number | string,
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

    // Optimistic cache update
    const previous = queryClient.getQueryData<InstructorSection[]>(
      instructorPortalKeys.sections(courseId),
    );
    const swappedLessons = swapArrayItems(lessons, lessonIndex, targetIndex).map((l, idx) => ({
      ...l,
      order: idx + 1,
    }));

    queryClient.setQueryData<InstructorSection[]>(
      instructorPortalKeys.sections(courseId),
      (old) => old?.map((s) => (s.id === sectionId ? { ...s, lessons: swappedLessons } : s)) ?? [],
    );

    try {
      await Promise.all([
        updateLessonMutation.mutateAsync({
          lessonId: currentLesson.id,
          payload: { order: targetIndex + 1 },
        }),
        updateLessonMutation.mutateAsync({
          lessonId: targetLesson.id,
          payload: { order: lessonIndex + 1 },
        }),
      ]);
      await queryClient.invalidateQueries({
        queryKey: instructorPortalKeys.sections(courseId),
      });
      toast.success("تم تحديث ترتيب الدروس");
    } catch (_err) {
      queryClient.setQueryData(instructorPortalKeys.sections(courseId), previous);
      toast.error("فشل حفظ ترتيب الدروس الجديد");
    } finally {
      isSubmittingRef.current = false;
      setIsMutating(false);
    }
  };

  // Loading Skeleton State
  if (isLoading) {
    return (
      <div className="space-y-4 py-6" aria-busy="true">
        <div className="flex items-center justify-between">
          <div className="h-6 w-48 bg-muted animate-pulse rounded" />
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 bg-muted/60 animate-pulse rounded-xl border border-border"
            />
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="p-6 rounded-2xl border border-destructive/20 bg-destructive/5 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-destructive mx-auto" />
        <div className="space-y-1">
          <h3 className="text-base font-bold text-foreground">فشل في تحميل هيكل المنهج الدراسي</h3>
          <p className="text-sm text-muted-foreground">
            {error instanceof Error ? error.message : "حدث خطأ غير متوقع أثناء الاتصال بالخادم."}
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline" className="min-h-[44px]">
          إعادة المحاولة
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Curriculum Workspace Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">هيكل المنهج والدروس</h2>
          <p className="text-sm text-muted-foreground">
            تنظيم الفصول والدروس وإعداد الاختبارات والمهام التفاعلية وربط فيديوهات المحاضرات
          </p>
        </div>

        <Button
          onClick={() => {
            setNewSectionTitle("");
            setSectionError(null);
            setIsAddSectionOpen(true);
          }}
          className="min-h-[44px] min-w-[44px] gap-2 font-bold shrink-0 self-stretch sm:self-auto px-4"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة وحدة جديدة</span>
        </Button>
      </div>

      {/* Sections List or Empty State */}
      {sections.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-dashed border-border p-8 space-y-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <FolderPlus className="w-6 h-6" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-base font-bold text-foreground">
              لم تقم بإضافة أي فصول أو وحدات بعد
            </h3>
            <p className="text-sm text-muted-foreground">
              ابدأ بإنشاء الوحدة الأولى لتتمكن من إضافة الدروس وربط مقاطع الفيديو والمهام التفاعلية.
            </p>
          </div>
          <Button
            onClick={() => setIsAddSectionOpen(true)}
            className="min-h-[44px] min-w-[44px] gap-2 font-bold px-4"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة أول وحدة الآن</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section, sIndex) => {
            const isSectionOpen = openSections[section.id] ?? true;

            return (
              <InstructorCurriculumSectionItem
                key={section.id}
                section={section}
                sIndex={sIndex}
                totalSections={sections.length}
                isOpen={isSectionOpen}
                onToggleOpen={toggleSection}
                onEditSection={(sec) => {
                  setEditingSection(sec);
                  setEditSectionTitle(sec.title);
                }}
                onDeleteSection={handleDeleteSection}
                onMoveSection={handleMoveSection}
                onAddLesson={(secId) => {
                  setActiveSectionForNewLesson(secId);
                  setNewLessonTitle("");
                  setNewLessonDuration(10);
                  setNewLessonIsPreview(false);
                }}
                onEditLesson={(les, secId) => {
                  setEditingLesson({ lesson: les, sectionId: secId });
                  setEditLessonTitle(les.title);
                  setEditLessonDuration(Math.round((les.duration || 0) / 60) || 10);
                  setEditLessonIsPreview(Boolean(les.is_preview));
                }}
                onDeleteLesson={handleDeleteLesson}
                onMoveLesson={handleMoveLesson}
                onTogglePublish={handleToggleLessonPublish}
                onOpenVideoPicker={(les) => setVideoPickerLesson(les)}
                onOpenTaskEditor={(les) => setTaskEditorLesson(les)}
                isMutating={isMutating}
              />
            );
          })}
        </div>
      )}

      {/* Curriculum Modals */}
      <InstructorCurriculumModals
        isAddSectionOpen={isAddSectionOpen}
        onCloseAddSection={() => {
          setIsAddSectionOpen(false);
          setSectionError(null);
        }}
        newSectionTitle={newSectionTitle}
        setNewSectionTitle={setNewSectionTitle}
        sectionError={sectionError}
        onSubmitCreateSection={handleCreateSection}
        editingSection={editingSection}
        onCloseEditSection={() => setEditingSection(null)}
        editSectionTitle={editSectionTitle}
        setEditSectionTitle={setEditSectionTitle}
        onSubmitUpdateSection={handleUpdateSection}
        activeSectionForNewLesson={activeSectionForNewLesson}
        onCloseAddLesson={() => setActiveSectionForNewLesson(null)}
        newLessonTitle={newLessonTitle}
        setNewLessonTitle={setNewLessonTitle}
        newLessonDuration={newLessonDuration}
        setNewLessonDuration={setNewLessonDuration}
        newLessonIsPreview={newLessonIsPreview}
        setNewLessonIsPreview={setNewLessonIsPreview}
        onSubmitCreateLesson={handleCreateLesson}
        editingLesson={editingLesson}
        onCloseEditLesson={() => setEditingLesson(null)}
        editLessonTitle={editLessonTitle}
        setEditLessonTitle={setEditLessonTitle}
        editLessonDuration={editLessonDuration}
        setEditLessonDuration={setEditLessonDuration}
        editLessonIsPreview={editLessonIsPreview}
        setEditLessonIsPreview={setEditLessonIsPreview}
        onSubmitUpdateLesson={handleUpdateLesson}
        confirmDeleteTarget={confirmDeleteTarget}
        onCloseConfirmDelete={() => setConfirmDeleteTarget(null)}
        onExecuteConfirmDelete={executeConfirmDelete}
        isMutating={isMutating}
      />

      {/* Video Picker Modal */}
      {videoPickerLesson && (
        <InstructorCurriculumVideoPickerModal
          isOpen={Boolean(videoPickerLesson)}
          onClose={() => setVideoPickerLesson(null)}
          courseId={courseId}
          lessonTitle={videoPickerLesson.title}
          onSelectVideo={async (video) => {
            await updateLessonMutation.mutateAsync({
              lessonId: videoPickerLesson.id,
              courseId,
              payload: {
                video_id: video.id,
                duration: video.duration_minutes * 60,
              },
            });
            toast.success("تم ربط فيديو الدرس بنجاح");
            setVideoPickerLesson(null);
          }}
        />
      )}

      {/* Interactive Task Editor Modal */}
      {taskEditorLesson && (
        <InstructorLessonTaskEditor
          isOpen={Boolean(taskEditorLesson)}
          onClose={() => setTaskEditorLesson(null)}
          courseId={courseId}
          lessonId={taskEditorLesson.id}
          lessonTitle={taskEditorLesson.title}
        />
      )}
    </div>
  );
}
