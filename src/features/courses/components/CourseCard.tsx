"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { BookOpen, Check, Clock, Lock, Users, Zap } from "lucide-react";
import CourseLevelBadge from "./CourseLevelBadge";
import StarRating from "./StarRating";
import type { Course } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface CourseCardProps {
  course: Course;
  href: string; // يحسبه الأب
  learnHref?: string; // متابعة التعلم (للمسجّل فقط)
  ctaLabel: string; // يحسبه الأب
  isEnrolled?: boolean;
  index?: number;
}

export default function CourseCard({
  course,
  href,
  ctaLabel,
  learnHref,
  isEnrolled = false,
  index = 0,
}: CourseCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const hours = Math.round((course.total_duration || 0) / 60);

  const hoursLabel =
    hours === 1
      ? "ساعة واحدة"
      : hours === 2
        ? "ساعتان"
        : hours <= 10
          ? `${hours} ساعات`
          : `${hours} ساعة`;

  const studentsLabel =
    typeof course.students_count === "number"
      ? course.students_count === 1
        ? "طالب واحد"
        : course.students_count === 2
          ? "طالبان"
          : course.students_count <= 10
            ? `${course.students_count} طلاب`
            : `${course.students_count} طالباً`
      : null;

  const rawInstructor = course.instructor as unknown;
  const instructorName =
    typeof rawInstructor === "string"
      ? rawInstructor
      : typeof rawInstructor === "object" && rawInstructor !== null && "name" in rawInstructor
        ? String((rawInstructor as { name: unknown }).name)
        : "مدرب معتمد";

  return (
    <motion.article
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        // duration: 0.3,
        delay: shouldReduceMotion ? 0 : Math.min(index * 0.05, 0.3),
      }}
      className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-3.5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300"
    >
      {/* Cover: داخل البطاقة بحواف مدوّرة */}
      <Link
        href={href}
        className="block relative h-44 overflow-hidden rounded-lg bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {course.cover_image ? (
          <Image
            src={course.cover_image}
            alt={course.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <BookOpen className="absolute inset-0 m-auto size-10 text-muted-foreground/40" />
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 px-1">
        <div className="flex justify-between items-start gap-2">
          <Link
            href={href}
            className="flex-1 group-hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xs"
          >
            <h3 className="line-clamp-2 text-base font-bold leading-snug text-foreground min-h-[44px]">
              {course.title}
            </h3>
          </Link>
          <div className="flex flex-col gap-1.5 items-end shrink-0">
            {course.hot && (
              <Badge variant="hot" shape="rounded" size="sm">
                <Zap className="size-3" />
                الأكثر طلباً
              </Badge>
            )}
            <CourseLevelBadge level={course.level} className="w-fit" />
          </div>
        </div>

        {/* Instructor */}
        <div className="flex items-center gap-1.5">
          <span className="flex size-5 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
            أ
          </span>
          <span className="text-sm text-muted-foreground">{instructorName}</span>
        </div>

        {/* Meta: التقييم + الطلاب + المدة */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <StarRating rating={course.rating ?? 0} />
          <span className="flex items-center gap-3">
            {studentsLabel && (
              <span className="flex items-center gap-1">
                <Users className="size-3.5" aria-hidden="true" />
                <span>{studentsLabel}</span>
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" aria-hidden="true" />
              <span>{hoursLabel}</span>
            </span>
          </span>
        </div>

        {/* Price row: مجاني + حالة التسجيل */}
        <div className="flex items-center justify-between border-t border-border pt-3">
          {course.is_public && <span className="text-sm text-success font-bold">مجاني</span>}
          {isEnrolled ? (
            <span className="flex items-center gap-1 text-xs font-medium text-success">
              <Check className="size-3.5" />
              مسجّل
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Lock className="size-3.5" />
              يحتاج تسجيل
            </span>
          )}
        </div>

        {isEnrolled ? (
          <div className="flex gap-2 w-full mt-auto pt-1">
            <Button
              className="flex-1"
              href={learnHref ?? href}
              variant="outlineSuccess"
            >
              {ctaLabel}
            </Button>
            <Button href={href} variant="default">
              عرض الكورس
            </Button>
          </div>
        ) : (
          <Button href={href} className="w-full mt-auto">
            {ctaLabel}
          </Button>
        )}
      </div>
    </motion.article>
  );
}
