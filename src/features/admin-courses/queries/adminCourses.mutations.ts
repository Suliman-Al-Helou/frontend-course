import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAdminCourse,
  updateAdminCourse,
  deleteAdminCourse,
  createCourseSection,
  deleteCourseSection,
  createCourseLesson,
  updateCourseLesson,
  deleteCourseLesson,
  saveAdminLessonTask,
  updateEnrollmentStatus,
  createAdminEnrollment,
} from "../api";
import { adminCourseQueries, adminEnrollmentQueries } from "./adminCourses.queries";
import type {
  CourseFormData,
  AdminLesson,
  AdminTaskPayload,
  EnrollmentStatus,
  CreateEnrollmentPayload,
} from "../types";

/**
 * هوكس الميوتيشن الخاصة بالكورسات (إضافة / تعديل / حذف)
 */
export function useCreateCourseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CourseFormData) => createAdminCourse(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminCourseQueries.all() });
      void queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

export function useUpdateCourseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: CourseFormData }) =>
      updateAdminCourse(id, data),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: adminCourseQueries.all() });
      void queryClient.invalidateQueries({
        queryKey: [...adminCourseQueries.all(), "detail", String(variables.id)],
      });
      void queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

export function useDeleteCourseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number | string) => deleteAdminCourse(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminCourseQueries.all() });
      void queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

/**
 * هوكس الميوتيشن الخاصة بالأقسام والدروس
 */
export function useSectionMutations(courseId: number | string) {
  const queryClient = useQueryClient();

  const invalidateSections = () => {
    void queryClient.invalidateQueries({
      queryKey: adminCourseQueries.sections(courseId).queryKey,
    });
    void queryClient.invalidateQueries({
      queryKey: ["courses", "detail", String(courseId)],
    });
  };

  const createSection = useMutation({
    mutationFn: (payload: { title: string; order: number }) =>
      createCourseSection(courseId, payload),
    onSuccess: invalidateSections,
  });

  const deleteSection = useMutation({
    mutationFn: (sectionId: number | string) => deleteCourseSection(sectionId),
    onSuccess: invalidateSections,
  });

  const createLesson = useMutation({
    mutationFn: ({
      sectionId,
      data,
    }: {
      sectionId: number | string;
      data: {
        title: string;
        video_id: string;
        duration: number;
        order: number;
        is_preview: boolean;
      };
    }) => createCourseLesson(sectionId, data),
    onSuccess: invalidateSections,
  });

  const updateLesson = useMutation({
    mutationFn: ({
      lessonId,
      data,
    }: {
      lessonId: number | string;
      data: Partial<AdminLesson>;
    }) => updateCourseLesson(lessonId, data),
    onSuccess: invalidateSections,
  });

  const deleteLesson = useMutation({
    mutationFn: (lessonId: number | string) => deleteCourseLesson(lessonId),
    onSuccess: invalidateSections,
  });

  return {
    createSection,
    deleteSection,
    createLesson,
    updateLesson,
    deleteLesson,
  };
}

/**
 * هوك حفظ مهمة / اختبار الدرس
 */
export function useSaveTaskMutation(lessonId: number | string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      payload,
      isUpdate,
    }: {
      payload: AdminTaskPayload;
      isUpdate: boolean;
    }) => saveAdminLessonTask(lessonId, payload, isUpdate),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: adminCourseQueries.task(lessonId).queryKey,
      });
      void queryClient.invalidateQueries({
        queryKey: ["student-courses", "task", String(lessonId)],
      });
    },
  });
}

/**
 * هوكس التسجيلات للوحة الأدمن
 */
export function useEnrollmentMutations() {
  const queryClient = useQueryClient();

  const updateStatus = useMutation({
    mutationFn: ({
      id,
      status,
      paymentConfirmed,
    }: {
      id: number | string;
      status: EnrollmentStatus;
      paymentConfirmed: boolean;
    }) => updateEnrollmentStatus(id, status, paymentConfirmed),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminEnrollmentQueries.all() });
      void queryClient.invalidateQueries({ queryKey: adminCourseQueries.all() });
      void queryClient.invalidateQueries({ queryKey: ["student-courses"] });
    },
  });

  const createEnrollment = useMutation({
    mutationFn: (payload: CreateEnrollmentPayload) => createAdminEnrollment(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminEnrollmentQueries.all() });
      void queryClient.invalidateQueries({ queryKey: adminCourseQueries.all() });
    },
  });

  return {
    updateStatus,
    createEnrollment,
  };
}

