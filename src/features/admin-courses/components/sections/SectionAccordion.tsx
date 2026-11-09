"use client";

import { useState, useRef } from "react";
import {
  ChevronDown,
  Plus,
  Trash2,
  FolderOpen,
  Folder,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { extractYouTubeVideoId } from "@/lib/youtube";
import LessonRow from "./LessonRow";
import type { AdminSection, AdminLesson, AdminVideoAsset } from "../../types";

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
}

export default function SectionAccordion({
  section,
  isOpen,
  onToggle,
  onDeleteSection,
  onCreateLesson,
  onUpdateLesson,
  onDeleteLesson,
  courseVideos = [],
}: Props) {
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // New Lesson form state
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonVideoId, setLessonVideoId] = useState("");
  const [lessonDuration, setLessonDuration] = useState("");
  const [lessonPreview, setLessonPreview] = useState(false);

  const isSubmittingLessonRef = useRef(false);
  const isDeletingSectionRef = useRef(false);

  const handleAddLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingLessonRef.current || !lessonTitle.trim()) return;

    isSubmittingLessonRef.current = true;
    try {
      const cleanVideoId = extractYouTubeVideoId(lessonVideoId);
      await onCreateLesson({
        title: lessonTitle.trim(),
        video_id: cleanVideoId,
        duration: Number.parseInt(lessonDuration, 10) || 0,
        order: section.lessons.length,
        is_preview: lessonPreview,
      });

      setLessonTitle("");
      setLessonVideoId("");
      setLessonDuration("");
      setLessonPreview(false);
      setShowAddLesson(false);
    } catch (err) {
      console.error("فشل إضافة الدرس:", err);
    } finally {
      isSubmittingLessonRef.current = false;
    }
  };

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
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-3 flex-1 text-right focus:outline-none"
          aria-expanded={isOpen}
          aria-controls={`section-content-${section.id}`}
        >
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            {isOpen ? <FolderOpen className="w-4 h-4" /> : <Folder className="w-4 h-4" />}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-foreground text-sm truncate">{section.title}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {section.lessons.length} درس
            </p>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground mr-auto transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Section Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              if (!isOpen) onToggle();
              setShowAddLesson((prev) => !prev);
            }}
            className="rounded-xl h-8 px-2.5 text-xs font-medium"
          >
            <Plus className="w-3.5 h-3.5 ml-1" /> إضافة درس
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
          {/* Add Lesson Form */}
          {showAddLesson && (
            <form
              onSubmit={handleAddLessonSubmit}
              className="bg-card border border-primary/20 rounded-xl p-4 space-y-3 animate-in fade-in-0 duration-150"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-foreground">إضافة درس جديد لهذا القسم</p>
                <button
                  type="button"
                  onClick={() => setShowAddLesson(false)}
                  className="text-muted-foreground hover:text-foreground text-xs"
                >
                  إلغاء
                </button>
              </div>

              {courseVideos.length > 0 && (
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400 block">
                    💡 اختيار فيديو مدرج للكورس ({courseVideos.length} فيديو متوفر):
                  </span>
                  <select
                    aria-label="اختر من فيديوهات الكورس المرفوعة"
                    className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs"
                    onChange={(e) => {
                      const found = courseVideos.find((v) => String(v.id) === e.target.value);
                      if (found) {
                        setLessonTitle(found.title);
                        setLessonVideoId(found.provider_video_id);
                        setLessonDuration(String(Math.round(found.duration_seconds / 60) || ""));
                      }
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>-- اضغط لاختيار فيديو تلقائياً وتعبئة البيانات --</option>
                    {courseVideos.map((v) => (
                      <option key={v.id} value={String(v.id)}>
                        {v.title} ({Math.round(v.duration_seconds / 60)} دقيقة)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-3">
                <input
                  placeholder="عنوان الدرس *"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  className="h-9 rounded-lg border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary col-span-2 sm:col-span-1"
                  required
                />
                <input
                  placeholder="رابط YouTube أو المعرف (ID)"
                  value={lessonVideoId}
                  onChange={(e) => setLessonVideoId(e.target.value)}
                  onBlur={() => setLessonVideoId(extractYouTubeVideoId(lessonVideoId))}
                  className="h-9 rounded-lg border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary col-span-2 sm:col-span-1"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="0"
                    placeholder="المدة بالدقائق"
                    value={lessonDuration}
                    onChange={(e) => setLessonDuration(e.target.value)}
                    className="w-28 h-9 rounded-lg border border-input bg-background px-3 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <label className="flex items-center gap-1.5 text-xs text-foreground cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={lessonPreview}
                      onChange={(e) => setLessonPreview(e.target.checked)}
                      className="rounded text-primary focus:ring-primary w-4 h-4"
                    />
                    <span>متاح كمعاينة مجانية</span>
                  </label>
                </div>

                <Button
                  type="submit"
                  size="sm"
                  className="rounded-lg h-9 px-4 bg-primary text-primary-foreground font-medium text-xs mr-auto"
                >
                  حفظ الدرس
                </Button>
              </div>
            </form>
          )}

          {/* Lessons List */}
          {section.lessons.length === 0 ? (
            <p className="text-center text-muted-foreground text-xs py-6 bg-muted/10 rounded-xl border border-dashed border-border">
              لا توجد دروس في هذا القسم بعد. انقر على &quot;إضافة درس&quot; بالأعلى.
            </p>
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
    </div>
  );
}

