import { useEffect, useState } from 'react';
import { BookOpen, CheckCircle, Clock, Trophy, LucideIcon } from 'lucide-react';
import api from '@/lib/api';

export interface StatCard {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
}

const toArabicNum = (n: number) =>
  n.toString().replace(/\d/g, d => '0123456789'[+d]);

export function useStatsCards() {
  const [stats, setStats] = useState<StatCard[]>([]);

  useEffect(() => {
    api.get('/dashboard/stats').then(({ data }) => {
      setStats([
        { icon: BookOpen,    label: 'كورسات مسجّل فيها', color: 'bg-blue-50 text-primary',       value: toArabicNum(data.stats.enrolled_courses)  },
        { icon: CheckCircle, label: 'دروس مكتملة',        color: 'bg-green-50 text-green-600',   value: toArabicNum(data.stats.completed_lessons) },
        { icon: Clock,       label: 'ساعات تعلم',          color: 'bg-purple-50 text-purple-600', value: toArabicNum(data.stats.learning_hours)    },
        { icon: Trophy,      label: 'كورسات مكتملة',       color: 'bg-yellow-50 text-yellow-600', value: toArabicNum(data.stats.completed_courses) },
      ]);
    });
  }, []);

  return stats;
}