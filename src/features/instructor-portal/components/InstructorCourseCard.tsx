"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Users, Clock, Award, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { InstructorCourse } from "../types";

interface InstructorCourseCardProps {
  course: InstructorCourse;
}

export function InstructorCourseCard({ course }: InstructorCourseCardProps) {
  const levelLabel =
    course.level === "beginner"
      ? "مبتدئ"
      : course.level === "intermediate"
        ? "متوسط"
        : course.level === "advanced"
          ? "متقدم"
          : course.level || "عام";

  return (
    <Card
      interactive
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:border-primary/40 hover:shadow-lg motion-reduce:transition-none"
    >
      {/* Course Cover Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {course.cover_image ? (
          <Image
            src={course.cover_image}
            alt={course.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-card to-muted">
            <BookOpen className="h-12 w-12 text-primary/40" aria-hidden="true" />
          </div>
        )}

        {/* Level Badge */}
        <div className="absolute top-3 end-3 inline-flex items-center gap-1 rounded-full bg-background/85 px-2.5 py-1 text-xs font-semibold text-foreground backdrop-blur-sm border border-border/50">
          <Award className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          <span>{levelLabel}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col p-5 space-y-4">
        <div className="space-y-2 flex-1">
          <h3 className="text-base font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {course.description || "لا يوجد وصف مختصر لهذا المقرر حالياً."}
          </p>
        </div>

        {/* Course Meta Info */}
        <div className="flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
          <div className="inline-flex items-center gap-1.5" title="عدد الطلاب المسجلين">
            <Users className="h-3.5 w-3.5 text-primary/80" aria-hidden="true" />
            <span>{course.students_count} طالب</span>
          </div>
          {course.total_duration && (
            <div className="inline-flex items-center gap-1.5" title="المدة الإجمالية">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              <span>{course.total_duration}</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-1">
          <Button
            asChild
            variant="outline"
            className="w-full min-h-[44px] justify-between border-border text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
          >
            <Link href={`/instructor/courses`}>
              <span className="font-medium text-xs">إدارة المحتوى والدروس</span>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
