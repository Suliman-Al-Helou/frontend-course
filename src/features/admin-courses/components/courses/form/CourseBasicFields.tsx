"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Instructor } from "@/types";
import type { CourseLevel, CourseStatus } from "../../../types";

const LEVELS: CourseLevel[] = ["beginner", "intermediate", "advanced"];
const LEVEL_LABELS: Record<CourseLevel, string> = {
  beginner: "مبتدئ",
  intermediate: "متوسط",
  advanced: "متقدم",
};

const STATUS_LABELS: Record<CourseStatus, { label: string; desc: string }> = {
  published: { label: "منشور", desc: "يظهر للجميع في الكتالوج العام" },
  draft: { label: "مسودة", desc: "مرئي فقط لإدارة المنصة" },
  coming_soon: { label: "قريباً", desc: "يظهر مع شارة قريباً دون إمكانية التسجيل" },
};

interface Props {
  title: string;
  instructorId?: string;
  level: CourseLevel;
  status: CourseStatus;
  instructors: Instructor[];
  loadingInstructors: boolean;
  errors: Record<string, string>;
  onTitleChange: (val: string) => void;
  onInstructorChange: (val: string) => void;
  onLevelChange: (val: CourseLevel) => void;
  onStatusChange: (val: CourseStatus) => void;
}

export default function CourseBasicFields({
  title,
  instructorId,
  level,
  status,
  instructors,
  loadingInstructors,
  errors,
  onTitleChange,
  onInstructorChange,
  onLevelChange,
  onStatusChange,
}: Props) {
  return (
    <div className="space-y-4">
      {/* عنوان الكورس */}
      <div className="space-y-1.5">
        <label htmlFor="course-title-field" className="text-sm font-medium text-foreground">
          عنوان الكورس *
        </label>
        <input
          id="course-title-field"
          placeholder="مثال: هندسة الواجهات الأمامية المتقدمة مع Next.js"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "title-error" : undefined}
          className={`w-full h-11 rounded-xl border bg-background px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${
            errors.title ? "border-destructive text-destructive" : "border-input"
          }`}
        />
        {errors.title && (
          <span id="title-error" className="text-destructive text-xs block font-medium">
            {errors.title}
          </span>
        )}
      </div>

      {/* اختيار المدرب */}
      <div className="space-y-1.5">
        <label htmlFor="course-instructor-field" className="text-sm font-medium text-foreground">
          اسم المدرب المسؤول *
        </label>
        <Select dir="rtl" value={instructorId} onValueChange={onInstructorChange}>
          <SelectTrigger id="course-instructor-field" className="w-full h-11 rounded-xl">
            <SelectValue
              placeholder={loadingInstructors ? "جاري تحميل المدربين..." : "اختر المدرب..."}
            />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {loadingInstructors ? (
              <SelectItem value="__loading__" disabled>
                جاري تحميل المدربين...
              </SelectItem>
            ) : instructors.length === 0 ? (
              <SelectItem value="__empty__" disabled>
                لا يوجد مدربين مضافين
              </SelectItem>
            ) : (
              instructors.map((inst) => (
                <SelectItem key={inst.id} value={String(inst.id)}>
                  {inst.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {errors.instructor_id && (
          <span className="text-destructive text-xs block font-medium">
            {errors.instructor_id}
          </span>
        )}
      </div>

      {/* المستوى والحالة بتنسيق موحد باستخدام Radix Select */}
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label htmlFor="course-level-select" className="text-sm font-medium text-foreground">
            المستوى التعليمي *
          </label>
          <Select
            dir="rtl"
            value={level}
            onValueChange={(val) => onLevelChange(val as CourseLevel)}
          >
            <SelectTrigger id="course-level-select" className="w-full h-11 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {LEVELS.map((lvl) => (
                <SelectItem key={lvl} value={lvl}>
                  {LEVEL_LABELS[lvl]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="course-status-select" className="text-sm font-medium text-foreground">
            حالة النشر *
          </label>
          <Select
            dir="rtl"
            value={status}
            onValueChange={(val) => onStatusChange(val as CourseStatus)}
          >
            <SelectTrigger id="course-status-select" className="w-full h-11 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {(["published", "draft", "coming_soon"] as CourseStatus[]).map((st) => (
                <SelectItem key={st} value={st}>
                  <div className="flex flex-col text-right">
                    <span className="font-semibold text-xs">{STATUS_LABELS[st].label}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {STATUS_LABELS[st].desc}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
