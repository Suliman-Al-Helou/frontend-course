"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  BookOpen,
  Save,
  Plus,
  X,
  Loader2,
  Check,
  Award,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateInstructorCourse } from "../api";
import type { InstructorCourse } from "../types";

interface InstructorCourseContentEditorProps {
  course: InstructorCourse;
  onUpdated?: () => void;
}

export function InstructorCourseContentEditor({
  course,
  onUpdated,
}: InstructorCourseContentEditorProps) {
  const [title, setTitle] = useState(course.title || "");
  const [description, setDescription] = useState(course.description || "");
  const [coverImage, setCoverImage] = useState(course.cover_image || "");
  const [level, setLevel] = useState(course.level || "beginner");

  const [whatYouLearn, setWhatYouLearn] = useState<string[]>(
    Array.isArray(course.what_you_learn) ? course.what_you_learn : [],
  );
  const [newOutcomeInput, setNewOutcomeInput] = useState("");

  const [requirements, setRequirements] = useState<string[]>(
    Array.isArray(course.requirements) ? course.requirements : [],
  );
  const [newRequirementInput, setNewRequirementInput] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  const handleAddOutcome = () => {
    const trimmed = newOutcomeInput.trim();
    if (!trimmed) return;
    if (whatYouLearn.includes(trimmed)) {
      toast.error("هذا المخرج التعليمي مضاف مسبقاً");
      return;
    }
    setWhatYouLearn((prev) => [...prev, trimmed]);
    setNewOutcomeInput("");
  };

  const handleRemoveOutcome = (index: number) => {
    setWhatYouLearn((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddRequirement = () => {
    const trimmed = newRequirementInput.trim();
    if (!trimmed) return;
    if (requirements.includes(trimmed)) {
      toast.error("هذا المتطلب مضاف مسبقاً");
      return;
    }
    setRequirements((prev) => [...prev, trimmed]);
    setNewRequirementInput("");
  };

  const handleRemoveRequirement = (index: number) => {
    setRequirements((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;

    if (!title.trim()) {
      toast.error("عنوان المقرر مطلوب");
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      await updateInstructorCourse(course.id, {
        title: title.trim(),
        description: description.trim() || null,
        cover_image: coverImage.trim() || null,
        level,
        what_you_learn: whatYouLearn,
        requirements,
      });

      toast.success("تم تحديث البيانات التعليمية للمقرر بنجاح");
      onUpdated?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل تحديث بيانات المقرر");
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 sm:p-8 rounded-2xl border border-border/80 bg-card space-y-8">
      <div className="space-y-1 border-b border-border/60 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
          <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
          <span>المحتوى التعليمي الأكاديمي</span>
        </div>
        <h2 className="text-xl font-bold text-foreground">تعديل بيانات المقرر</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          يمكنك كمدرب تحديث البيانات الوصفية والتعليمية للمقرر. يُحجب تعديل السعر وحالة النشر وحذف المقرر التزاماً بصلاحيات الإدارة المركزية (ADR 0014).
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Course Title */}
        <div className="space-y-2">
          <Label htmlFor="course-title" className="text-xs font-bold text-foreground">
            عنوان المقرر الدراسي *
          </Label>
          <Input
            id="course-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثال: هندسة واجهات المستخدم الحديثة بـ Next.js 16"
            className="min-h-[44px]"
            required
          />
        </div>

        {/* Level and Cover Image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="course-level" className="text-xs font-bold text-foreground">
              المستوى التعليمي
            </Label>
            <select
              id="course-level"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="beginner">مبتدئ (Beginner)</option>
              <option value="intermediate">متوسط (Intermediate)</option>
              <option value="advanced">متقدم (Advanced)</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="course-cover" className="text-xs font-bold text-foreground">
              رابط صورة الغلاف (Cover Image URL)
            </Label>
            <Input
              id="course-cover"
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://example.com/cover.jpg"
              className="min-h-[44px]"
              dir="ltr"
            />
          </div>
        </div>

        {/* Cover Preview if entered */}
        {coverImage && (
          <div className="relative aspect-video w-full max-w-xs overflow-hidden rounded-xl border border-border bg-muted">
            <Image
              src={coverImage}
              alt="معاينة الغلاف"
              fill
              sizes="(max-width: 768px) 100vw, 320px"
              className="object-cover"
              unoptimized
            />
          </div>
        )}

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="course-desc" className="text-xs font-bold text-foreground">
            الوصف العام للمقرر
          </Label>
          <textarea
            id="course-desc"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            placeholder="وصف تفصيلي يشرح محتوى الدورة وأهدافها..."
            rows={4}
            className="w-full min-h-[100px] p-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
          />
        </div>

        {/* What You Learn (Learning Outcomes) */}
        <div className="space-y-3 p-4 rounded-xl border border-border/80 bg-muted/30">
          <Label className="text-xs font-bold text-foreground block">
            ماذا سيتعلم الطالب؟ (مخرجات التعلم)
          </Label>

          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="أدخل مخرجاً تعليمياً ثم اضغط إضافة..."
              value={newOutcomeInput}
              onChange={(e) => setNewOutcomeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddOutcome();
                }
              }}
              className="min-h-[44px]"
            />
            <Button
              type="button"
              onClick={handleAddOutcome}
              variant="outline"
              className="min-h-[44px] shrink-0 font-bold gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة</span>
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {whatYouLearn.map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border/80 text-xs text-foreground font-medium"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveOutcome(index)}
                  className="w-4 h-4 rounded-full text-muted-foreground hover:text-destructive flex items-center justify-center transition-colors"
                  aria-label="حذف هذا المخرج"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="space-y-3 p-4 rounded-xl border border-border/80 bg-muted/30">
          <Label className="text-xs font-bold text-foreground block">
            المتطلبات السابقة للمقرر
          </Label>

          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="أدخل متطلباً سابقاً ثم اضغط إضافة..."
              value={newRequirementInput}
              onChange={(e) => setNewRequirementInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddRequirement();
                }
              }}
              className="min-h-[44px]"
            />
            <Button
              type="button"
              onClick={handleAddRequirement}
              variant="outline"
              className="min-h-[44px] shrink-0 font-bold gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة</span>
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {requirements.map((item, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border/80 text-xs text-foreground font-medium"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveRequirement(index)}
                  className="w-4 h-4 rounded-full text-muted-foreground hover:text-destructive flex items-center justify-center transition-colors"
                  aria-label="حذف هذا المتطلب"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end pt-4 border-t border-border/60">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-h-[44px] px-8 gap-2 font-bold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>حفظ التعديلات</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
