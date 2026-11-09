"use client";

import { BookOpen, CheckCircle, Clock, Trophy } from "lucide-react";
import { LABELS } from "../constants/labels";
import type { StatCardView, StudentHomeResponse } from "../types";
import { useStudentHomeStats } from "./useStudentHomeStats";

const numberFormat = new Intl.NumberFormat("ar");

const toStatCards = ({ stats }: StudentHomeResponse): StatCardView[] => [
  {
    key: "enrolled_courses",
    label: LABELS.stats.enrolled,
    icon: BookOpen,
    value: numberFormat.format(stats.enrolled_courses),
  },
  {
    key: "completed_lessons",
    label: LABELS.stats.lessons,
    icon: CheckCircle,
    value: numberFormat.format(stats.completed_lessons),
  },
  {
    key: "learning_hours",
    label: LABELS.stats.hours,
    icon: Clock,
    value: numberFormat.format(stats.learning_hours),
  },
  {
    key: "completed_courses",
    label: LABELS.stats.completed,
    icon: Trophy,
    value: numberFormat.format(stats.completed_courses),
  },
];

export function useStatCards() {
  return useStudentHomeStats(toStatCards);
}
