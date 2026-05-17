import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/api';

export interface ExamResult {
  lesson: string;
  course: string;
  score: number;
  passed: boolean;
  date: string;
}

export function useExamResults() {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [passRate, setPassRate] = useState(0);

  useEffect(() => {
    api.get('/dashboard/stats').then(({ data }) => {
      setResults(data.exam_results);
      setPassRate(data.pass_rate);
    });
  }, []);

  return { results, passRate };
}

export function scoreColorClass(score: number): string {
  if (score >= 90) return 'text-green-600 bg-green-50';
  if (score >= 70) return 'text-blue-600 bg-blue-50';
  if (score >= 50) return 'text-orange-600 bg-orange-50';
  return 'text-red-600 bg-red-50';
}