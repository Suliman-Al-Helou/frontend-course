"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BookOpen, Search, X } from "lucide-react";

export interface CoursesHeroProps {
  search: string;
  onSearch: (value: string) => void;
  totalCourses?: number;
}

export function CoursesHero({
  search,
  onSearch,
  totalCourses = 60,
}: CoursesHeroProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <header className="bg-gradient-to-br from-blue-deep via-blue-mid to-blue-light pt-28 pb-16 px-4 text-center">
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 bg-white/10 text-white rounded-full px-4 py-1.5 text-sm font-medium mb-6 backdrop-blur-xs">
          <BookOpen className="w-4 h-4" />
          جميع الكورسات
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
          اختر مسارك التقني
        </h1>

        <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
          +{totalCourses} كورس تقني عربي لكل المستويات
        </p>

        {/* Search Bar */}
        <div role="search" className="max-w-xl mx-auto relative">
          <Search
            aria-hidden="true"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none"
          />
          <input
            type="search"
            aria-label="ابحث عن كورس أو مهارة"
            placeholder="ابحث عن كورس أو مهارة..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-card rounded-2xl py-4 pr-12 pl-12 text-sm text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary shadow-2xl transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearch("")}
              aria-label="مسح البحث"
              className="absolute left-3 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    </header>
  );
}

