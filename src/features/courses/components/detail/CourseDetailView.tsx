"use client";

import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import {
  CourseHero,
  CourseCurriculum,
  CourseOutcomes,
  CourseBottomCta,
  useCourseDetail,
  SkeletonCard,
} from "../../index";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryState } from "@/components/shared/QueryState";

interface Props {
  courseId: string;
}

export default function CourseDetailView({ courseId }: Props) {
  const id = Number(courseId);
  const isValidId = Boolean(courseId) && !Number.isNaN(id) && id > 0;

  const courseQuery = useCourseDetail(isValidId ? id : "");
  const queryClient = useQueryClient();

  const { isAuthenticated } = useAuthStore();

  const enrollmentQuery = useQuery({
    queryKey: ["courses", "enrollment", courseId],
    queryFn: async () => {
      const res = await api.get(`/courses/${courseId}/enrollment`);
      const status = (res.data?.status ?? (res.data?.enrolled ? "approved" : null)) as
        | "pending"
        | "approved"
        | "rejected"
        | null;
      return {
        status,
        isEnrolled: status === "approved" || Boolean(res.data?.enrolled),
      };
    },
    enabled: isAuthenticated && isValidId,
    retry: false,
  });

  const enrollmentData = enrollmentQuery.data;
  const enrolled = enrollmentData?.isEnrolled ?? false;
  const enrollmentStatus = enrollmentData?.status ?? null;

  return (
    <div className="min-h-screen bg-background font-arabic" dir="rtl">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <QueryState
          query={courseQuery}
          skeleton={
            <div className="space-y-8">
              <div className="h-[300px] bg-muted animate-pulse rounded-3xl" />
              <div className="grid lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-6">
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              </div>
            </div>
          }
        >
          {(course) => {
            const isFree = Number(course.price ?? 0) === 0 || Boolean(course.is_public);
            const hasAccess = enrolled || (isFree && isAuthenticated);

            return (
              <>
                <CourseHero
                  course={course}
                  isEnrolled={enrolled}
                  enrollmentStatus={enrollmentStatus}
                  onEnrollSuccess={() => {
                    void queryClient.invalidateQueries({
                      queryKey: ["courses", "enrollment", courseId],
                    });
                  }}
                />

                <div className="grid lg:grid-cols-3 gap-10 mt-10">
                  <div className="lg:col-span-2 space-y-10">
                    <CourseOutcomes
                      outcomes={course.what_you_learn ?? []}
                      requirements={course.requirements ?? []}
                      target={course.target_audience ?? []}
                    />
                    <CourseCurriculum
                      sections={course.sections}
                      courseId={courseId}
                      enrolled={hasAccess}
                    />
                  </div>
                </div>

                <CourseBottomCta
                  isFree={isFree}
                  enrolled={enrolled}
                  isAuthenticated={isAuthenticated}
                />
              </>
            );
          }}
        </QueryState>
      </div>

      <Footer />
    </div>
  );
}
