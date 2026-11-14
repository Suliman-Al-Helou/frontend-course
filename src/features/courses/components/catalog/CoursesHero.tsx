"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";

export interface CoursesHeroProps {
  search: string;
  onSearch: (value: string) => void;
  totalCourses?: number;
}

export function CoursesHero({ search, onSearch, totalCourses = 60 }: CoursesHeroProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <header className="bg-gradient-to-br from-blue-deep via-blue-mid to-blue-light pt-28 pb-16 px-4 text-center">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 bg-white/10 text-main rounded-full px-4 py-1.5 text-sm font-medium mb-6 backdrop-blur-xs">
          <BookOpen className="w-4 h-4" />
          جميع الكورسات
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-main mb-4 tracking-tight">
          اختر مسارك التقني
        </h1>

        <p className="text-main/80 text-lg mb-10 max-w-xl mx-auto">
          +{totalCourses} كورس تقني عربي لكل المستويات
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto">
          <SearchInput
            placeholder="ابحث عن كورس أو مهارة..."
            aria-label="ابحث عن كورس أو مهارة"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            onClear={() => onSearch("")}
            className="h-12 py-3 shadow-2xl rounded-2xl bg-card border-border"
          />
        </div>
      </motion.div>
    </header>
  );
}
