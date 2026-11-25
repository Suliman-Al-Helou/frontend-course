"use client";

import React from "react";
import {
  ArrowUp,
  ArrowDown,
  Edit2,
  Trash2,
  Youtube,
  FileQuestion,
  Eye,
  EyeOff,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { canMoveUp, canMoveDown } from "../utils";
import type { InstructorLesson } from "../types";

interface InstructorCurriculumLessonItemProps {
  lesson: InstructorLesson;
  lIndex: number;
  totalLessons: number;
  sectionId: number | string;
  onEditLesson: (lesson: InstructorLesson, sectionId: number | string) => void;
  onDeleteLesson: (lesson: InstructorLesson) => void;
  onMoveLesson: (sectionId: number | string, lessonIndex: number, direction: "up" | "down") => void;
  onTogglePublish: (lesson: InstructorLesson) => void;
  onOpenVideoPicker: (lesson: InstructorLesson) => void;
  onOpenTaskEditor: (lesson: InstructorLesson) => void;
  isMutating: boolean;
}

export function InstructorCurriculumLessonItem({
  lesson,
  lIndex,
  totalLessons,
  sectionId,
  onEditLesson,
  onDeleteLesson,
  onMoveLesson,
  onTogglePublish,
  onOpenVideoPicker,
  onOpenTaskEditor,
  isMutating,
}: InstructorCurriculumLessonItemProps) {
  const durationMinutes = Math.round((lesson.duration || 0) / 60);

  return (
    <div
      className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
        lesson.is_published
          ? "border-border/70 bg-card hover:border-border"
          : "border-dashed border-border/60 bg-muted/20 opacity-80"
      }`}
    >
      {/* Lesson Details */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <span className="w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs font-bold flex items-center justify-center shrink-0">
          {lIndex + 1}
        </span>

        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-foreground truncate">{lesson.title}</h4>

            {/* Preview Badge */}
            {lesson.is_preview && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                معاينة مجانية
              </span>
            )}

            {/* Published / Draft Status Badge */}
            {!lesson.is_published ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                مسودة
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
            {durationMinutes > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{durationMinutes} دقيقة</span>
              </span>
            )}

            {lesson.video_id ? (
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>فيديو مربوط ({lesson.video_id})</span>
              </span>
            ) : (
              <span className="text-muted-foreground/80 font-medium">بدون فيديو</span>
            )}

            {lesson.task && (
              <span className="flex items-center gap-1 text-primary font-medium">
                <FileQuestion className="w-3.5 h-3.5" />
                <span>مهمة تفاعلية ({lesson.task.questions?.length || 0} أسئلة)</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons: >= 44x44px touch targets */}
      <div className="flex items-center gap-1 shrink-0 self-end sm:self-center flex-wrap">
        {/* Video Attachment Button */}
        <Button
          type="button"
          size="sm"
          variant={lesson.video_id ? "secondary" : "outline"}
          onClick={() => onOpenVideoPicker(lesson)}
          className={`min-h-[44px] min-w-[44px] text-xs font-bold gap-1 px-3 ${
            !lesson.video_id
              ? "border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10"
              : ""
          }`}
          title="إرفاق أو تغيير فيديو اليوتيوب"
        >
          <Youtube className="w-4 h-4 fill-current" />
          <span>{lesson.video_id ? "تغيير الفيديو" : "إرفاق فيديو"}</span>
        </Button>

        {/* Task Editor Trigger */}
        <Button
          type="button"
          size="sm"
          variant={lesson.task ? "secondary" : "outline"}
          onClick={() => onOpenTaskEditor(lesson)}
          className="min-h-[44px] min-w-[44px] text-xs font-bold gap-1 px-3 border-primary/30 text-primary hover:bg-primary/10"
          title="إعداد المهمة التفاعلية للدرس"
        >
          <FileQuestion className="w-4 h-4" />
          <span>{lesson.task ? "تعديل المهمة" : "إضافة مهمة"}</span>
        </Button>

        {/* Toggle Publish / Draft */}
        <Button
          type="button"
          size="icon"
          variant="ghost"
          disabled={isMutating}
          onClick={() => onTogglePublish(lesson)}
          className="min-h-[44px] min-w-[44px] text-muted-foreground hover:text-foreground"
          title={lesson.is_published ? "تحويل إلى مسودة" : "نشر الدرس"}
          aria-label={lesson.is_published ? "تحويل إلى مسودة" : "نشر الدرس"}
        >
          {lesson.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </Button>

        {/* Move Up */}
        <Button
          type="button"
          size="icon"
          variant="ghost"
          disabled={!canMoveUp(lIndex) || isMutating}
          onClick={() => onMoveLesson(sectionId, lIndex, "up")}
          className="min-h-[44px] min-w-[44px] text-muted-foreground hover:text-foreground disabled:opacity-30"
          title="تحريك الدرس لأعلى"
          aria-label="تحريك الدرس لأعلى"
        >
          <ArrowUp className="w-4 h-4" />
        </Button>

        {/* Move Down */}
        <Button
          type="button"
          size="icon"
          variant="ghost"
          disabled={!canMoveDown(lIndex, totalLessons) || isMutating}
          onClick={() => onMoveLesson(sectionId, lIndex, "down")}
          className="min-h-[44px] min-w-[44px] text-muted-foreground hover:text-foreground disabled:opacity-30"
          title="تحريك الدرس لأسفل"
          aria-label="تحريك الدرس لأسفل"
        >
          <ArrowDown className="w-4 h-4" />
        </Button>

        {/* Edit Lesson */}
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => onEditLesson(lesson, sectionId)}
          className="min-h-[44px] min-w-[44px] text-muted-foreground hover:text-foreground"
          title="تعديل بيانات الدرس"
          aria-label="تعديل بيانات الدرس"
        >
          <Edit2 className="w-4 h-4" />
        </Button>

        {/* Delete Lesson */}
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={() => onDeleteLesson(lesson)}
          className="min-h-[44px] min-w-[44px] text-muted-foreground hover:text-destructive"
          title="حذف الدرس"
          aria-label="حذف الدرس"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
