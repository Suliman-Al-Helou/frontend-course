export type UserRole = "student" | "admin";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export type UserFilterStatus = "all" | "active" | "paid" | "no-courses";
