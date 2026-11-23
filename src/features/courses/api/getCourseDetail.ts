import api from "@/lib/api";
import type { Course, VideoPlaybackPayload } from "@/types";
import type { CourseDetail, CourseSectionUI, CourseLessonUI } from "../index";
import type { components } from "@/types/api.generated";

export type RawCourseDetail = components["schemas"]["CourseDetailResource"];
export type RawSection = components["schemas"]["SectionResource"];
export type RawLesson = components["schemas"]["LessonResource"];

export type RawCourseDetailResponse =
  | RawCourseDetail
  | { data: RawCourseDetail }
  | (Course & { sections?: unknown[] })
  | { data: Course & { sections?: unknown[] } };

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

function normalizeLevel(level?: string | null): "beginner" | "intermediate" | "advanced" {
  if (level === "intermediate" || level === "advanced") return level;
  return "beginner";
}

function normalizeStatus(status?: string | null): "draft" | "published" | "coming_soon" {
  if (status === "published" || status === "coming_soon") return status;
  return "draft";
}

function formatDuration(seconds?: number | string | null): string {
  if (!seconds) return "";
  const numSeconds = typeof seconds === "string" ? parseFloat(seconds) : seconds;
  if (isNaN(numSeconds) || numSeconds <= 0) return "";
  const mins = Math.round(numSeconds / 60);
  return `${mins} د`;
}

export function toCourseDetail(
  rawResponse: RawCourseDetailResponse,
): CourseDetail {
  // فك غلاف data في حال كان الـ API يرجع { data: { ... } }
  const data =
    rawResponse &&
    typeof rawResponse === "object" &&
    "data" in rawResponse &&
    rawResponse.data &&
    typeof rawResponse.data === "object"
      ? (rawResponse as { data: RawCourseDetail }).data
      : (rawResponse as RawCourseDetail);

  const rawSections: (RawSection | any)[] = Array.isArray(data?.sections) ? data.sections : [];

  const sections: CourseSectionUI[] = rawSections.map((s) => ({
    id: Number(s.id),
    title: s.title || "",
    order: Number(s.order ?? 0),
    lessons: Array.isArray(s.lessons)
      ? s.lessons.map((l: RawLesson | any): CourseLessonUI => {
          let resolvedPlayback: VideoPlaybackPayload | null = null;
          if (l.playback && typeof l.playback === "object") {
            resolvedPlayback = l.playback as VideoPlaybackPayload;
          } else if (typeof l.playback === "string" && l.playback.trim().startsWith("{")) {
            try {
              resolvedPlayback = JSON.parse(l.playback);
            } catch {
              resolvedPlayback = null;
            }
          }

          return {
            id: Number(l.id),
            title: l.title || "",
            duration: formatDuration(l.duration),
            is_preview: Boolean(l.is_preview),
            video_id: l.video_id ?? null,
            playback: resolvedPlayback,
            video_provider: (l.video_provider as "youtube" | "hls") || "youtube",
            order: Number(l.order ?? 0),
            is_published: l.is_published ?? true,
          };
        })
      : [],
  }));

  const rawAny = (data ?? {}) as any;

  // استخراج اسم المدرب بمرونة من كافة أشكال الاستجابات
  const instructorName =
    rawAny.instructor_name ||
    (typeof rawAny.instructor === "string"
      ? rawAny.instructor
      : rawAny.instructor && typeof rawAny.instructor === "object" && "name" in rawAny.instructor
        ? String(rawAny.instructor.name)
        : "مدرب معتمد");

  const instructorBio =
    typeof rawAny.instructor === "object" && rawAny.instructor && "bio" in rawAny.instructor
      ? String(rawAny.instructor.bio)
      : rawAny.instructor_bio || "";

  return {
    ...data,
    id: Number(data.id),
    title: data.title || "",
    description: data.description || "",
    cover_image: data.cover_image ?? null,
    level: normalizeLevel(data.level),
    status: normalizeStatus(data.status),
    total_duration: typeof rawAny.total_duration === "string" ? parseFloat(rawAny.total_duration) || 0 : Number(rawAny.total_duration ?? 0),
    price: Number(rawAny.price ?? 0),
    rating: Number(rawAny.rating ?? 0),
    is_popular: Boolean(rawAny.is_popular),
    is_public: Boolean(rawAny.is_public),
    sections,
    what_you_learn: toArray(rawAny.what_you_learn),
    requirements: toArray(rawAny.requirements),
    target_audience: toArray(rawAny.target_audience),
    instructor: instructorName,
    instructorBio,
    students: Number(rawAny.students_count ?? rawAny.students ?? 0),
    students_count: Number(rawAny.students_count ?? rawAny.students ?? 0),
    enrollments_count: Number(rawAny.enrollments_count ?? rawAny.enrollments ?? 0),
    reviews: Number(rawAny.reviews_count ?? rawAny.reviews ?? 0),
    lessons: sections.reduce((acc, s) => acc + s.lessons.length, 0),
    tags: Array.isArray(rawAny.tags) ? rawAny.tags : [],
  };
}

export async function getCourseById(courseId: string | number): Promise<CourseDetail> {
  const { data } = await api.get<RawCourseDetailResponse>(`/courses/${courseId}`);
  return toCourseDetail(data);
}
