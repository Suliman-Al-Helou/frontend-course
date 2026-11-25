"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { instructorPortalQueries } from "../queries/instructor-portal.queries";
import { InstructorCourseCard } from "./InstructorCourseCard";
import {
  InstructorPortalSkeletonGrid,
  InstructorPortalErrorCard,
  InstructorPortalEmptyState,
} from "./InstructorPortalFeedback";

export function InstructorCourseList() {
  const {
    data: courses = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery(instructorPortalQueries.courses());

  // 1. Loading State (Skeletons preventing CLS)
  if (isLoading) {
    return <InstructorPortalSkeletonGrid count={3} showButtonPlaceholder />;
  }

  // 2. Error State
  if (isError) {
    return (
      <InstructorPortalErrorCard
        title="تعذّر جلب قائمة الكورسات"
        message="حدث خطأ أثناء محاولة الاتصال بالخادم. يرجى المحاولة مرة ثانية."
        onRetry={() => refetch()}
        isRetrying={isFetching}
      />
    );
  }

  // 3. Empty State (Compliant with US 17 & DESIGN.md)
  if (courses.length === 0) {
    return (
      <InstructorPortalEmptyState
        title="لا توجد كورسات موكلة لحسابك حالياً"
        description="يتم إسناد المقررات الدراسية إلى المدربين من قِبل إدارة الأكاديمية. فور تعيين مقرر لك، سيظهر هنا لتتمكن من إدارة محتواه التعليمي ودروسه ومهامه التفاعلية."
      />
    );
  }

  // 4. Populated State Grid
  return (
    <div
      role="region"
      aria-label="قائمة الكورسات الموكلة"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {courses.map((course) => (
        <InstructorCourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
