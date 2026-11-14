/**
 * Instructors TanStack Query v5 Mutations Hook
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAdminInstructor, updateAdminInstructor, deleteAdminInstructor } from "../api";
import { instructorKeys } from "./instructor.queries";
import type { InstructorFormData } from "../types";

export function useInstructorMutations() {
  const queryClient = useQueryClient();

  const createInstructor = useMutation({
    mutationFn: (payload: InstructorFormData) => createAdminInstructor(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: instructorKeys.all });
    },
  });

  const updateInstructor = useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: Partial<InstructorFormData> }) =>
      updateAdminInstructor(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: instructorKeys.all });
    },
  });

  const deleteInstructor = useMutation({
    mutationFn: (id: number | string) => deleteAdminInstructor(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: instructorKeys.all });
    },
  });

  return { createInstructor, updateInstructor, deleteInstructor };
}
