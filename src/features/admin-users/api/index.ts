import api from "@/lib/api";
import type { AdminUser, UserRole } from "../types";

export async function getAdminUsers(): Promise<AdminUser[]> {
  const { data } = await api.get<AdminUser[] | { data: AdminUser[] }>("/admin/users");
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray((data as { data: AdminUser[] }).data)) {
    return (data as { data: AdminUser[] }).data;
  }
  return [];
}

export async function deleteAdminUser(id: number | string): Promise<void> {
  await api.delete(`/admin/users/${id}`);
}

export async function updateAdminUserRole(id: number | string, role: UserRole): Promise<AdminUser> {
  const { data } = await api.patch<AdminUser>(`/admin/users/${id}`, { role });
  return data;
}
