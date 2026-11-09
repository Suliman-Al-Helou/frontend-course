"use client";

import type { ExamResult, StudentHomeResponse } from "../types";
import { useStudentHomeStats } from "./useStudentHomeStats";

interface ExamResultsView {
  results: ExamResult[];
  passRate: number;
}
// the select(filter) function - get spicifce data
const toExamResults = (data: StudentHomeResponse): ExamResultsView => ({
  results: data.exam_results,
  passRate: data.pass_rate,
});

export function useExamResults() {
  return useStudentHomeStats(toExamResults);
}
