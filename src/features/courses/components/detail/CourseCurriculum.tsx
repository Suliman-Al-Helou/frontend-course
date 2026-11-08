"use client";

import { useState } from "react";
import { Lock, Play, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import type { CourseSectionUI } from "../../index";

export function useCurriculumAccordion() {
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({
    0: true,
  });
  const toggle = (i: number) => setOpenSections((prev) => ({ ...prev, [i]: !prev[i] }));
  return { openSections, toggle };
}

export interface CourseCurriculumProps {
  sections: CourseSectionUI[];
  courseId: string;
  enrolled: boolean;
}

export function CourseCurriculum({ sections, courseId, enrolled }: CourseCurriculumProps) {
  const { openSections, toggle } = useCurriculumAccordion();

  return (
    <section>
      <h2 className="text-xl font-bold text-foreground mb-5">منهج الكورس</h2>
      <div className="space-y-3">
        {sections.map((section, i) => (
          <div key={section.id ?? i} className="border border-border rounded-xl overflow-hidden">
            <button
              id={`section-btn-${section.id ?? i}`}
              onClick={() => toggle(i)}
              aria-expanded={Boolean(openSections[i])}
              aria-controls={`section-panel-${section.id ?? i}`}
              className="w-full flex items-center justify-between p-4 bg-muted/50 hover:bg-muted transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none text-start"
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold text-foreground">{section.title}</span>
                <span className="text-xs text-muted-foreground">{section.lessons.length} دروس</span>
              </div>
              {openSections[i] ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </button>

            {openSections[i] && (
              <div
                id={`section-panel-${section.id ?? i}`}
                role="region"
                aria-labelledby={`section-btn-${section.id ?? i}`}
                className="divide-y divide-border"
              >
                {section.lessons.map((lesson) => {
                  const canAccess = enrolled || lesson.is_preview;

                  const content = (
                    <div className="flex items-center justify-between px-4 py-3 min-h-[44px] w-full">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          {canAccess ? (
                            <Play className="w-3.5 h-3.5 text-primary" />
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                          )}
                        </div>
                        <span
                          className={`text-sm ${
                            canAccess ? "text-foreground font-medium" : "text-muted-foreground"
                          }`}
                        >
                          {lesson.title}
                        </span>
                        {lesson.is_preview && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                            معاينة مجانية
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0 ms-2">{lesson.duration}</span>
                    </div>
                  );

                  return canAccess ? (
                    <Link
                      key={lesson.id}
                      href={`/courses/${courseId}/lessons/${lesson.id}`}
                      className="flex items-center hover:bg-muted/40 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      {content}
                    </Link>
                  ) : (
                    <div key={lesson.id} className="flex items-center opacity-60 cursor-not-allowed">
                      {content}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

