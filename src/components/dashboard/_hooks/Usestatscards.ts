import { BookOpen, CheckCircle, Clock, Trophy, LucideIcon } from 'lucide-react';
import type { DashboardStatsResponse } from '@/lib/dashboardStats';
import { useDashboardStats } from './Usedashboardstats';

export interface StatCard {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
}

// الأرقام الهندية (٠١٢٣...). النسخة القديمة كانت تستبدل كل رقم بنفسه فما يتغير شي
const toArabicNum = (n: number) =>
  n.toString().replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[+d]);

// معرّفة برّا الـ hook عشان المرجع يبقى ثابت (React Query ما يعيد الحساب إلا لو تغيّرت البيانات)
const toStatCards = ({ stats }: DashboardStatsResponse): StatCard[] => [
  {
    icon: BookOpen,
    label: 'كورسات مسجّل فيها',
    color: 'blue',
    value: toArabicNum(stats.enrolled_courses),
  },
  {
    icon: CheckCircle,
    label: 'دروس مكتملة',
    color: 'green',
    value: toArabicNum(stats.completed_lessons),
  },
  {
    icon: Clock,
    label: 'ساعات تعلم',
    color: 'purple',
    value: toArabicNum(stats.learning_hours),
  },
  {
    icon: Trophy,
    label: 'كورسات مكتملة',
    color: 'yellow',
    value: toArabicNum(stats.completed_courses),
  },
];

// بيرجّع UseQueryResult<StatCard[]> (مش مصفوفة) لأن الـ component بيمرّره لـ <QueryState>
export function useStatsCards() {
  return useDashboardStats(toStatCards);
}