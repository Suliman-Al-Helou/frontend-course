/**
 * Instructor Portal TanStack Query v5 Factory
 */

import { queryOptions } from "@tanstack/react-query";
import {
  getInstructorCourses,
  getInstructorCourse,
  getInstructorSections,
  getInstructorLessonTask,
  getInstructorCourseYouTubeVideos,
  getInstructorCourseStudents,
} from "../api";
import type {
  InstructorCourse,
  InstructorSection,
  InstructorTask,
  CourseYouTubeVideosResponse,
  InstructorCourseStudentsResponse,
} from "../types";

export const instructorPortalKeys = {
  all: ["instructor-portal"] as const,
  courses: () => [...instructorPortalKeys.all, "courses"] as const,
  courseDetail: (id: number | string) =>
    [...instructorPortalKeys.all, "courses", String(id)] as const,
  sections: (courseId: number | string) =>
    [...instructorPortalKeys.all, "sections", String(courseId)] as const,
  task: (lessonId: number | string) =>
    [...instructorPortalKeys.all, "task", String(lessonId)] as const,
  youtubeVideos: (courseId: number | string) =>
    [...instructorPortalKeys.all, "youtube-videos", String(courseId)] as const,
  students: (courseId: number | string, page?: number) =>
    page !== undefined
      ? ([...instructorPortalKeys.all, "students", String(courseId), page] as const)
      : ([...instructorPortalKeys.all, "students", String(courseId)] as const),
};

export const instructorPortalQueries = {
  all: () => instructorPortalKeys.all,

  courses: () =>
    queryOptions({
      queryKey: instructorPortalKeys.courses(),
      queryFn: (): Promise<InstructorCourse[]> => getInstructorCourses(),
      staleTime: 1000 * 60 * 5, // 5 minutes fresh
      gcTime: 1000 * 60 * 30, // 30 minutes in memory
    }),

  courseDetail: (id: number | string) =>
    queryOptions({
      queryKey: instructorPortalKeys.courseDetail(id),
      queryFn: (): Promise<InstructorCourse> => getInstructorCourse(id),
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
    }),

  sections: (courseId: number | string) =>
    queryOptions({
      queryKey: instructorPortalKeys.sections(courseId),
      queryFn: (): Promise<InstructorSection[]> => getInstructorSections(courseId),
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
    }),

  task: (lessonId: number | string) =>
    queryOptions({
      queryKey: instructorPortalKeys.task(lessonId),
      queryFn: (): Promise<InstructorTask> => getInstructorLessonTask(lessonId),
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
    }),

  youtubeVideos: (courseId: number | string) =>
    queryOptions({
      queryKey: instructorPortalKeys.youtubeVideos(courseId),
      queryFn: (): Promise<CourseYouTubeVideosResponse> =>
        getInstructorCourseYouTubeVideos(courseId),
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
    }),

  students: (courseId: number | string, page?: number) =>
    queryOptions({
      queryKey: instructorPortalKeys.students(courseId, page),
      queryFn: (): Promise<InstructorCourseStudentsResponse> =>
        getInstructorCourseStudents(courseId, page),
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
    }),
};
