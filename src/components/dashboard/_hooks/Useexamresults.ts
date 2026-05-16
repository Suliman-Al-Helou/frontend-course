// src/components/dashboard/_hooks/useExamResults.ts

import { useMemo } from 'react';

export interface ExamResult {
  lesson: string;
  course: string;
  score: number;
  passed: boolean;
  date: string;
}

// ← مؤقت: بيانات ثابتة ريثما يصير Tasks API
// لما Tasks API يصير جاهز، استبدل هذا بـ:
//   const [results, setResults] = useState<ExamResult[]>([]);
//   useEffect(() => { api.get('/task-attempts').then(...) }, []);
const MOCK_RESULTS: ExamResult[] = [
  { lesson: 'الدوال والمعاملات',   course: 'Python', score: 90,  passed: true,  date: '٢٠٢٦/٥/٨' },
  { lesson: 'الحلقات والتكرار',    course: 'Python', score: 75,  passed: true,  date: '٢٠٢٦/٥/٧' },
  { lesson: 'React Hooks المتقدمة', course: 'React',  score: 55,  passed: false, date: '٢٠٢٦/٥/٦' },
  { lesson: 'الـ State Management', course: 'React',  score: 80,  passed: true,  date: '٢٠٢٦/٥/٥' },
  { lesson: 'متغيرات Python',       course: 'Python', score: 100, passed: true,  date: '٢٠٢٦/٥/٤' },
];

export function useExamResults() {
  const results = MOCK_RESULTS;

  const passRate = useMemo(() => {
    if (!results.length) return 0;
    return Math.round((results.filter(e => e.passed).length / results.length) * 100);
  }, [results]);

  return { results, passRate };
}

export function scoreColorClass(score: number): string {
  if (score >= 90) return 'text-green-600 bg-green-50';
  if (score >= 70) return 'text-blue-600 bg-blue-50';
  if (score >= 50) return 'text-orange-600 bg-orange-50';
  return 'text-red-600 bg-red-50';
}