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
        onClick={() => setDropdownOpen((o) => !o)}
        className="w-full flex items-center justify-between bg-card border border-border rounded-2xl px-4 py-3 text-sm font-medium text-foreground hover:bg-muted/50 transition"
      >
        <span>{selectedCourse?.title ?? "اختر كورساً"}</span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
        />
      </button>

      {dropdownOpen && (
        <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-2xl shadow-xl z-20 overflow-hidden py-1">
          {courses.map((course) => (
            <button
              type="button"
              key={course.id}
              onClick={() => {
                onSelect(course.id);
                setDropdownOpen(false);
              }}
              className={`w-full text-right px-4 py-3 text-sm hover:bg-muted/60 transition flex items-center justify-between ${
                course.id === selectedId ? "text-primary font-bold bg-primary/5" : "text-foreground"
              }`}
            >
              <span>{course.title}</span>
              {course.id === selectedId && (
                <span className="text-primary text-xs font-semibold">محدد</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
