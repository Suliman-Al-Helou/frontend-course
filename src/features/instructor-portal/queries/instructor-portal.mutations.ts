/**
 * Instructor Portal TanStack Query v5 Mutations
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateInstructorCourse,
  createInstructorSection,
  updateInstructorSection,
  deleteInstructorSection,
  createInstructorLesson,
  updateInstructorLesson,
  deleteInstructorLesson,
  saveInstructorLessonTask,
  deleteInstructorLessonTask,
} from "../api";
import { instructorPortalKeys } from "./instructor-portal.queries";
import type { InstructorCourse, InstructorLesson, InstructorTask } from "../types";

export function useUpdateInstructorCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      payload,
    }: {
      courseId: number | string;
      payload: Partial<InstructorCourse> | FormData;
    }) => updateInstructorCourse(courseId, payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: instructorPortalKeys.courseDetail(variables.courseId),
      });
      void queryClient.invalidateQueries({
        queryKey: instructorPortalKeys.courses(),
      });
    },
  });
}

export function useCreateInstructorSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      courseId,
      payload,
    }: {
      courseId: number | string;
      payload: { title: string; order?: number };
    }) => createInstructorSection(courseId, payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: instructorPortalKeys.sections(variables.courseId),
      });
    },
  });
}

export function useUpdateInstructorSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sectionId,
      payload,
    }: {
      sectionId: number | string;
      courseId?: number | string;
      payload: { title?: string; order?: number };
    }) => updateInstructorSection(sectionId, payload),
    onSuccess: (_data, variables) => {
      if (variables.courseId !== undefined) {
        void queryClient.invalidateQueries({
          queryKey: instructorPortalKeys.sections(variables.courseId),
        });
      } else {
        void queryClient.invalidateQueries({
          queryKey: instructorPortalKeys.all,
        });
      }
    },
  });
}

export function useDeleteInstructorSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sectionId }: { sectionId: number | string; courseId?: number | string }) =>
      deleteInstructorSection(sectionId),
    onSuccess: (_data, variables) => {
      if (variables.courseId !== undefined) {
        void queryClient.invalidateQueries({
          queryKey: instructorPortalKeys.sections(variables.courseId),
        });
      } else {
        void queryClient.invalidateQueries({
          queryKey: instructorPortalKeys.all,
        });
      }
    },
  });
}

export function useCreateInstructorLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sectionId,
      payload,
    }: {
      sectionId: number | string;
      courseId?: number | string;
      payload: Partial<InstructorLesson>;
    }) => createInstructorLesson(sectionId, payload),
    onSuccess: (_data, variables) => {
      if (variables.courseId !== undefined) {
        void queryClient.invalidateQueries({
          queryKey: instructorPortalKeys.sections(variables.courseId),
        });
        void queryClient.invalidateQueries({
          queryKey: instructorPortalKeys.youtubeVideos(variables.courseId),
        });
      } else {
        void queryClient.invalidateQueries({
          queryKey: instructorPortalKeys.all,
        });
      }
    },
  });
}

export function useUpdateInstructorLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      lessonId,
      payload,
    }: {
      lessonId: number | string;
      courseId?: number | string;
      payload: Partial<InstructorLesson>;
    }) => updateInstructorLesson(lessonId, payload),
    onSuccess: (_data, variables) => {
      if (variables.courseId !== undefined) {
        void queryClient.invalidateQueries({
          queryKey: instructorPortalKeys.sections(variables.courseId),
        });
      } else {
        void queryClient.invalidateQueries({
          queryKey: instructorPortalKeys.all,
        });
      }
    },
  });
}

export function useDeleteInstructorLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lessonId }: { lessonId: number | string; courseId?: number | string }) =>
      deleteInstructorLesson(lessonId),
    onSuccess: (_data, variables) => {
      if (variables.courseId !== undefined) {
        void queryClient.invalidateQueries({
          queryKey: instructorPortalKeys.sections(variables.courseId),
        });
        void queryClient.invalidateQueries({
          queryKey: instructorPortalKeys.youtubeVideos(variables.courseId),
        });
      } else {
        void queryClient.invalidateQueries({
          queryKey: instructorPortalKeys.all,
        });
      }
    },
  });
}

export function useSaveInstructorTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      lessonId,
      payload,
      isUpdate = false,
    }: {
      lessonId: number | string;
      courseId?: number | string;
      payload: Partial<InstructorTask>;
      isUpdate?: boolean;
    }) => saveInstructorLessonTask(lessonId, payload, isUpdate),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: instructorPortalKeys.task(variables.lessonId),
      });
      if (variables.courseId !== undefined) {
        void queryClient.invalidateQueries({
          queryKey: instructorPortalKeys.sections(variables.courseId),
        });
      }
    },
  });
}

export function useDeleteInstructorTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lessonId }: { lessonId: number | string; courseId?: number | string }) =>
      deleteInstructorLessonTask(lessonId),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: instructorPortalKeys.task(variables.lessonId),
      });
      if (variables.courseId !== undefined) {
        void queryClient.invalidateQueries({
          queryKey: instructorPortalKeys.sections(variables.courseId),
        });
      }
    },
  });
}
