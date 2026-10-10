import { useEffect, useState } from 'react';
import { BookOpen, CheckCircle, Clock, Trophy, LucideIcon } from 'lucide-react';
import api from '@/lib/api';
import { getDashboardStats } from '@/lib/dashboardStats';

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
   getDashboardStats().then((data) => {
     setStats([
        { icon: BookOpen,    label: 'كورسات مسجّل فيها', color: 'blue',   value: toArabicNum(data.stats.enrolled_courses)  },
        { icon: CheckCircle, label: 'دروس مكتملة',        color: 'green',  value: toArabicNum(data.stats.completed_lessons) },
        { icon: Clock,       label: 'ساعات تعلم',          color: 'purple', value: toArabicNum(data.stats.learning_hours)    },
        { icon: Trophy,      label: 'كورسات مكتملة',       color: 'yellow', value: toArabicNum(data.stats.completed_courses) },
      ]);
    });
  }, []);

  return stats;
}