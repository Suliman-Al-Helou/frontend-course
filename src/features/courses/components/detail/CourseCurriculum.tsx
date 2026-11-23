"use client";

import { Lock, Play } from "lucide-react";
import Link from "next/link";
import type { CourseSectionUI } from "../../index";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export interface CourseCurriculumProps {
  sections: CourseSectionUI[];
  courseId: string;
  enrolled: boolean;
}

export function CourseCurriculum({ sections, courseId, enrolled }: CourseCurriculumProps) {
  const defaultVal = sections[0]?.id !== undefined ? String(sections[0].id) : "0";

  return (
    <section>
      <h2 className="text-xl font-bold text-foreground mb-5">منهج الكورس</h2>
      <Accordion type="multiple" defaultValue={[defaultVal]}>
        {sections.map((section, i) => {
          const lessonCount = section.lessons?.length || 0;
          const lessonCountLabel =
            lessonCount === 1
              ? "درس واحد"
              : lessonCount === 2
                ? "درسان"
                : lessonCount <= 10
                  ? `${lessonCount} دروس`
                  : `${lessonCount} درساً`;

          const itemKey = section.id !== undefined ? String(section.id) : String(i);

          return (
            <AccordionItem key={itemKey} value={itemKey}>
              <AccordionTrigger className="p-4 bg-muted/50 hover:bg-muted">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-foreground">{section.title}</span>
                  <span className="text-xs text-muted-foreground">{lessonCountLabel}</span>
                </div>
              </AccordionTrigger>

              <AccordionContent className="divide-y divide-border">
                {section.lessons.map((lesson) => {
                  const canAccess = enrolled || lesson.is_preview || lesson.is_published === false;

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
                            canAccess ? "text-foreground font-normal" : "text-muted-foreground"
                          }`}
                        >
                          {lesson.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {lesson.is_published === false && (
                          <Badge variant="warning" size="sm">
                            مسودة
                          </Badge>
                        )}
                        {lesson.is_preview && !enrolled && (
                          <Badge variant="success" size="sm">
                            معاينة مجانية
                          </Badge>
                        )}
                        {lesson.duration ? (
                          <span className="text-xs text-muted-foreground">{lesson.duration} د</span>
                        ) : null}
                      </div>
                    </div>
                  );

                  if (canAccess) {
                    return (
                      <Link
                        key={lesson.id}
                        href={`/courses/${courseId}/lessons/${lesson.id}`}
                        className="block hover:bg-muted/40 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                      >
                        {content}
                      </Link>
                    );
                  }

                  return (
                    <div key={lesson.id} className="opacity-60 cursor-not-allowed">
                      {content}
                    </div>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </section>
  );
}
