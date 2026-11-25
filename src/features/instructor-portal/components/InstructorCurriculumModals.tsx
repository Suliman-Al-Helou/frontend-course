"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ConfirmModal from "@/components/shared/ConfirmModal";
import type { InstructorSection, InstructorLesson } from "../types";

export interface InstructorCurriculumModalsProps {
  // Add Section Modal
  isAddSectionOpen: boolean;
  onCloseAddSection: () => void;
  newSectionTitle: string;
  setNewSectionTitle: (val: string) => void;
  sectionError: string | null;
  onSubmitCreateSection: (e: React.FormEvent) => void;

  // Edit Section Modal
  editingSection: InstructorSection | null;
  onCloseEditSection: () => void;
  editSectionTitle: string;
  setEditSectionTitle: (val: string) => void;
  onSubmitUpdateSection: (e: React.FormEvent) => void;

  // Add Lesson Modal
  activeSectionForNewLesson: number | null;
  onCloseAddLesson: () => void;
  newLessonTitle: string;
  setNewLessonTitle: (val: string) => void;
  newLessonDuration: number;
  setNewLessonDuration: (val: number) => void;
  newLessonIsPreview: boolean;
  setNewLessonIsPreview: (val: boolean) => void;
  onSubmitCreateLesson: (e: React.FormEvent) => void;

  // Edit Lesson Modal
  editingLesson: {
    lesson: InstructorLesson;
    sectionId: number | string;
  } | null;
  onCloseEditLesson: () => void;
  editLessonTitle: string;
  setEditLessonTitle: (val: string) => void;
  editLessonDuration: number;
  setEditLessonDuration: (val: number) => void;
  editLessonIsPreview: boolean;
  setEditLessonIsPreview: (val: boolean) => void;
  onSubmitUpdateLesson: (e: React.FormEvent) => void;

  // Confirm Delete Modal
  confirmDeleteTarget:
    | { type: "section"; item: InstructorSection }
    | { type: "lesson"; item: InstructorLesson }
    | null;
  onCloseConfirmDelete: () => void;
  onExecuteConfirmDelete: () => void;

  isMutating: boolean;
}

export function InstructorCurriculumModals({
  isAddSectionOpen,
  onCloseAddSection,
  newSectionTitle,
  setNewSectionTitle,
  sectionError,
  onSubmitCreateSection,
  editingSection,
  onCloseEditSection,
  editSectionTitle,
  setEditSectionTitle,
  onSubmitUpdateSection,
  activeSectionForNewLesson,
  onCloseAddLesson,
  newLessonTitle,
  setNewLessonTitle,
  newLessonDuration,
  setNewLessonDuration,
  newLessonIsPreview,
  setNewLessonIsPreview,
  onSubmitCreateLesson,
  editingLesson,
  onCloseEditLesson,
  editLessonTitle,
  setEditLessonTitle,
  editLessonDuration,
  setEditLessonDuration,
  editLessonIsPreview,
  setEditLessonIsPreview,
  onSubmitUpdateLesson,
  confirmDeleteTarget,
  onCloseConfirmDelete,
  onExecuteConfirmDelete,
  isMutating,
}: InstructorCurriculumModalsProps) {
  return (
    <>
      {/* Modal: Add Section */}
      <Modal isOpen={isAddSectionOpen} onClose={onCloseAddSection}>
        <ModalHeader
          title="إضافة وحدة / قسم جديد"
          description="أدخل عنوان الوحدة التعليمية لتنظيم دروس المقرر"
        />
        <form onSubmit={onSubmitCreateSection}>
          <ModalBody className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-section-title" className="text-xs font-bold text-foreground">
                عنوان الوحدة *
              </Label>
              <Input
                id="new-section-title"
                type="text"
                placeholder="مثال: مقدمة في بنية المشروع والأساسيات"
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                className="min-h-[44px]"
                autoFocus
                required
              />
              {sectionError && (
                <p className="text-xs text-destructive font-medium">{sectionError}</p>
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onCloseAddSection}
              className="min-h-[44px]"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isMutating || !newSectionTitle.trim()}
              className="min-h-[44px] font-bold"
            >
              {isMutating ? <Loader2 className="w-4 h-4 animate-spin" /> : "إنشاء الوحدة"}
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Modal: Edit Section */}
      <Modal isOpen={Boolean(editingSection)} onClose={onCloseEditSection}>
        <ModalHeader title="تعديل عنوان الوحدة" description="تحديث الاسم التعريفي لهذه الوحدة" />
        <form onSubmit={onSubmitUpdateSection}>
          <ModalBody className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-section-title" className="text-xs font-bold text-foreground">
                عنوان الوحدة *
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
              onClick={onCloseEditSection}
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
      <Modal isOpen={Boolean(activeSectionForNewLesson)} onClose={onCloseAddLesson}>
        <ModalHeader
          title="إضافة درس جديد"
          description="حدد عنوان الدرس والمدة التقديرية وخاصية المعاينة المجانية"
        />
        <form onSubmit={onSubmitCreateLesson}>
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

            {/* Lesson Preview State Checkbox */}
            <div className="flex items-center gap-2.5 pt-2 border-t border-border/60">
              <input
                id="new-lesson-preview"
                type="checkbox"
                checked={newLessonIsPreview}
                onChange={(e) => setNewLessonIsPreview(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
              />
              <Label
                htmlFor="new-lesson-preview"
                className="text-xs font-semibold text-foreground cursor-pointer select-none"
              >
                معاينة مجانية (درس متاح للزوار قبل الاشتراك في المقرر)
              </Label>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onCloseAddLesson}
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
      <Modal isOpen={Boolean(editingLesson)} onClose={onCloseEditLesson}>
        <ModalHeader
          title="تعديل بيانات الدرس"
          description="تحديث العنوان والمدة وخاصية المعاينة المجانية"
        />
        <form onSubmit={onSubmitUpdateLesson}>
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

            {/* Lesson Preview State Checkbox */}
            <div className="flex items-center gap-2.5 pt-2 border-t border-border/60">
              <input
                id="edit-lesson-preview"
                type="checkbox"
                checked={editLessonIsPreview}
                onChange={(e) => setEditLessonIsPreview(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
              />
              <Label
                htmlFor="edit-lesson-preview"
                className="text-xs font-semibold text-foreground cursor-pointer select-none"
              >
                معاينة مجانية (درس متاح للزوار قبل الاشتراك في المقرر)
              </Label>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onCloseEditLesson}
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

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={Boolean(confirmDeleteTarget)}
        title={confirmDeleteTarget?.type === "section" ? "حذف الوحدة بالكامل" : "حذف الدرس"}
        description={
          confirmDeleteTarget?.type === "section"
            ? `هل أنت متأكد من رغبتك في حذف الوحدة "${confirmDeleteTarget?.item.title}"؟ لا يمكن حذف وحدة تحتوي على دروس.`
            : `هل أنت متأكد من رغبتك في حذف الدرس "${confirmDeleteTarget?.item.title}"؟ سيتم حذف أي محتوى وفيديوهات مرتبطة به.`
        }
        confirmText="تأكيد الحذف"
        cancelText="إلغاء"
        variant="destructive"
        onConfirm={onExecuteConfirmDelete}
        onClose={onCloseConfirmDelete}
      />
    </>
  );
}
