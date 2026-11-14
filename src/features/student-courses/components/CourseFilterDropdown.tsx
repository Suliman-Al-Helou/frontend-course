"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { studentCourseQueries } from "../queries/studentCourses.queries";

export interface CourseOption {
  id: number;
  title: string;
}

export function useEnrolledCourses() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { data: courses = [], isLoading } = useQuery({
    ...studentCourseQueries.enrolled(),
    select: (enrollments) =>
      enrollments
        .filter((e) => e.status === "approved" && e.course)
        .map((e) => ({ id: e.course.id, title: e.course.title })),
  });

  const urlId = searchParams.get("course");
  const selectedId = urlId ? Number(urlId) : (courses[0]?.id ?? null);

  const selectCourse = (id: number) => {
    router.replace(`?course=${id}`, { scroll: false });
  };

  return { courses, selectedId, isLoading, selectCourse };
}

interface DropdownProps {
  courses: CourseOption[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  hideIfSingle?: boolean;
}

export default function CourseFilterDropdown({
  courses,
  selectedId,
  onSelect,
  hideIfSingle = false,
}: DropdownProps) {
  if (hideIfSingle && courses.length <= 1) return null;

  return (
    <div className="relative mb-6">
      <Select
        dir="rtl"
        value={selectedId ? String(selectedId) : undefined}
        onValueChange={(val) => onSelect(Number(val))}
      >
        <SelectTrigger className="w-full min-h-[44px] h-12 rounded-2xl bg-card border-border px-4 text-sm font-medium">
          <SelectValue placeholder="اختر كورساً..." />
        </SelectTrigger>
        <SelectContent>
          {courses.map((course) => (
            <SelectItem key={course.id} value={String(course.id)}>
              {course.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
