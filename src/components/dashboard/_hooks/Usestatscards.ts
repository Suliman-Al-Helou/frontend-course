// src/components/dashboard/_hooks/useStatsCards.ts

import { useMemo } from 'react';
import { BookOpen, CheckCircle, Clock, Trophy, LucideIcon } from 'lucide-react';

export interface StatCard {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
}

// ← مؤقت: بيانات ثابتة ريثما يصير Dashboard Stats API
// لما API جاهز، استبدل بـ:
//   const { data } = api.get('/dashboard/stats')
//   ثم map البيانات على STAT_CONFIG أدناه
const MOCK_STATS = {
  enrolledCourses:   '٣',
  completedLessons:  '٢٨',
  learningHours:     '١٨',
  completedCourses:  '١',
};

// الإعدادات الثابتة (icons + labels + colors) منفصلة عن القيم
const STAT_CONFIG: Omit<StatCard, 'value'>[] = [
  { icon: BookOpen,     label: 'كورسات مسجّل فيها', color: 'bg-blue-50 text-primary'      },
  { icon: CheckCircle,  label: 'دروس مكتملة',        color: 'bg-green-50 text-green-600'   },
  { icon: Clock,        label: 'ساعات تعلم',          color: 'bg-purple-50 text-purple-600' },
  { icon: Trophy,       label: 'كورسات مكتملة',       color: 'bg-yellow-50 text-yellow-600' },
];

export function useStatsCards(): StatCard[] {
  return useMemo<StatCard[]>(() => [
    { ...STAT_CONFIG[0], value: MOCK_STATS.enrolledCourses  },
    { ...STAT_CONFIG[1], value: MOCK_STATS.completedLessons },
    { ...STAT_CONFIG[2], value: MOCK_STATS.learningHours    },
    { ...STAT_CONFIG[3], value: MOCK_STATS.completedCourses },
  ], []);
}