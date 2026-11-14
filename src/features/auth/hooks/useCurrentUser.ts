"use client";

import { useQuery } from "@tanstack/react-query";
import { authQueries } from "../queries/auth.queries";
import { useLogoutMutation } from "../queries/auth.mutations";
import type { AuthUser } from "../types";

export interface CurrentUserHookResult {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
  isLoggingOut: boolean;
}

/**
 * useCurrentUser: Declarative hook consuming TanStack Query v5 session cache.
 * Serves as the single authoritative client-side source of truth for user authentication.
 */
export function useCurrentUser(): CurrentUserHookResult {
  const { data: user, isLoading } = useQuery(authQueries.user());
  const logoutMutation = useLogoutMutation();

  return {
    user: user ?? null,
    isAuthenticated: Boolean(user),
    isLoading,
    logout: () => {
      logoutMutation.mutate();
    },
    isLoggingOut: logoutMutation.isPending,
  };
}
