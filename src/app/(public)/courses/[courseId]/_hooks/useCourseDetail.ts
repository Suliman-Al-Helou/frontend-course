// src/app/(public)/courses/[courseId]/_hooks/useCourseDetail.ts

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Course } from "@/types";

/* ─── Types ──────────────────────────────────────────────── */
export interface CourseLessonUI {
  id: number;
  title: string;
  duration: string;
  is_preview: boolean;
  video_id: string | null;
  order: number;
}

export interface CourseSectionUI {
  id: number;
  title: string;
  order: number;
  lessons: CourseLessonUI[];
}

export type CourseDetail = Omit<
  Course,
  "sections" | "requirements" | "target_audience"
> & {
  sections: CourseSectionUI[];
  what_you_learn: string[];
  requirements: string[];
  target_audience: string[];
};

/* ─── helper: string | array → array ─────────────────────── */
function toArray(val: any): string[] {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string' && val.trim()) {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : [val];
    } catch {
      return val.split('\n').filter(Boolean);
    }
  }
  return [];
}

/* ─── helper: ثواني → "X د" ──────────────────────────────── */
function formatDuration(seconds: number): string {
  if (!seconds) return "";
  const mins = Math.round(seconds / 60);
  return `${mins} د`;
}

/* ─── Hook ───────────────────────────────────────────────── */
export function useCourseDetail(id: number) {
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourse() {
      setLoading(true);
      try {
        const { data } = await api.get<Course & { sections: any[] }>(
          `/courses/${id}`,
        );

        const sections: CourseSectionUI[] = (data.sections ?? []).map(
          (s: any) => ({
            id: s.id,
            title: s.title,
            order: s.order,
            lessons: (s.lessons ?? []).map(
              (l: any): CourseLessonUI => ({
                id: l.id,
                title: l.title,
                duration: formatDuration(l.duration),
                is_preview: l.is_preview,
                video_id: l.video_id,
                order: l.order,
              }),
            ),
          }),
        );

        setCourse({
          ...data,
          sections,
          what_you_learn:  toArray((data as any).what_you_learn),
          requirements:    toArray((data as any).requirements),
          target_audience: toArray((data as any).target_audience),
          instructor:    (data as any).instructor_name ?? "",
          instructorBio: (data as any).instructor_bio  ?? "",
          students:      (data as any).students_count  ?? 0,
          reviews:       (data as any).reviews_count   ?? 0,
          lessons: sections.reduce((acc, s) => acc + s.lessons.length, 0),
        });
      } catch {
        setError("تعذّر تحميل بيانات الكورس");
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, [id]);

  return { course, loading, error };
}

/* ─── Accordion ──────────────────────────────────────────── */
export function useCurriculumAccordion() {
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({
    0: true,
  });
  const toggle = (i: number) =>
    setOpenSections((prev) => ({ ...prev, [i]: !prev[i] }));
  return { openSections, toggle };
}