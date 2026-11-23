import React from "react";
import { notFound } from "next/navigation";
import { InstructorCourseWorkspace } from "@/features/instructor-portal";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "مساحة عمل المقرر | Future House Academy",
  description: "إدارة وتطوير المنهج الدراسي والمهام التفاعلية للمقرر",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InstructorCourseWorkspacePage({ params }: PageProps) {
  const { id } = await params;
  if (!id) {
    notFound();
  }

  return <InstructorCourseWorkspace courseId={id} />;
}
