"use client";

import { useState, useRef, useEffect, useId } from "react";
import { X, Layers, Sparkles, DollarSign } from "lucide-react";
import { notify } from "@/components/ui/sonner";
import { useInstructorsStore } from "@/store/instructorsStore";
import {
  useCreateCourseMutation,
  useUpdateCourseMutation,
} from "../../queries/adminCourses.mutations";
import CourseBasicFields from "./form/CourseBasicFields";
import CoursePricingMediaFields from "./form/CoursePricingMediaFields";
import CourseTagListField from "./form/CourseTagListField";
import type { AdminCourse, CourseFormData, CourseLevel, CourseStatus } from "../../types";

interface Props {
  course?: AdminCourse | null;
  isOpen: boolean;
  onClose: () => void;
}

const toArray = (val: unknown): string[] => {
  if (Array.isArray(val)) return val.filter(Boolean).map(String);
  if (typeof val === "string" && val.trim()) {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed.filter(Boolean).map(String) : [val];
    } catch {
      return val.split("\n").map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
};

export default function CourseFormModal({ course, isOpen, onClose }: Props) {
  const titleId = useId();
  const isEdit = !!course;
  const isSubmittingRef = useRef(false);

  const { instructors, loading: loadingInstructors, fetchInstructors } = useInstructorsStore();
  const createMutation = useCreateCourseMutation();
  const updateMutation = useUpdateCourseMutation();

  const [activeTab, setActiveTab] = useState<"basic" | "pricing" | "content">("basic");

  const [form, setForm] = useState<CourseFormData>({
    title: course?.title ?? "",
    description: course?.description ?? "",
    cover_image: course?.cover_image ?? "",
    level: course?.level ?? "beginner",
    status: course?.status ?? "published",
    instructor_id: course?.instructor?.id
      ? String(course.instructor.id)
      : course?.instructor_id
      ? String(course.instructor_id)
      : undefined,
    rating: course?.rating ?? 4.5,
    is_popular: course?.is_popular ?? course?.hot ?? false,
    total_duration: course?.total_duration ?? 0,
    price: course?.price ?? 0,
    is_public: course?.is_public ?? false,
    what_you_learn: toArray(course?.what_you_learn),
    requirements: toArray(course?.requirements),
    target_audience: toArray(course?.target_audience),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");

  const isSaving = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (instructors.length === 0) {
      void fetchInstructors();
    }
  }, [fetchInstructors, instructors.length]);

  // إغلاق المودال بزر Escape في لوحة المفاتيح
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSaving) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isSaving, onClose]);

  if (!isOpen) return null;

  const setField = <K extends keyof CourseFormData>(key: K, val: CourseFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current || createMutation.isPending || updateMutation.isPending) {
      return;
    }

    setErrors({});
    setGeneralError("");

    // التحقق المحلي السريع
    const localErrors: Record<string, string> = {};
    if (!form.title.trim()) localErrors.title = "عنوان الكورس مطلوب";
    if (!form.instructor_id) localErrors.instructor_id = "يرجى اختيار المدرب المسؤول";

    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors);
      setActiveTab("basic");
      return;
    }

    isSubmittingRef.current = true;
    try {
      const submitPayload: CourseFormData = {
        ...form,
        price: form.is_public ? 0 : form.price,
      };

      if (isEdit && course?.id) {
        await updateMutation.mutateAsync({
          id: course.id,
          data: submitPayload,
        });
        notify.success(`تم تحديث كورس "${submitPayload.title}" بنجاح`);
      } else {
        await createMutation.mutateAsync(submitPayload);
        notify.success(`تم إنشاء كورس "${submitPayload.title}" بنجاح`);
      }
      onClose();
    } catch (err: unknown) {
      const apiErr = err as {
        response?: { status?: number; data?: { errors?: Record<string, string[]> } };
      };
      if (apiErr?.response?.status === 422 && apiErr.response.data?.errors) {
        const mappedErrors: Record<string, string> = {};
        for (const [key, msgs] of Object.entries(apiErr.response.data.errors)) {
          mappedErrors[key] = msgs[0];
        }
        setErrors(mappedErrors);
        notify.error("يرجى تصحيح أخطاء الحقول المحددة قبل الحفظ.");
      } else {
        const errorMsg = "تعذر حفظ الكورس. يرجى مراجعة البيانات المدخلة والمحاولة ثانية.";
        setGeneralError(errorMsg);
        notify.error(errorMsg);
      }
    } finally {
      isSubmittingRef.current = false;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-busy={isSaving}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      dir="rtl"
      onClick={() => {
        if (!isSaving) onClose();
      }}
    >
      <div
        className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 motion-reduce:animate-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border shrink-0 bg-muted/10">
          <div>
            <h2 id={titleId} className="font-bold text-foreground text-base">
              {isEdit ? "تعديل الكورس" : "إضافة كورس جديد"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              قم بتهيئة بيانات الكورس، التسعير، والمنهج الأكاديمي
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-border bg-muted/20 px-5 pt-2 gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("basic")}
            className={`min-h-[44px] px-3.5 pb-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "basic"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            المعلومات الأساسية
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pricing")}
            className={`min-h-[44px] px-3.5 pb-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "pricing"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            التسعير والوسائط
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("content")}
            className={`min-h-[44px] px-3.5 pb-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "content"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            المخرجات والجمهور
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* تبويب المعلومات الأساسية */}
          {activeTab === "basic" && (
            <div className="space-y-4 animate-in fade-in-0 duration-150 motion-reduce:animate-none">
              <CourseBasicFields
                title={form.title}
                instructorId={form.instructor_id}
                level={form.level}
                status={form.status}
                instructors={instructors}
                loadingInstructors={loadingInstructors}
                errors={errors}
                onTitleChange={(v) => setField("title", v)}
                onInstructorChange={(v) => setField("instructor_id", v)}
                onLevelChange={(v: CourseLevel) => setField("level", v)}
                onStatusChange={(v: CourseStatus) => setField("status", v)}
              />

              {/* وصف الكورس */}
              <div className="space-y-1.5">
                <label htmlFor="course-desc-field" className="text-sm font-medium text-foreground">
                  نبذة وصفية للكورس
                </label>
                <textarea
                  id="course-desc-field"
                  rows={4}
                  placeholder="اكتب نبذة مختصرة وشاملة عن محتوى الكورس والمهارات المكتسبة..."
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  className="w-full rounded-xl border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none transition-all"
                />
              </div>
            </div>
          )}

          {/* تبويب التسعير والوسائط */}
          {activeTab === "pricing" && (
            <div className="space-y-4 animate-in fade-in-0 duration-150 motion-reduce:animate-none">
              <CoursePricingMediaFields
                rating={form.rating}
                price={form.price}
                totalDuration={form.total_duration}
                coverImage={form.cover_image}
                isPopular={form.is_popular}
                isPublic={form.is_public}
                onRatingChange={(v) => setField("rating", v)}
                onPriceChange={(v) => setField("price", v)}
                onDurationChange={(v) => setField("total_duration", v)}
                onCoverImageChange={(v) => setField("cover_image", v)}
                onIsPopularChange={(v) => setField("is_popular", v)}
                onIsPublicChange={(v) => {
                  setField("is_public", v);
                  if (v) {
                    setField("price", 0);
                  }
                }}
              />
            </div>
          )}

          {/* تبويب المخرجات والمتطلبات والجمهور */}
          {activeTab === "content" && (
            <div className="space-y-5 animate-in fade-in-0 duration-150 motion-reduce:animate-none">
              <CourseTagListField
                label="ماذا سيتعلم الطالب (Learning Outcomes)"
                items={form.what_you_learn}
                placeholder="مثال: هندسة وإدارة الحالة باستخدام TanStack Query v5..."
                badgePrefix="✓"
                helperText="يمكنك لصق عدة أسطر دفعة واحدة"
                onChange={(items) => setField("what_you_learn", items)}
              />

              <CourseTagListField
                label="متطلبات الالتحاق بالكورس (Prerequisites)"
                items={form.requirements}
                placeholder="مثال: إتقان أساسيات JavaScript الحديثة و ES6..."
                badgePrefix="📌"
                onChange={(items) => setField("requirements", items)}
              />

              <CourseTagListField
                label="الجمهور المستهدف (Target Audience)"
                items={form.target_audience}
                placeholder="مثال: مهندسو الواجهات الأمامية والباحثون عن الاحتراف..."
                badgePrefix="🎯"
                onChange={(items) => setField("target_audience", items)}
              />
            </div>
          )}

          {generalError && (
            <div className="text-destructive text-xs bg-destructive/10 border border-destructive/20 p-3 rounded-xl font-medium">
              {generalError}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 min-h-[44px] rounded-xl border border-input text-foreground text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 min-h-[44px] rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors shadow-sm"
            >
              {isSaving ? "جارٍ الحفظ..." : isEdit ? "حفظ التعديلات" : "إضافة الكورس"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
