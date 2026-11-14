/**
 * Frequently Asked Questions (FAQ) API Client
 */

import api from "@/lib/api";
import type { FaqItem, FaqFormData } from "../types";

export async function getPublicFaqs(): Promise<FaqItem[]> {
  const { data } = await api.get<{ data: FaqItem[] } | FaqItem[]>("/faqs");
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray((data as { data: FaqItem[] }).data)) {
    return (data as { data: FaqItem[] }).data;
  }
  return [];
}

export async function getAdminFaqs(): Promise<FaqItem[]> {
  const { data } = await api.get<{ data: FaqItem[] } | FaqItem[]>("/admin/faqs");
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray((data as { data: FaqItem[] }).data)) {
    return (data as { data: FaqItem[] }).data;
  }
  return [];
}

export async function createAdminFaq(payload: FaqFormData): Promise<FaqItem> {
  const { data } = await api.post<{ data: FaqItem } | FaqItem>("/admin/faqs", payload);
  if (data && typeof data === "object" && "data" in data) {
    return (data as { data: FaqItem }).data;
  }
  return data as FaqItem;
}

export async function updateAdminFaq(
  id: number | string,
  payload: Partial<FaqFormData>,
): Promise<FaqItem> {
  const { data } = await api.put<{ data: FaqItem } | FaqItem>(`/admin/faqs/${id}`, payload);
  if (data && typeof data === "object" && "data" in data) {
    return (data as { data: FaqItem }).data;
  }
  return data as FaqItem;
}

export async function deleteAdminFaq(id: number | string): Promise<void> {
  await api.delete(`/admin/faqs/${id}`);
}
