"use client";

import { Lock, Play, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import {
  CourseSectionUI,
  useCurriculumAccordion,
} from "../_hooks/useCourseDetail";

interface CourseCurriculumProps {
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
          <div key={i} className="border border-border rounded-xl overflow-hidden">

            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center justify-between p-4 bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold text-foreground">{section.title}</span>
                <span className="text-xs text-muted-foreground">{section.lessons.length} دروس</span>
              </div>
              {openSections[i]
                ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                : <ChevronDown className="w-4 h-4 text-muted-foreground" />
              }
            </button>

            {openSections[i] && (
              <div className="divide-y divide-border">
                {section.lessons.map((lesson, j) => {
                  const canAccess = enrolled || lesson.is_preview;

                  const content = (
                    <div className="flex items-center justify-between px-4 py-3 w-full">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
                          {canAccess
                            ? <Play className="w-3.5 h-3.5 text-primary" />
                            : <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                          }
                        </div>
                        <span className={`text-sm ${canAccess ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {lesson.title}
                        </span>
                        {lesson.is_preview && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            مجاني
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                    </div>
                  );

                  return canAccess ? (
                    <Link
                      key={j}
                      href={`/courses/${courseId}/lessons/${lesson.id}`}
                      className="flex hover:bg-muted/50 transition-colors"
                    >
                      {content}
                    </Link>
                  ) : (
                    <div key={j} className="flex opacity-60 cursor-not-allowed">
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