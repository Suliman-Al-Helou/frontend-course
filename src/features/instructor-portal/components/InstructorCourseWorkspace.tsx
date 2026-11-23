"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  Edit3,
  Users,
  Award,
  Clock,
  Sparkles,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { instructorPortalQueries } from "../queries/instructor-portal.queries";
import { InstructorCurriculumView } from "./InstructorCurriculumView";
import { InstructorCourseContentEditor } from "./InstructorCourseContentEditor";
import type { InstructorCourse } from "../types";

interface InstructorCourseWorkspaceProps {
  courseId: number | string;
}

export function InstructorCourseWorkspace({ courseId }: InstructorCourseWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<"curriculum" | "metadata" | "students">(
    "curriculum",
  );

  const {
    data: course,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    ...instructorPortalQueries.courseDetail(courseId),
  });

  if (isLoading) {
    return <WorkspaceSkeleton />;
  }

  if (isError || !course) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-border/80 bg-card space-y-4">
        <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
          <AlertCircle className="w-6 h-6" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-foreground">تعذر تحميل بيانات المقرر</h2>
          <p className="text-sm text-muted-foreground max-w-md">
            {error instanceof Error ? error.message : "قد يكون المقرر غير متاح أو لا تملك صلاحية إدارته."}
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline" className="min-h-[44px] gap-2">
          <RefreshCw className="w-4 h-4" />
          <span>إعادة المحاولة</span>
        </Button>
      </div>
    );
  }

  const levelLabel =
    course.level === "beginner"
      ? "مبتدئ"
      : course.level === "intermediate"
        ? "متوسط"
        : course.level === "advanced"
          ? "متقدم"
          : course.level || "عام";

  return (
    <div className="space-y-8 animate-in fade-in duration-300 motion-reduce:animate-none">
      {/* Top Breadcrumb & Return Bar */}
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="min-h-[44px] gap-2 text-muted-foreground hover:text-foreground -ms-2"
        >
          <Link href="/instructor/courses">
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
            <span>العودة لكورساتي الموكلة</span>
          </Link>
        </Button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
          <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
          <span>مساحة عمل المقرر</span>
        </div>
      </div>

      {/* Course Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-6 sm:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Cover Image */}
          <div className="relative aspect-video w-full md:w-56 overflow-hidden rounded-xl bg-muted shrink-0 border border-border/60">
            {course.cover_image ? (
              <Image
                src={course.cover_image}
                alt={course.title}
                fill
                sizes="(max-width: 768px) 100vw, 224px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 via-card to-muted">
                <BookOpen className="h-10 w-10 text-primary/40" aria-hidden="true" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary border border-primary/20">
                <Award className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{levelLabel}</span>
              </span>

              <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                <Users className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{course.students_count} طالب مسجل</span>
              </span>

              {course.total_duration && (
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{course.total_duration}</span>
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
              {course.title}
            </h1>

            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {course.description || "لا يوجد وصف مدخل لهذا المقرر حتى الآن."}
            </p>
          </div>
        </div>
      </div>

      {/* Horizontal Tabs Navigation */}
      <div className="border-b border-border">
        <nav
          className="flex space-x-2 rtl:space-x-reverse"
          aria-label="تبويبات إدارة المقرر"
        >
          <button
            type="button"
            onClick={() => setActiveTab("curriculum")}
            className={`min-h-[44px] px-5 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "curriculum"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            <span>المنهج الدراسي والدروس</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("metadata")}
            className={`min-h-[44px] px-5 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "metadata"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            <Edit3 className="w-4 h-4" aria-hidden="true" />
            <span>بيانات المقرر التعليمية</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("students")}
            className={`min-h-[44px] px-5 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "students"
                ? "border-primary text-primary font-bold"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            <Users className="w-4 h-4" aria-hidden="true" />
            <span>الطلاب المسجلين ({course.students_count})</span>
          </button>
        </nav>
      </div>

      {/* Active Tab Panel */}
      <section aria-label="محتوى التبويب النشط">
        {activeTab === "curriculum" && (
          <InstructorCurriculumView courseId={courseId} course={course} />
        )}

        {activeTab === "metadata" && (
          <InstructorCourseContentEditor
            course={course}
            onUpdated={() => refetch()}
          />
        )}

        {activeTab === "students" && (
          <EnrolledStudentsView course={course} />
        )}
      </section>
    </div>
  );
}

function EnrolledStudentsView({ course }: { course: InstructorCourse }) {
  return (
    <Card className="p-8 text-center space-y-4 rounded-2xl border border-border/80">
      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
        <Users className="w-6 h-6" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-foreground">
          الطلاب المسجلين في هذا المقرر ({course.students_count})
        </h3>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          يتابع هؤلاء الطلاب دراستهم ومحاولاتهم التفاعلية في هذا المقرر بشكل منتظم.
        </p>
      </div>
    </Card>
  );
}

function WorkspaceSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="h-8 w-48 bg-muted rounded-lg" />
      <div className="h-44 bg-muted rounded-2xl" />
      <div className="h-12 bg-muted rounded-lg" />
      <div className="space-y-4">
        <div className="h-24 bg-muted rounded-xl" />
        <div className="h-24 bg-muted rounded-xl" />
      </div>
    </div>
  );
}
