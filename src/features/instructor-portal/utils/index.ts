/**
 * Instructor Portal Utilities
 * Compliant with ADR 0017 and ADR 0022
 */

import type { TaskQuestion } from "../types";

/**
 * Extracts 11-character YouTube video ID from diverse URL formats or raw ID.
 */
export function extractYouTubeVideoId(input: string): string | null {
  if (!input || typeof input !== "string") {
    return null;
  }

  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }

  // Raw 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Regex matching watch?v=, youtu.be/, embed/, v/
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/,
  );

  return match ? match[1] : null;
}

/**
 * Directional Arrow Ordering: check if item can move up.
 */
export function canMoveUp(index: number): boolean {
  return index > 0;
}

/**
 * Directional Arrow Ordering: check if item can move down.
 */
export function canMoveDown(index: number, total: number): boolean {
  return index < total - 1;
}

/**
 * Swaps two items in an array immutably.
 */
export function swapArrayItems<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  if (
    fromIndex < 0 ||
    fromIndex >= items.length ||
    toIndex < 0 ||
    toIndex >= items.length
  ) {
    return items;
  }

  const result = [...items];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

/**
 * Validates a TaskQuestion against the canonical contract and Zero-Index Guard.
 */
export function validateTaskQuestion(question: TaskQuestion): {
  isValid: boolean;
  error?: string;
} {
  if (!question.question || !question.question.trim()) {
    return { isValid: false, error: "نص السؤال مطلوب" };
  }

  if (question.type === "mcq") {
    if (!Array.isArray(question.options) || question.options.length < 2) {
      return {
        isValid: false,
        error: "يجب توفير خيارين على الأقل لسؤال الاختيار من متعدد",
      };
    }

    const hasEmptyOption = question.options.some(
      (opt) => typeof opt !== "string" || !opt.trim(),
    );
    if (hasEmptyOption) {
      return { isValid: false, error: "لا يمكن ترك أي خيار فارغاً" };
    }
  }

  if (question.type === "true_false") {
    if (!Array.isArray(question.options) || question.options.length !== 2) {
      return { isValid: false, error: "سؤال صح / خطأ يتطلب خيارين بالضبط" };
    }
  }

  // Zero-Index Option Guard: 0 is a valid index!
  const correctIdx = question.correct_answer;
  if (
    correctIdx === null ||
    correctIdx === undefined ||
    typeof correctIdx !== "number" ||
    isNaN(correctIdx) ||
    correctIdx < 0 ||
    correctIdx >= question.options.length
  ) {
    return { isValid: false, error: "الإجابة الصحيحة المحددة غير صالحة" };
  }

  return { isValid: true };
}

export * from "./navigation";
export * from "./stats";

