'use client';

import { CheckCircle2, Lock, PlayCircle, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import type { Course, Lesson } from '@/types';

interface LessonSidebarProps {
  course:          Course;
  currentLessonId: number;
  completedIds:    number[];
}

export default function LessonSidebar({ course, currentLessonId, completedIds }: LessonSidebarProps) {
  const [openSections, setOpenSections] = useState<number[]>(
    course.sections?.map(s => s.id) ?? []
  );
  const [toast, setToast] = useState(false);

  const toggle = (id: number) =>
    setOpenSections(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  const isCompleted = (id: number) => completedIds.includes(id);
  const isCurrent   = (id: number) => id === currentLessonId;

  const isUnlocked = (lesson: Lesson, allLessons: Lesson[]) => {
    const idx = allLessons.findIndex(l => l.id === lesson.id);
    if (idx === 0) return true;
    if (lesson.is_preview) return true;
    return isCompleted(allLessons[idx - 1].id);
  };

  const showToast = () => {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const allLessons = course.sections?.flatMap(s => s.lessons) ?? [];

  return (
    <aside className="w-full lg:w-80 bg-card rounded-2xl border border-border overflow-hidden flex-shrink-0 relative">

      {/* Toast */}
      {toast && (
        <div className="absolute top-4 left-4 right-4 z-50 bg-destructive text-white text-xs font-medium px-4 py-3 rounded-xl shadow-lg text-center">
          أكمل الدرس الحالي أولاً قبل الانتقال للتالي
        </div>
      )}

      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <h3 className="font-bold text-foreground text-sm line-clamp-2">{course.title}</h3>
        <p className="text-xs text-muted-foreground mt-1">
          {completedIds.length} / {allLessons.length} درس مكتمل
        </p>
        <div className="mt-2 h-1.5 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${allLessons.length ? (completedIds.length / allLessons.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Sections */}
      <div className="overflow-y-auto max-h-[calc(100vh-280px)]">
        {course.sections?.map(section => (
          <div key={section.id} className="border-b border-border last:border-0">

            <button
              onClick={() => toggle(section.id)}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
            >
              <span className="text-sm font-semibold text-foreground text-right">
                {section.title}
              </span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${openSections.includes(section.id) ? 'rotate-180' : ''}`} />
            </button>

            {openSections.includes(section.id) && (
              <div className="pb-1">
                {section.lessons.map(lesson => {
                  const unlocked  = isUnlocked(lesson, allLessons);
                  const completed = isCompleted(lesson.id);
                  const current   = isCurrent(lesson.id);

                  if (unlocked) {
                    return (
                      <Link
                        key={lesson.id}
                        href={`/courses/${course.id}/lessons/${lesson.id}`}
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                          current
                            ? 'bg-primary/10 text-primary font-medium border-r-2 border-primary'
                            : 'hover:bg-muted text-foreground/70'
                        }`}
                      >
                        <span className="flex-shrink-0">
                          {completed
                            ? <CheckCircle2 className="w-4 h-4 text-success" />
                            : current
                            ? <PlayCircle className="w-4 h-4 text-primary" />
                            : <PlayCircle className="w-4 h-4 text-muted-foreground" />}
                        </span>
                        <span className="flex-1 text-right line-clamp-2 leading-tight">{lesson.title}</span>
                        <span className="text-xs text-muted-foreground flex-shrink-0">{Math.floor(lesson.duration / 60)}د</span>
                      </Link>
                    );
                  }

                  return (
                    <button
                      key={lesson.id}
                      onClick={showToast}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm opacity-40 cursor-not-allowed"
                    >
                      <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="flex-1 text-right line-clamp-2 leading-tight text-foreground/70">{lesson.title}</span>
                      <span className="text-xs text-muted-foreground flex-shrink-0">{Math.floor(lesson.duration / 60)}د</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}