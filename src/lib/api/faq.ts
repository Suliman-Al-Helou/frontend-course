import api from "@/lib/api";

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

/**
 * جلب قائمة الأسئلة الشائعة من الـ Backend
 */
export async function getFaqs(): Promise<FaqItem[]> {
  const { data } = await api.get<{ data: FaqItem[] } | FaqItem[]>("/faqs");
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && Array.isArray(data.data)) return data.data;
  return [];
}
