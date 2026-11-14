import api from "@/lib/api";
import type {
  AuthUser,
  LoginPayload,
  RegisterPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  AuthResponse,
} from "../types";

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const { data } = await api.get<{ user: AuthUser | null }>("/auth/me");
    return data?.user ?? null;
  } catch {
    return null;
  }
}

export async function loginApi(payload: LoginPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/login", payload);
  return data;
}

export async function registerApi(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/register", payload);
  return data;
}

export async function logoutApi(): Promise<void> {
  await api.post("/auth/logout");
}

export async function forgotPasswordApi(
  payload: ForgotPasswordPayload,
): Promise<{ message?: string }> {
  const { data } = await api.post<{ message?: string }>("/auth/forgot-password", payload);
  return data;
}

export async function resetPasswordApi(
  payload: ResetPasswordPayload,
): Promise<{ message?: string }> {
  const { data } = await api.post<{ message?: string }>("/auth/reset-password", payload);
  return data;
}
