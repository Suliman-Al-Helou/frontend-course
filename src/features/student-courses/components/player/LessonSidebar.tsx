"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Lock, PlayCircle, ChevronDown } from "lucide-react";
import { notify } from "@/components/ui/sonner";

export interface SidebarLesson {
  id: number;
  title: string;
  duration?: string | number;
  is_preview?: boolean;
}

export interface SidebarSection {
  id: number;
  title: string;
  order?: number;
  lessons: SidebarLesson[];
}

export interface LessonSidebarProps {
  courseId: number | string;
  courseTitle: string;
  sections: SidebarSection[];
  currentLessonId: number;
  completedIds: number[];
}

export function LessonSidebar({
  courseId,
  courseTitle,
  sections,
  currentLessonId,
  completedIds,
}: LessonSidebarProps) {
  const [openSections, setOpenSections] = useState<number[]>(() =>
    sections.map((s) => s.id),
  );

  const toggleSection = (id: number) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const isCompleted = (id: number) => completedIds.includes(id);
  const isCurrent = (id: number) => id === currentLessonId;

  const allLessons = sections.flatMap((s) => s.lessons);
  const totalLessons = allLessons.length;
  const completedCount = completedIds.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const isUnlocked = (lesson: SidebarLesson) => {
    const idx = allLessons.findIndex((l) => l.id === lesson.id);
    if (idx <= 0) return true;
    if (lesson.is_preview) return true;
    return isCompleted(allLessons[idx - 1].id);
  };

  const triggerLockedAlert = () => {
    notify.warning("يرجى إكمال الدرس السابق واجتياز مهمته لفتح هذا الدرس");
  };

  return (
    <aside
      aria-label="فهرس دروس الكورس"
      className="w-full lg:w-80 bg-card rounded-2xl border border-border overflow-hidden flex-shrink-0 flex flex-col relative"
    >
      {/* Header & Course Progress */}
      <div className="p-4 border-b border-border bg-muted/40">
        <h2 className="font-bold text-foreground text-sm line-clamp-2 leading-snug">
          {courseTitle}
        </h2>
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-2 mb-1.5">
          <span>
            {completedCount} من {totalLessons} درس مكتمل
          </span>
          <span className="font-semibold text-foreground">{progressPercent}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="نسبة إنجاز دروس الكورس"
          className="h-1.5 w-full bg-border rounded-full overflow-hidden"
        >
          <div
            className="h-full bg-primary rounded-full transition-all duration-300 motion-reduce:transition-none"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Syllabus Sections Accordion */}
      <div className="overflow-y-auto max-h-[calc(100vh-280px)] divide-y divide-border">
        {sections.map((section) => {
          const isOpen = openSections.includes(section.id);
          const headerId = `section-header-${section.id}`;
          const contentId = `section-content-${section.id}`;

          return (
            <div key={section.id}>
              <button
                type="button"
                id={headerId}
                aria-expanded={isOpen}
                aria-controls={contentId}
                onClick={() => toggleSection(section.id)}
                className="w-full min-h-[44px] flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              >
                <span className="text-sm font-semibold text-foreground text-start">
                  {section.title}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {isOpen && (
                <div id={contentId} role="region" aria-labelledby={headerId} className="pb-1 bg-muted/10">
                  {section.lessons.map((lesson) => {
                    const unlocked = isUnlocked(lesson);
                    const completed = isCompleted(lesson.id);
                    const current = isCurrent(lesson.id);

                    if (unlocked) {
                      return (
                        <Link
                          key={lesson.id}
                          href={`/courses/${courseId}/lessons/${lesson.id}`}
                          aria-current={current ? "step" : undefined}
                          className={`min-h-[44px] flex items-center gap-3 px-4 py-2.5 text-sm transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-lg ${
                            current
                              ? "bg-primary/10 text-primary font-semibold border-s-2 border-primary"
                              : "hover:bg-muted/60 text-foreground/80 hover:text-foreground"
                          }`}
                        >
                          {completed ? (
                            <CheckCircle2
                              className="w-4 h-4 text-success flex-shrink-0"
                              aria-label="درس مكتمل"
                            />
                          ) : (
                            <PlayCircle
                              className={`w-4 h-4 flex-shrink-0 ${
                                current ? "text-primary" : "text-muted-foreground"
                              }`}
                              aria-hidden="true"
                            />
                          )}
                          <span className="truncate flex-1 text-start">{lesson.title}</span>
                          {lesson.duration && (
                            <span className="text-xs text-muted-foreground flex-shrink-0 font-mono">
                              {lesson.duration}
                            </span>
                          )}
                        </Link>
                      );
                    }

                    return (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={triggerLockedAlert}
                        className="w-full min-h-[44px] flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground/60 hover:bg-muted/20 transition-colors text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-lg motion-reduce:transition-none"
                        aria-label={`${lesson.title} - درس مغلق، اضغط لمعرفة كيفية الفتح`}
                      >
                        <Lock className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" aria-hidden="true" />
                        <span className="truncate flex-1">{lesson.title}</span>
                        <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground flex-shrink-0">
                          مغلق
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
