/**
 * Frequently Asked Questions (FAQ) API Client
 */

import api from "@/lib/api";
import type { components } from "@/types/api.generated";
import type { FaqItem, FaqFormData } from "../types";

type RawFaq = components["schemas"]["FaqResource"];
type RawFaqRequest = components["schemas"]["FaqRequest"];
type RawUpdateFaqRequest = components["schemas"]["UpdateFaqRequest"];

function toFaqItem(raw: RawFaq | FaqItem): FaqItem {
  return {
    id: Number(raw.id),
    question: raw.question || "",
    answer: raw.answer || "",
    order: raw.order !== undefined ? Number(raw.order) : undefined,
    created_at: "created_at" in raw ? raw.created_at : undefined,
    updated_at: "updated_at" in raw ? raw.updated_at : undefined,
  };
}

export async function getPublicFaqs(): Promise<FaqItem[]> {
  const { data } = await api.get<{ data: RawFaq[] } | RawFaq[]>("/faqs");
  const list = Array.isArray(data)
    ? data
    : data && typeof data === "object" && Array.isArray(data.data)
      ? data.data
      : [];
  return list.map((item) => toFaqItem(item));
}

export async function getAdminFaqs(): Promise<FaqItem[]> {
  const { data } = await api.get<{ data: RawFaq[] } | RawFaq[]>("/admin/faqs");
  const list = Array.isArray(data)
    ? data
    : data && typeof data === "object" && Array.isArray(data.data)
      ? data.data
      : [];
  return list.map((item) => toFaqItem(item));
}

export async function createAdminFaq(payload: FaqFormData): Promise<FaqItem> {
  const requestBody: RawFaqRequest = payload;
  const { data } = await api.post<{ data: RawFaq } | RawFaq>("/admin/faqs", requestBody);
  const raw =
    data && typeof data === "object" && "data" in data ? (data as { data: RawFaq }).data : data;
  return toFaqItem(raw);
}

export async function updateAdminFaq(
  id: number | string,
  payload: Partial<FaqFormData>,
): Promise<FaqItem> {
  const requestBody: RawUpdateFaqRequest = payload;
  const { data } = await api.put<{ data: RawFaq } | RawFaq>(`/admin/faqs/${id}`, requestBody);
  const raw =
    data && typeof data === "object" && "data" in data ? (data as { data: RawFaq }).data : data;
  return toFaqItem(raw);
}

export async function deleteAdminFaq(id: number | string): Promise<void> {
  await api.delete(`/admin/faqs/${id}`);
}
