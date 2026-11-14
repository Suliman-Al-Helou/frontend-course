import { queryOptions } from "@tanstack/react-query";
import api from "@/lib/api";
import { getMyCourses, getLessonProgress, getLessonTask } from "../api";
import type { InProgressLesson } from "../types";

export const studentCourseQueries = {
  all: () => ["student-courses"] as const,

  // قائمة الكورسات المسجل بها الطالب
  enrolled: () =>
    queryOptions({
      queryKey: [...studentCourseQueries.all(), "enrolled"] as const,
      queryFn: getMyCourses,
      staleTime: 1000 * 60 * 5, // 5 minutes fresh in cache
    }),

  // تقدم درس محدد
  lessonProgress: (lessonId: number | string) =>
    queryOptions({
      queryKey: [...studentCourseQueries.all(), "progress", String(lessonId)] as const,
      queryFn: () => getLessonProgress(lessonId),
      staleTime: 1000 * 60 * 2, // 2 minutes
    }),

  // مهمة درس محدد
  lessonTask: (lessonId: number | string) =>
    queryOptions({
      queryKey: [...studentCourseQueries.all(), "task", String(lessonId)] as const,
      queryFn: () => getLessonTask(lessonId),
      staleTime: 1000 * 60 * 10, // 10 minutes
    }),

  // معرفات الدروس المكتملة في الكورس (مخزنة في الكاش لمنع التكرار)
  completedLessons: (courseId: number | string, lessonIds: number[]) =>
    queryOptions({
      queryKey: [
        ...studentCourseQueries.all(),
        "completed-lessons",
        String(courseId),
        lessonIds.join(","),
      ] as const,
      queryFn: async (): Promise<number[]> => {
        if (!lessonIds.length) return [];
        const results = await Promise.all(
          lessonIds.map((id) =>
            getLessonProgress(id)
              .then((p) => (p.completed ? id : null))
              .catch(() => null),
          ),
        );
        return results.filter((id): id is number => id !== null);
      },
      staleTime: 1000 * 60 * 5, // 5 minutes cache
    }),

  // الدروس الجاري تعلمها (غير المكتملة وبها نسبة مشاهدة > 0)
  inProgressLessons: () =>
    queryOptions({
      queryKey: [...studentCourseQueries.all(), "in-progress-lessons"] as const,
      queryFn: async (): Promise<InProgressLesson[]> => {
        const enrollments = await getMyCourses();
        const approved = enrollments.filter((e) => e.status === "approved" && e.course);
        if (approved.length === 0) return [];

        const coursesWithSections = await Promise.all(
          approved.map(async (enrollment) => {
            try {
              const res = await api.get(`/courses/${enrollment.course.id}`);
              return res.data;
            } catch {
              return null;
            }
          }),
        );

        const allLessonEntries: { lesson: any; course: any; section: any }[] = [];
        for (const fullCourse of coursesWithSections) {
          if (!fullCourse?.sections) continue;
          for (const section of fullCourse.sections) {
            for (const lesson of section.lessons ?? []) {
              allLessonEntries.push({ lesson, course: fullCourse, section });
            }
          }
        }

        if (allLessonEntries.length === 0) return [];

        const progressResults = await Promise.all(
          allLessonEntries.map(async (entry) => {
            try {
              const prog = await getLessonProgress(entry.lesson.id);
              if (!prog.completed && prog.watched_percent > 0) {
                return {
                  id: entry.lesson.id,
                  title: entry.lesson.title,
                  watched_percent: prog.watched_percent,
                  course: {
                    id: entry.course.id,
                    title: entry.course.title,
                  },
                  section: {
                    id: entry.section.id,
                    title: entry.section.title,
                  },
                };
              }
              return null;
            } catch {
              return null;
            }
          }),
        );

        return progressResults.filter((item): item is InProgressLesson => item !== null);
      },
      staleTime: 1000 * 60 * 2, // 2 minutes
    }),
};
