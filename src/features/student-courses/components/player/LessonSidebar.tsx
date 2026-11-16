"use client";

import Link from "next/link";
import { CheckCircle2, Lock, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { notify } from "@/components/ui/sonner";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

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
  const isCompleted = (id: number) => completedIds.includes(id);
  const isCurrent = (id: number) => id === currentLessonId;

  const allLessons = sections.flatMap((s) => s.lessons);
  const totalLessons = allLessons.length;
  const completedCount = completedIds.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const isUnlocked = (lesson: SidebarLesson) => {
    if (lesson.is_preview) return true;
    const lessonIdx = allLessons.findIndex((l) => l.id === lesson.id);
    if (lessonIdx === 0) return true;
    const prevLesson = allLessons[lessonIdx - 1];
    return isCompleted(prevLesson.id);
  };

  const triggerLockedAlert = () => {
    notify.error("هذا الدرس مغلق حالياً. يرجى إكمال الدرس السابق واجتياز مهمته التطبيقية لفتحه.");
  };

  const allSectionKeys = sections.map((s) => String(s.id));

  return (
    <aside
      aria-label="قائمة فصول ودروس الكورس"
      className="w-full lg:w-80 shrink-0 bg-card border border-border rounded-2xl overflow-hidden self-start sticky top-20 shadow-xs"
    >
      {/* Course Title and Progress Header */}
      <div className="p-4 border-b border-border bg-muted/20 space-y-3">
        <div>
          <span className="text-[11px] font-semibold text-primary">فهرس المحتوى</span>
          <h2 className="text-sm font-bold text-foreground truncate mt-0.5" title={courseTitle}>
            {courseTitle}
          </h2>
        </div>

        {/* Progress Bar Container */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">نسبة الإنجاز</span>
            <span className="font-semibold text-foreground font-mono">{progressPercent}%</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="شريط نسبة إنجاز دروس الكورس"
            className="w-full bg-muted rounded-full h-2 overflow-hidden"
          >
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300 motion-reduce:transition-none"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-muted-foreground pt-0.5">
            <span>
              {completedCount} من {totalLessons} درس مكتمل
            </span>
          </div>
        </div>
      </div>

      {/* Syllabus Sections Accordion */}
      <div className="overflow-y-auto max-h-[calc(100vh-280px)]">
        {totalLessons === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground">
            لم تتم إضافة أي دروس لهذا الكورس بعد.
          </div>
        ) : (
          <Accordion type="multiple" defaultValue={allSectionKeys} className="space-y-0 divide-y divide-border">
            {sections.map((section) => (
              <AccordionItem key={section.id} value={String(section.id)} className="rounded-none border-0 bg-transparent">
                <AccordionTrigger className="px-4 py-3 min-h-[44px]">
                  <span className="text-sm font-semibold text-foreground text-start">
                    {section.title}
                  </span>
                </AccordionTrigger>

                <AccordionContent className="pb-1 bg-muted/10 border-t-0 divide-y divide-border/40">
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
                      <Button
                        key={lesson.id}
                        type="button"
                        variant="ghost"
                        onClick={triggerLockedAlert}
                        className="w-full min-h-[44px] justify-start gap-3 px-4 py-2.5 text-sm text-muted-foreground/60 hover:bg-muted/20 font-normal rounded-lg motion-reduce:transition-none"
                        aria-label={`${lesson.title} - درس مغلق، اضغط لمعرفة كيفية الفتح`}
                      >
                        <Lock
                          className="w-4 h-4 text-muted-foreground/50 flex-shrink-0"
                          aria-hidden="true"
                        />
                        <span className="truncate flex-1 text-start">{lesson.title}</span>
                        <Badge variant="outline" size="sm" className="flex-shrink-0 text-[11px] font-normal">
                          مغلق
                        </Badge>
                      </Button>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </aside>
  );
}
