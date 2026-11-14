"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const selectedCourse = courses.find((c) => c.id === selectedId);

  if (hideIfSingle && courses.length <= 1) return null;

  return (
    <div className="relative mb-6">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={dropdownOpen}
        aria-label="تصفية حسب الكورس"
        onClick={() => setDropdownOpen((o) => !o)}
        className="w-full min-h-[44px] flex items-center justify-between bg-card border border-border rounded-2xl px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/50 transition motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <span>{selectedCourse?.title ?? "اختر كورساً"}</span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 motion-reduce:transition-none ${
            dropdownOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {dropdownOpen && (
        <div
          role="listbox"
          aria-label="قائمة الكورسات"
          className="absolute top-full mt-2 w-full bg-card border border-border rounded-2xl shadow-xl z-20 overflow-hidden py-1 divide-y divide-border/40"
        >
          {courses.map((course) => (
            <button
              type="button"
              role="option"
              aria-selected={course.id === selectedId}
              key={course.id}
              onClick={() => {
                onSelect(course.id);
                setDropdownOpen(false);
              }}
              className={`w-full min-h-[44px] text-right px-4 py-3 text-sm hover:bg-muted/60 transition motion-reduce:transition-none flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                course.id === selectedId ? "text-primary font-bold bg-primary/5" : "text-foreground"
              }`}
            >
              <span className="truncate">{course.title}</span>
              {course.id === selectedId && (
                <span className="text-primary text-xs font-semibold shrink-0 ms-2">محدد</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
