"use client";

import { useState, useRef } from "react";
import { Plus, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
import { adminCourseQueries, adminVideoAssetQueries } from "../../queries/adminCourses.queries";
import { useSectionMutations } from "../../queries/adminCourses.mutations";
import SectionAccordion from "./SectionAccordion";
import type { AdminCourse, AdminLesson } from "../../types";

interface Props {
  course: AdminCourse;
  isOpen: boolean;
  onClose: () => void;
}

export default function CourseSectionsModal({ course, isOpen, onClose }: Props) {
  const [openSectionIdx, setOpenSectionIdx] = useState<number | null>(0);
  const [newSectionTitle, setNewSectionTitle] = useState("");

  const isAddingSectionRef = useRef(false);

  const { data: sections = [], isLoading } = useQuery(adminCourseQueries.sections(course.id));
  const { data: courseVideos = [] } = useQuery(
    adminVideoAssetQueries.list({ course_id: course.id }),
  );
  const { createSection, deleteSection, createLesson, updateLesson, deleteLesson } =
    useSectionMutations(course.id);

  if (!isOpen) return null;

  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAddingSectionRef.current || createSection.isPending || !newSectionTitle.trim()) {
      return;
    }

    isAddingSectionRef.current = true;
    try {
      await createSection.mutateAsync({
        title: newSectionTitle.trim(),
        order: sections.length,
      });
      setNewSectionTitle("");
      setOpenSectionIdx(sections.length);
    } catch (err) {
      console.error("فشل إضافة القسم:", err);
    } finally {
      isAddingSectionRef.current = false;
    }
  };

  const handleUpdateLesson = async (lessonId: number | string, data: Partial<AdminLesson>) => {
    await updateLesson.mutateAsync({ lessonId, data });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalHeader title="إدارة محتوى ومنهج الكورس" description={course.title} />

      <ModalBody className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : sections.length === 0 ? (
          <div className="text-center py-16 bg-muted/10 border border-dashed border-border rounded-2xl p-6">
            <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <h3 className="font-semibold text-foreground text-sm mb-1">
              لا توجد أي أقسام في هذا الكورس بعد
            </h3>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto mb-4">
              أدخل عنوان القسم الأول في الحقل أدناه لبدء تنظيم الدروس والمحتوى.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sections.map((section, idx) => (
              <SectionAccordion
                key={section.id}
                section={section}
                isOpen={openSectionIdx === idx}
                onToggle={() => setOpenSectionIdx(openSectionIdx === idx ? null : idx)}
                onDeleteSection={() => deleteSection.mutateAsync(section.id)}
                onCreateLesson={(lessonData) =>
                  createLesson.mutateAsync({
                    sectionId: section.id,
                    data: lessonData,
                  })
                }
                onUpdateLesson={handleUpdateLesson}
                onDeleteLesson={(lessonId) => deleteLesson.mutateAsync(lessonId)}
                courseVideos={courseVideos}
              />
            ))}
          </div>
        )}

        {/* New Section Input */}
        <form
          onSubmit={handleAddSection}
          className="flex items-center gap-2 pt-3 border-t border-border mt-4"
        >
          <Input
            placeholder="عنوان القسم الجديد (مثال: الوحدة الأولى: مقدمة في المسار)..."
            value={newSectionTitle}
            onChange={(e) => setNewSectionTitle(e.target.value)}
            className="flex-1"
          />
          <Button
            type="submit"
            loading={createSection.isPending}
            disabled={createSection.isPending || !newSectionTitle.trim()}
            className="shrink-0"
          >
            <Plus className="w-4 h-4 ml-1" />
            إضافة قسم
          </Button>
        </form>
      </ModalBody>

      <ModalFooter>
        <Button type="button" variant="outline" onClick={onClose} className="px-6">
          إغلاق
        </Button>
      </ModalFooter>
    </Modal>
  );
}
