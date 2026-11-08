import api from "@/lib/api";
import type { Course } from "@/types";
import type { CourseDetail, CourseSectionUI, CourseLessonUI } from "../index";

function toArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(String);
  if (typeof val === "string" && val.trim()) {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed.map(String) : [val];
    } catch {
      return val.split("\n").filter(Boolean);
    }
  }
  return [];
}

function formatDuration(seconds?: number): string {
  if (!seconds) return "";
  const mins = Math.round(seconds / 60);
  return `${mins} د`;
}

export function toCourseDetail(data: Course & { sections?: unknown[] }): CourseDetail {
  const rawSections = Array.isArray(data.sections) ? data.sections : [];

  const sections: CourseSectionUI[] = rawSections.map((s: any) => ({
    id: s.id,
    title: s.title,
    order: s.order,
    lessons: Array.isArray(s.lessons)
      ? s.lessons.map((l: any): CourseLessonUI => ({
          id: l.id,
          title: l.title,
          duration: formatDuration(l.duration),
          is_preview: Boolean(l.is_preview),
          video_id: l.video_id ?? null,
          order: l.order,
        }))
      : [],
  }));

  const rawAny = data as any;

  return {
    ...data,
    sections,
    what_you_learn: toArray(rawAny.what_you_learn),
    requirements: toArray(rawAny.requirements),
    target_audience: toArray(rawAny.target_audience),
    instructor: rawAny.instructor_name ?? "",
    instructorBio: rawAny.instructor_bio ?? "",
    students: Number(rawAny.students_count ?? 0),
    reviews: Number(rawAny.reviews_count ?? 0),
    lessons: sections.reduce((acc, s) => acc + s.lessons.length, 0),
  };
}

export async function getCourseById(courseId: string | number): Promise<CourseDetail> {
  const { data } = await api.get<Course & { sections?: unknown[] }>(`/courses/${courseId}`);
  return toCourseDetail(data);
}

