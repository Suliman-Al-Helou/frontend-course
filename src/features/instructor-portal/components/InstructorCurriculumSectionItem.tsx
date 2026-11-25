"use client";

import React from "react";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Film,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { canMoveUp, canMoveDown } from "../utils";
import { InstructorCurriculumLessonItem } from "./InstructorCurriculumLessonItem";
import type { InstructorSection, InstructorLesson } from "../types";

interface InstructorCurriculumSectionItemProps {
  section: InstructorSection;
  sIndex: number;
  totalSections: number;
  isOpen: boolean;
  onToggleOpen: (sectionId: number) => void;
  onEditSection: (section: InstructorSection) => void;
  onDeleteSection: (section: InstructorSection) => void;
  onMoveSection: (index: number, direction: "up" | "down") => void;
  onAddLesson: (sectionId: number) => void;
  onEditLesson: (lesson: InstructorLesson, sectionId: number | string) => void;
  onDeleteLesson: (lesson: InstructorLesson) => void;
  onMoveLesson: (sectionId: number | string, lessonIndex: number, direction: "up" | "down") => void;
  onTogglePublish: (lesson: InstructorLesson) => void;
  onOpenVideoPicker: (lesson: InstructorLesson) => void;
  onOpenTaskEditor: (lesson: InstructorLesson) => void;
  isMutating: boolean;
}

export function InstructorCurriculumSectionItem({
  section,
  sIndex,
  totalSections,
  isOpen,
  onToggleOpen,
  onEditSection,
  onDeleteSection,
  onMoveSection,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,
  onMoveLesson,
  onTogglePublish,
  onOpenVideoPicker,
  onOpenTaskEditor,
  isMutating,
}: InstructorCurriculumSectionItemProps) {
  const lessons = section.lessons || [];
  const hasLessons = lessons.length > 0;

  return (
    <Card className="overflow-hidden border border-border/80 shadow-sm transition-all duration-200">
      {/* Section Header */}
      <div className="p-4 bg-muted/40 border-b border-border/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Accordion Expand/Collapse */}
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => onToggleOpen(section.id)}
            className="min-h-[44px] min-w-[44px] text-muted-foreground hover:text-foreground shrink-0"
            title={isOpen ? "طي هذا القسم" : "توسيع هذا القسم"}
            aria-label={isOpen ? "طي هذا القسم" : "توسيع هذا القسم"}
          >
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </Button>

          {/* Section Number & Title */}
          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-primary/10 text-primary">
                الوحدة {sIndex + 1}
              </span>
              <h3 className="text-base font-bold text-foreground truncate">{section.title}</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              {lessons.length === 0
                ? "لا توجد دروس مضافة في هذه الوحدة بعد"
                : `${lessons.length} ${lessons.length === 1 ? "درس" : "دروس"}`}
            </p>
          </div>
        </div>

        {/* Section Actions: >= 44x44px touch targets */}
        <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center flex-wrap">
          {/* Move Up */}
          <Button
            type="button"
            size="icon"
            variant="ghost"
            disabled={!canMoveUp(sIndex) || isMutating}
            onClick={() => onMoveSection(sIndex, "up")}
            className="min-h-[44px] min-w-[44px] text-muted-foreground hover:text-foreground disabled:opacity-30"
            title="تحريك القسم لأعلى"
            aria-label="تحريك القسم لأعلى"
          >
            <ArrowUp className="w-4 h-4" />
          </Button>

          {/* Move Down */}
          <Button
            type="button"
            size="icon"
            variant="ghost"
            disabled={!canMoveDown(sIndex, totalSections) || isMutating}
            onClick={() => onMoveSection(sIndex, "down")}
            className="min-h-[44px] min-w-[44px] text-muted-foreground hover:text-foreground disabled:opacity-30"
            title="تحريك القسم لأسفل"
            aria-label="تحريك القسم لأسفل"
          >
            <ArrowDown className="w-4 h-4" />
          </Button>

          {/* Edit Section */}
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => onEditSection(section)}
            className="min-h-[44px] min-w-[44px] text-muted-foreground hover:text-foreground"
            title="تعديل عنوان القسم"
            aria-label="تعديل عنوان القسم"
          >
            <Edit2 className="w-4 h-4" />
          </Button>

          {/* Delete Section: Enforce Empty Section Guard */}
          <Button
            type="button"
            size="icon"
            variant="ghost"
            disabled={hasLessons || isMutating}
            onClick={() => onDeleteSection(section)}
            className="min-h-[44px] min-w-[44px] text-muted-foreground hover:text-destructive disabled:opacity-30 disabled:cursor-not-allowed"
            title={
              hasLessons ? "لا يمكن حذف قسم يحتوي على دروس. يرجى حذف أو نقل الدروس أولاً" : "حذف القسم"
            }
            aria-label="حذف القسم"
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          {/* Add Lesson Button */}
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onAddLesson(section.id)}
            className="min-h-[44px] min-w-[44px] text-xs font-bold gap-1 ms-1 bg-background px-3"
            title="إضافة درس جديد في هذا القسم"
          >
            <Plus className="w-4 h-4" />
            <span>+ درس</span>
          </Button>
        </div>
      </div>

      {/* Section Accordion Body (Lessons) */}
      {isOpen && (
        <div className="p-4 space-y-3 bg-card/60">
          {lessons.length === 0 ? (
            <div className="py-8 text-center rounded-xl border border-dashed border-border/80 p-6 space-y-3">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
                <Film className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-foreground">لا توجد دروس في هذا القسم بعد</p>
                <p className="text-xs text-muted-foreground">
                  ابدأ بإضافة أول درس تعليمي لربط الفيديو والمهمة التفاعلية.
                </p>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={() => onAddLesson(section.id)}
                className="min-h-[44px] min-w-[44px] text-xs font-bold gap-1 mt-1 px-4"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة أول درس</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {lessons.map((lesson, lIndex) => (
                <InstructorCurriculumLessonItem
                  key={lesson.id}
                  lesson={lesson}
                  lIndex={lIndex}
                  totalLessons={lessons.length}
                  sectionId={section.id}
                  onEditLesson={onEditLesson}
                  onDeleteLesson={onDeleteLesson}
                  onMoveLesson={onMoveLesson}
                  onTogglePublish={onTogglePublish}
                  onOpenVideoPicker={onOpenVideoPicker}
                  onOpenTaskEditor={onOpenTaskEditor}
                  isMutating={isMutating}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
