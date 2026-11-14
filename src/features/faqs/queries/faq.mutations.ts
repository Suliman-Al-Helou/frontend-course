/**
 * FAQ TanStack Query v5 Mutations Hook
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAdminFaq, updateAdminFaq, deleteAdminFaq } from "../api";
import { faqKeys } from "./faq.queries";
import type { FaqFormData } from "../types";

export function useFaqMutations() {
  const queryClient = useQueryClient();

  const createFaq = useMutation({
    mutationFn: (payload: FaqFormData) => createAdminFaq(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: faqKeys.all });
    },
  });

  const updateFaq = useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: Partial<FaqFormData> }) =>
      updateAdminFaq(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: faqKeys.all });
    },
  });

  const deleteFaq = useMutation({
    mutationFn: (id: number | string) => deleteAdminFaq(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: faqKeys.all });
    },
  });

  return { createFaq, updateFaq, deleteFaq };
}
