"use client";

import { useState, useRef } from "react";
import { ChevronDown, Trash2, FolderOpen, Folder, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import LessonRow from "./LessonRow";
import CurriculumVideoPickerModal from "./CurriculumVideoPickerModal";
import type { AdminSection, AdminLesson, AdminVideoAsset, AdminCourse } from "../../types";

interface Props {
  section: AdminSection;
  isOpen: boolean;
  onToggle: () => void;
  onDeleteSection: () => Promise<unknown>;
  onCreateLesson: (data: {
    title: string;
    video_id: string;
    duration: number;
    order: number;
    is_preview: boolean;
  }) => Promise<unknown>;
  onUpdateLesson: (lessonId: number | string, data: Partial<AdminLesson>) => Promise<unknown>;
  onDeleteLesson: (lessonId: number | string) => Promise<unknown>;
  courseVideos?: AdminVideoAsset[];
  course?: AdminCourse;
}

export default function SectionAccordion({
  section,
  isOpen,
  onToggle,
  onDeleteSection,
  onCreateLesson,
  onUpdateLesson,
  onDeleteLesson,
  course,
}: Props) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showVideoPicker, setShowVideoPicker] = useState(false);

  const isDeletingSectionRef = useRef(false);

  const handleDeleteSectionConfirm = async () => {
    if (isDeletingSectionRef.current) return;
    isDeletingSectionRef.current = true;
    try {
      await onDeleteSection();
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error("فشل حذف القسم:", err);
    } finally {
      isDeletingSectionRef.current = false;
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs transition-all">
      {/* Section Header */}
      <div className="p-4 flex items-center justify-between gap-3 bg-muted/20">
        <Button
          variant="ghost"
          onClick={onToggle}
          className="flex items-center gap-3 flex-1 h-auto p-0 text-right hover:bg-transparent focus:outline-none"
          aria-expanded={isOpen}
          aria-controls={`section-content-${section.id}`}
        >
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            {isOpen ? <FolderOpen className="w-4 h-4" /> : <Folder className="w-4 h-4" />}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-foreground text-sm truncate">{section.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{section.lessons.length} درس</p>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground mr-auto transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </Button>

        {/* Section Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              if (!isOpen) onToggle();
              setShowVideoPicker(true);
            }}
            className="rounded-xl h-8 px-2.5 text-xs font-medium gap-1.5 border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
          >
            <Youtube className="w-3.5 h-3.5 fill-current" /> إضافة درس
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-xl h-8 w-8 p-0 text-destructive/80 hover:text-destructive hover:bg-destructive/10"
            aria-label="حذف القسم"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Delete Section Confirmation */}
      {showDeleteConfirm && (
        <div className="p-3 bg-destructive/10 border-t border-destructive/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <span className="text-destructive font-medium">
            حذف هذا القسم سيحذف جميع الدروس ({section.lessons.length}) التابعة له. هل أنت متأكد؟
          </span>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteConfirm(false)}
              className="h-7 text-xs px-2.5 rounded-lg"
            >
              إلغاء
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => void handleDeleteSectionConfirm()}
              className="h-7 text-xs px-2.5 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg"
            >
              تأكيد حذف القسم
            </Button>
          </div>
        </div>
      )}

      {/* Section Collapsible Body */}
      {isOpen && (
        <div
          id={`section-content-${section.id}`}
          className="p-4 space-y-3 border-t border-border bg-background/50"
        >
          {/* Lessons List */}
          {section.lessons.length === 0 ? (
            <div className="text-center py-8 bg-muted/10 rounded-xl border border-dashed border-border p-4 space-y-2">
              <p className="text-xs text-muted-foreground">لا توجد دروس في هذا القسم بعد.</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowVideoPicker(true)}
                className="h-8 text-xs px-3 gap-1.5 border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 rounded-lg mx-auto"
              >
                <Youtube className="w-3.5 h-3.5 fill-current" />
                <span>إضافة درس من فيديوهات يوتيوب</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {section.lessons.map((lesson) => (
                <LessonRow
                  key={lesson.id}
                  lesson={lesson}
                  onUpdate={(data) => onUpdateLesson(lesson.id, data)}
                  onDelete={() => onDeleteLesson(lesson.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {course && (
        <CurriculumVideoPickerModal
          course={course}
          sectionTitle={section.title}
          isOpen={showVideoPicker}
          onClose={() => setShowVideoPicker(false)}
          onAddLesson={async (video) => {
            await onCreateLesson({
              title: video.title,
              video_id: video.id,
              duration: video.duration_minutes,
              order: section.lessons.length,
              is_preview: false,
            });
          }}
        />
      )}
    </div>
  );
}
