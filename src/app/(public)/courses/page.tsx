import type { Metadata } from "next";
import { HydrationBoundary } from "@tanstack/react-query";
import { getDehydratedCourses } from "@/features/courses/server";
import CoursesCatalogView from "@/features/courses/components/catalog/CoursesCatalogView";

export const metadata: Metadata = {
  title: "كتالوج الكورسات والمسارات التقنية | Future House Academy",
  description:
    "استكشف أحدث المسارات البرمجية الشاملة في هندسة البرمجيات، الواجهات الأمامية، والذكاء الاصطناعي مع مدربين معتمدين.",
};

export default async function CoursesPage() {
  const dehydratedState = await getDehydratedCourses();

  return (
    <HydrationBoundary state={dehydratedState}>
      <CoursesCatalogView />
    </HydrationBoundary>
  );
}
