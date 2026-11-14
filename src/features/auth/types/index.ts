import type { User } from "@/types";

export type UserRole = "admin" | "student";

export type AuthUser = User;

export interface SessionData {
  token?: string;
  user?: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  message?: string;
  user: AuthUser;
  token?: string;
}
