import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { loginApi, registerApi, logoutApi } from "../api";
import { authQueries } from "./auth.queries";
import type { LoginPayload, RegisterPayload, AuthResponse } from "../types";

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginApi(payload),
    onSuccess: (data: AuthResponse) => {
      queryClient.setQueryData(authQueries.user().queryKey, data.user);
    },
  });
}

export function useRegisterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerApi(payload),
    onSuccess: (data: AuthResponse) => {
      queryClient.setQueryData(authQueries.user().queryKey, data.user);
    },
  });
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => logoutApi(),
    onSuccess: () => {
      // تفريغ كامل الكاش من الذاكرة لمنع تسريب بيانات الطالب أو لوحة الأدمن
      queryClient.clear();
      queryClient.setQueryData(authQueries.user().queryKey, null);
      router.push("/login");
      router.refresh();
    },
    onError: () => {
      // حتى في حال حدوث خطأ من السيرفر، نفرغ الكاش محلياً لضمان الأمان
      queryClient.clear();
      queryClient.setQueryData(authQueries.user().queryKey, null);
      router.push("/login");
      router.refresh();
    },
  });
}
