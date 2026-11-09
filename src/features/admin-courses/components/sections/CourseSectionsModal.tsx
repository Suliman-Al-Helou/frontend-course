"use client";

import { useState, useRef } from "react";
import { X, Plus, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { adminCourseQueries } from "../../queries/adminCourses.queries";
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
  const {
    createSection,
    deleteSection,
    createLesson,
    updateLesson,
    deleteLesson,
  } = useSectionMutations(course.id);

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

  const handleUpdateLesson = async (
    lessonId: number | string,
    data: Partial<AdminLesson>
  ) => {
    await updateLesson.mutateAsync({ lessonId, data });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-sections-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      dir="rtl"
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border shrink-0 bg-muted/10">
          <div>
            <h2 id="course-sections-title" className="font-bold text-foreground text-base">
              إدارة محتوى ومنهج الكورس
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">{course.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="إغلاق النافذة"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
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
                />
              ))}
            </div>
          )}

          {/* New Section Input */}
          <form
            onSubmit={handleAddSection}
            className="flex items-center gap-2 pt-3 border-t border-border mt-4"
          >
            <input
              placeholder="عنوان القسم الجديد (مثال: الوحدة الأولى: مقدمة في المسار)..."
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              className="flex-1 h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <Button
              type="submit"
              disabled={createSection.isPending || !newSectionTitle.trim()}
              className="h-10 px-4 rounded-xl bg-primary text-primary-foreground font-medium text-xs shrink-0"
            >
              <Plus className="w-4 h-4 ml-1" />
              {createSection.isPending ? "جارٍ الإضافة..." : "إضافة قسم"}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/10 flex justify-end shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-xl h-10 px-6 text-sm"
          >
            إغلاق
          </Button>
        </div>
      </div>
    </div>
  );
}

