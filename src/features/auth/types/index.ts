import type { User } from "@/types";
import type { components, operations } from "@/types/api.generated";

export type UserRole = "admin" | "student" | "instructor";

export type AuthUser = User;

export interface SessionData {
  token?: string;
  user?: AuthUser;
}

export type LoginPayload = components["schemas"]["LoginRequest"];
export type RegisterPayload = components["schemas"]["RegisterRequest"];

export type ForgotPasswordPayload =
  operations["passwordReset.forgotPassword"]["requestBody"]["content"]["application/json"];

export type ResetPasswordPayload =
  operations["passwordReset.resetPassword"]["requestBody"]["content"]["application/json"];

export interface AuthResponse {
  message?: string;
  user: AuthUser;
  token?: string;
}
