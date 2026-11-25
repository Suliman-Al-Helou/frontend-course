import api from "@/lib/api";
import type { components } from "@/types/api.generated";
import type { AdminUser, UserRole } from "../types";

type RawUserAdmin = components["schemas"]["UserAdminResource"];

export function toAdminUser(raw: RawUserAdmin | AdminUser): AdminUser {
  return {
    id: Number(raw.id),
    name: raw.name || "",
    email: raw.email || "",
    role: raw.role === "admin" ? "admin" : "student",
    created_at: raw.created_at || "",
  };
}

export async function getAdminUsers(params?: {
  search?: string;
  limit?: number;
  unlinked_only?: boolean;
}): Promise<AdminUser[]> {
  const { data } = await api.get<RawUserAdmin[] | { data: RawUserAdmin[] }>("/admin/users", {
    params,
  });
  const list = Array.isArray(data)
    ? data
    : data && typeof data === "object" && Array.isArray(data.data)
      ? data.data
      : [];
  return list.map((item) => toAdminUser(item));
}

export async function deleteAdminUser(id: number | string): Promise<void> {
  await api.delete(`/admin/users/${id}`);
}

export async function updateAdminUserRole(id: number | string, role: UserRole): Promise<AdminUser> {
  const { data } = await api.patch<RawUserAdmin | { data: RawUserAdmin }>(`/admin/users/${id}`, {
    role,
  });
  const raw =
    data && typeof data === "object" && "data" in data
      ? (data as { data: RawUserAdmin }).data
      : data;
  return toAdminUser(raw);
}
