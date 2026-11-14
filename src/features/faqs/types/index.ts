/**
 * Frequently Asked Questions (FAQ) Domain Types
 */

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface FaqFormData {
  question: string;
  answer: string;
  order?: number;
}
