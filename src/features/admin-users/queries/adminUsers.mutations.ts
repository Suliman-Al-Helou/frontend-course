import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAdminUser, updateAdminUserRole } from "../api";
import { adminUserQueries } from "./adminUsers.queries";
import type { UserRole } from "../types";

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => deleteAdminUser(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminUserQueries.all() });
      void queryClient.invalidateQueries({ queryKey: ["admin-enrollments"] });
    },
  });
}

export function useUpdateUserRoleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: number | string; role: UserRole }) =>
      updateAdminUserRole(id, role),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminUserQueries.all() });
    },
  });
}
