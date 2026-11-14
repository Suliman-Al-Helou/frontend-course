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

export function toCourseDetail(
  rawResponse: (Course & { sections?: unknown[] }) | { data: Course & { sections?: unknown[] } },
): CourseDetail {
  // فك غلاف data في حال كان الـ API يرجع { data: { ... } }
  const data =
    rawResponse &&
    typeof rawResponse === "object" &&
    "data" in rawResponse &&
    rawResponse.data &&
    typeof rawResponse.data === "object"
      ? (rawResponse as { data: Course & { sections?: unknown[] } }).data
      : (rawResponse as Course & { sections?: unknown[] });

  const rawSections = Array.isArray(data?.sections) ? data.sections : [];

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

  const rawAny = (data ?? {}) as any;

  // استخراج اسم المدرب بمرونة من كافة أشكال الاستجابات
  const instructorName =
    typeof rawAny.instructor === "string"
      ? rawAny.instructor
      : rawAny.instructor && typeof rawAny.instructor === "object" && "name" in rawAny.instructor
        ? String(rawAny.instructor.name)
        : rawAny.instructor_name || "مدرب معتمد";

  const instructorBio =
    typeof rawAny.instructor === "object" && rawAny.instructor && "bio" in rawAny.instructor
      ? String(rawAny.instructor.bio)
      : rawAny.instructor_bio || "";

  return {
    ...data,
    sections,
    what_you_learn: toArray(rawAny.what_you_learn),
    requirements: toArray(rawAny.requirements),
    target_audience: toArray(rawAny.target_audience),
    instructor: instructorName,
    instructorBio,
    students: Number(rawAny.students_count ?? rawAny.students ?? 0),
    reviews: Number(rawAny.reviews_count ?? rawAny.reviews ?? 0),
    lessons: sections.reduce((acc, s) => acc + s.lessons.length, 0),
  };
}

export async function getCourseById(courseId: string | number): Promise<CourseDetail> {
  const { data } = await api.get<
    (Course & { sections?: unknown[] }) | { data: Course & { sections?: unknown[] } }
  >(`/courses/${courseId}`);
  return toCourseDetail(data);
}
