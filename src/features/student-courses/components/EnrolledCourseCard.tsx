"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Users, Play, BookOpen } from "lucide-react";
import type { StudentEnrollment } from "../types";

interface EnrolledCourseCardProps {
  enrollment: StudentEnrollment;
}

export function EnrolledCourseCard({ enrollment }: EnrolledCourseCardProps) {
  const { course } = enrollment;
  if (!course) return null;

  const durationHours = course.total_duration
    ? Math.max(1, Math.round(Number(course.total_duration) / 60))
    : null;

  const learnHref = course.next_lesson_id
    ? `/courses/${course.id}/lessons/${course.next_lesson_id}`
    : `/dashboard/videos?course=${course.id}`;

  return (
    <div className="group bg-card border border-border rounded-2xl overflow-hidden flex flex-col justify-between hover:border-primary/40 hover:shadow-md transition-all duration-200">
      <div>
        {/* Course Cover */}
        <div className="relative w-full h-44 bg-muted overflow-hidden">
          {course.cover_image ? (
            <Image
              src={course.cover_image}
              alt={course.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <BookOpen className="w-12 h-12 stroke-[1.5] opacity-40" />
            </div>
          )}

          <div className="absolute top-3 start-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-background/80 backdrop-blur-md border border-border text-foreground">
              مسجل
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-semibold text-foreground text-base line-clamp-2 mb-3 leading-snug">
            {course.title}
          </h3>

          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
            {durationHours !== null && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
                <span>{durationHours} ساعة</span>
              </span>
            )}
            {typeof course.students_count === "number" && (
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-muted-foreground" aria-hidden="true" />
                <span>{course.students_count} طالب</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-5 pt-0 mt-auto">
        <Link
          href={learnHref}
          className="w-full min-h-[44px] flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-4 py-2.5 rounded-xl hover:bg-primary/90 active:scale-[0.99] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
        >
          <Play className="w-4 h-4 fill-current" aria-hidden="true" />
          <span>متابعة التعلم</span>
        </Link>
      </div>
    </div>
  );
}
