import type { Metadata } from "next";
import { HydrationBoundary } from "@tanstack/react-query";
import { getDehydratedCourseDetail } from "@/features/courses/server";
import { getCourseById } from "@/features/courses/api/getCourseDetail";
import CourseDetailView from "@/features/courses/components/detail/CourseDetailView";

interface Props {
  params: Promise<{ courseId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { courseId } = await params;
  try {
    const course = await getCourseById(courseId);
    return {
      title: `${course.title} | Future House Academy`,
      description: course.description || "تفاصيل ومنهج الكورس البرمجي في Future House Academy",
      openGraph: {
        title: course.title,
        description: course.description || "",
        images: course.cover_image ? [{ url: course.cover_image }] : [],
      },
    };
  } catch {
    return {
      title: "تفاصيل الكورس | Future House Academy",
      description: "استكشف محتوى ومنهج الكورس البرمجي في Future House Academy",
    };
  }
}

export default async function CourseDetailPage({ params }: Props) {
  const { courseId } = await params;
  const dehydratedState = await getDehydratedCourseDetail(courseId);

  return (
    <HydrationBoundary state={dehydratedState}>
      <CourseDetailView courseId={courseId} />
    </HydrationBoundary>
  );
}
