"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Check, Clock, Lock, Users, Zap } from "lucide-react";
import type { CourseListItem } from "@/components/landing/_hooks/Usecoursessection";
import CourseLevelBadge from "./CourseLevelBadge";
import StarRating from "./StarRating";
import type { Course } from "@/types";
import { Button } from "../ui/button";

interface CourseCardProps {
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
  const hours = Math.round(course.total_duration / 60);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group flex flex-col gap-4 rounded-lg border border-border bg-card p-3 bg-gradient-to-br from-primary/10 to-primary/5 "
    >
      {/* Cover: داخل البطاقة بحواف مدوّرة */}
      <div className="relative h-44 overflow-hidden rounded-md bg-muted">
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
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 px-1">
        <div className="flex justify-between items-start ">
          <h3 className="line-clamp-2 text-lg font-bold leading-snug text-foreground max-w-50 h-[50px]">
            {course.title}
          </h3>
          <div className="flex flex-col gap-2 items-end">
            {course.hot && (
              <span className="  flex items-center gap-1 rounded-sm bg-warning px-2 py-0.5 text-xs font-bold text-muted">
                <Zap className="size-3" />
                الأكثر طلباً {/* TODO: translate */}
              </span>
            )}
            <CourseLevelBadge level={course.level} className=" w-fit " />
          </div>
        </div>

        {/* Instructor */}
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
            {course.instructor?.charAt(0)}
          </span>
          <span className="text-sm text-muted-foreground">
            {course.instructor}
          </span>
        </div>

        {/* Meta: التقييم + الطلاب + المدة */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <StarRating rating={course.rating ?? 0} />
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Users className="size-3.5" />
              {course.students_count}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {hours} ساعة {/* TODO: translate */}
            </span>
          </span>
        </div>

        {/* Price row: مجاني + حالة التسجيل */}
        <div className="flex items-center justify-between border-t border-border pt-3">
          {course.is_public && (
            <span className="text-[14px]  text-success  font-bold rounded-sm ">
              مجاني
            </span>
          )}
          {isEnrolled ? (
            <span className="flex items-center gap-1 text-xs font-medium text-success">
              <Check className="size-3.5" />
              مسجّل {/* TODO: translate */}
            </span>
          ) : (
            <span className="flex items-center  gap-1 text-xs text-muted-foreground ">
              <Lock className="size-3.5" />
              يحتاج تسجيل {/* TODO: translate */}
            </span>
          )}
        </div>
        {isEnrolled ? (
          <div className="flex gap-2 w-full">
            {/* زر متابعة التعلم - يأخذ اللون الأساسي للنجاح */}
            <Button
              className="flex-1"
              href={learnHref ?? href}
               // افترضنا أن رابط التعلم يتبع مسار الكورس
              variant={"outlineSuccess"}
            >
              {ctaLabel} {/* أو يمكنك كتابة "متابعة التعلم" مباشرة */}
            </Button>
            {/* زر عرض الكورس - يأخذ ستايل ثنائي/خفيف */}
            <Button href={href} variant={"default"}>
              عرض الكورس
            </Button>
          </div>
        ) : (
          <Button
            href={href}
            className={`inline-flex items-center justify-center rounded-md py-2.5 text-sm font-semibold ${
              isEnrolled
                ? "bg-success text-success-foreground"
                : "bg-primary text-primary-foreground hover:bg-primary-hover"
            }`}
          >
            {ctaLabel}
          </Button>
        )}
      </div>
    </motion.article>
  );
}
