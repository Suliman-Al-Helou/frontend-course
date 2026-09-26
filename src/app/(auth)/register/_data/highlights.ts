import { Award, Star, Users, type LucideIcon } from 'lucide-react';

export interface Highlight {
  icon: LucideIcon;
  text: string;
}

export const HIGHLIGHTS: Highlight[] = [
  { icon: Users, text: '+١٢,٠٠٠ طالب انضموا بالفعل' },
  { icon: Award, text: 'شهادات معتمدة عند الإتمام' },
  { icon: Star,  text: 'مدربون خبراء بتقييم ٤.٩' },
];