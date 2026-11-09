"use client";

import { useState, useRef } from "react";
import {
  Video,
  Clock,
  Eye,
  Pencil,
  Trash2,
  Check,
  X,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { extractYouTubeVideoId } from "@/lib/youtube";
import LessonTaskEditor from "./LessonTaskEditor";
import type { AdminLesson } from "../../types";

interface Props {
  lesson: AdminLesson;
  onUpdate: (data: Partial<AdminLesson>) => Promise<unknown>;
  onDelete: () => Promise<unknown>;
}

export default function LessonRow({ lesson, onUpdate, onDelete }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [showTaskEditor, setShowTaskEditor] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [editTitle, setEditTitle] = useState(lesson.title);
  const [editVideoId, setEditVideoId] = useState(lesson.video_id ?? "");
  const [editDuration, setEditDuration] = useState(lesson.duration ? String(lesson.duration) : "0");
  const [editPreview, setEditPreview] = useState(lesson.is_preview);

  const isSavingRef = useRef(false);
  const isDeletingRef = useRef(false);

  const handleSaveEdit = async () => {
    if (isSavingRef.current) return;
    if (!editTitle.trim()) return;

    isSavingRef.current = true;
    try {
      const cleanVideoId = extractYouTubeVideoId(editVideoId);
      await onUpdate({
        title: editTitle.trim(),
        video_id: cleanVideoId || null,
        duration: Number.parseInt(editDuration, 10) || 0,
        is_preview: editPreview,
      });
      setIsEditing(false);
    } catch (err) {
      console.error("فشل تعديل الدرس:", err);
    } finally {
      isSavingRef.current = false;
    }
  };

  const handleDelete = async () => {
    if (isDeletingRef.current) return;
    isDeletingRef.current = true;
    try {
      await onDelete();
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error("فشل حذف الدرس:", err);
    } finally {
      isDeletingRef.current = false;
    }
  };

  return (
    <div className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-xs transition-all">
      <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left/Main Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Video className="w-4 h-4" />
          </div>

          {isEditing ? (
            <div className="flex-1 grid sm:grid-cols-3 gap-2">
              <input
                placeholder="عنوان الدرس"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary col-span-2 sm:col-span-1"
              />
              <input
                placeholder="رابط YouTube أو المعرف (ID)"
                value={editVideoId}
                onChange={(e) => setEditVideoId(e.target.value)}
                onBlur={() => setEditVideoId(extractYouTubeVideoId(editVideoId))}
                className="h-8 rounded-lg border border-input bg-background px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="المدة (دقيقة)"
                  value={editDuration}
                  onChange={(e) => setEditDuration(e.target.value)}
                  className="w-20 h-8 rounded-lg border border-input bg-background px-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <label className="flex items-center gap-1.5 text-xs cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editPreview}
                    onChange={(e) => setEditPreview(e.target.checked)}
                    className="rounded text-primary focus:ring-primary w-3.5 h-3.5"
                  />
                  <span>معاينة مجانية</span>
                </label>
              </div>
            </div>
          ) : (
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-foreground text-xs sm:text-sm truncate">
                  {lesson.title}
                </p>
                {lesson.is_preview && (
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Eye className="w-3 h-3" /> معاينة
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-0.5">
                {lesson.duration > 0 && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {lesson.duration} دقيقة
                  </span>
                )}
                {lesson.video_id ? (
                  <span className="truncate max-w-[150px]">ID: {lesson.video_id}</span>
                ) : (
                  <span className="text-amber-500 font-medium">بدون فيديو</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
          {isEditing ? (
            <>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(false)}
                className="h-8 px-2.5 rounded-lg text-xs"
              >
                <X className="w-3.5 h-3.5 ml-1" /> إلغاء
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => void handleSaveEdit()}
                className="h-8 px-3 rounded-lg text-xs bg-primary text-primary-foreground"
              >
                <Check className="w-3.5 h-3.5 ml-1" /> حفظ
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant={showTaskEditor ? "default" : "outline"}
                size="sm"
                onClick={() => setShowTaskEditor((prev) => !prev)}
                className="h-8 px-2.5 rounded-lg text-xs font-medium"
              >
                <ClipboardList className="w-3.5 h-3.5 ml-1" />
                {showTaskEditor ? "إغلاق الاختبار" : "المهمة"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-foreground"
                aria-label="تعديل الدرس"
              >
                <Pencil className="w-3.5 h-3.5" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="h-8 w-8 p-0 rounded-lg text-destructive/80 hover:text-destructive hover:bg-destructive/10"
                aria-label="حذف الدرس"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Alert */}
      {showDeleteConfirm && (
        <div className="p-3 bg-destructive/10 border-t border-destructive/20 flex items-center justify-between gap-3 text-xs">
          <span className="text-destructive font-medium">هل أنت متأكد من حذف هذا الدرس؟</span>
          <div className="flex items-center gap-2">
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
              onClick={() => void handleDelete()}
              className="h-7 text-xs px-2.5 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg"
            >
              تأكيد الحذف
            </Button>
          </div>
        </div>
      )}

      {/* Task / Quiz Editor Container */}
      {showTaskEditor && (
        <div className="p-3 pt-0">
          <LessonTaskEditor
            lessonId={lesson.id}
            lessonTitle={lesson.title}
            onClose={() => setShowTaskEditor(false)}
          />
        </div>
      )}
    </div>
  );
}

