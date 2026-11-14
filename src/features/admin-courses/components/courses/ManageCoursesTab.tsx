"use client";

import { useState, useMemo } from "react";
import { Plus, Pencil, Trash2, BookOpen, Users, LayoutList, Clock, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/states/EmptyState";
import { notify } from "@/components/ui/sonner";
import { adminCourseQueries, adminEnrollmentQueries } from "../../queries/adminCourses.queries";
import { useDeleteCourseMutation } from "../../queries/adminCourses.mutations";
import CourseFormModal from "./CourseFormModal";
import DeleteCourseDialog from "./DeleteCourseDialog";
import CourseSectionsModal from "../sections/CourseSectionsModal";
import type { AdminCourse, CourseLevel } from "../../types";

const LEVEL_LABEL: Record<CourseLevel, string> = {
  beginner: "مبتدئ",
  intermediate: "متوسط",
  advanced: "متقدم",
};

function formatCoursesCount(count: number): string {
  if (count === 0) return "لا توجد كورسات";
  if (count === 1) return "كورس واحد";
  if (count === 2) return "كورسان";
  if (count >= 3 && count <= 10) return `${count} كورسات`;
  return `${count} كورساً`;
}

function formatStudentsCount(count: number): string {
  if (count === 0) return "لا يوجد طلاب";
  if (count === 1) return "طالب واحد";
  if (count === 2) return "طالبان";
  if (count >= 3 && count <= 10) return `${count} طلاب`;
  return `${count} طالباً`;
}

function formatHoursCount(hours: number): string {
  if (hours === 0) return "أقل من ساعة";
  if (hours === 1) return "ساعة واحدة";
  if (hours === 2) return "ساعتان";
  if (hours >= 3 && hours <= 10) return `${hours} ساعات`;
  return `${hours} ساعة`;
}

export default function ManageCoursesTab() {
  const { data: courses = [], isLoading } = useQuery(adminCourseQueries.list());
  const { data: enrollments = [] } = useQuery(adminEnrollmentQueries.list());

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<AdminCourse | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<AdminCourse | null>(null);
  const [managingCourse, setManagingCourse] = useState<AdminCourse | null>(null);

  const deleteMutation = useDeleteCourseMutation();

  // خريطة سريعة ومحسوبة بالذاكرة لعدد الطلاب لكل كورس
  const studentCountMap = useMemo(() => {
    const map = new Map<number, number>();
    for (const e of enrollments) {
      if (e.status === "approved") {
        map.set(e.course_id, (map.get(e.course_id) || 0) + 1);
      }
    }
    return map;
  }, [enrollments]);

  const handleDeleteConfirm = async () => {
    if (!deletingCourse) return;
    try {
      await deleteMutation.mutateAsync(deletingCourse.id);
      notify.success(`تم حذف كورس "${deletingCourse.title}" بنجاح`);
      setDeletingCourse(null);
    } catch (err: any) {
      console.error("فشل حذف الكورس:", err);
      const msg = err?.response?.data?.message || "تعذر حذف الكورس، يرجى المحاولة لاحقاً";
      notify.error(msg);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">إدارة الكورسات</h2>
          <p className="text-xs text-muted-foreground mt-1">
            {formatCoursesCount(courses.length)} متاح في المنصة
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingCourse(null);
            setFormModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4 ml-1.5" />
          إضافة كورس جديد
        </Button>
      </div>

      {/* Grid or Empty/Loading State */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-card border border-border rounded-2xl h-80 animate-pulse motion-reduce:animate-none flex flex-col p-4 justify-between"
            >
              <div className="w-full h-44 bg-muted rounded-xl" />
              <div className="space-y-2 mt-4">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
              <div className="h-8 bg-muted rounded-xl mt-4" />
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="لا توجد أي كورسات بعد"
          description="ابدأ ببناء المحتوى التعليمي عبر إضافة الكورس الأول ومشاركة المعرفة مع الطلاب."
        >
          <Button
            onClick={() => {
              setEditingCourse(null);
              setFormModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4 ml-1" />
            إضافة أول كورس
          </Button>
        </EmptyState>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {courses.map((course) => {
            const studentCount = studentCountMap.get(course.id) ?? course.students_count ?? 0;
            const hours = course.total_duration ? Math.round(course.total_duration / 60) : 0;

            return (
              <Card
                key={course.id}
                className="overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow motion-reduce:transition-none"
              >
                {/* Image Cover */}
                <div className="relative w-full h-44 bg-muted overflow-hidden">
                  {course.cover_image ? (
                    <img
                      src={course.cover_image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <BookOpen className="w-10 h-10 text-primary/40" />
                    </div>
                  )}

                  {/* Badges on top */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <Badge
                      variant={
                        course.status === "published"
                          ? "success"
                          : course.status === "draft"
                            ? "warning"
                            : "info"
                      }
                      shape="rounded"
                      size="sm"
                      className="backdrop-blur-md"
                    >
                      {course.status === "published"
                        ? "منشور"
                        : course.status === "draft"
                          ? "مسودة"
                          : "قريباً"}
                    </Badge>
                    {(course.is_popular || course.hot) && (
                      <Badge variant="hot" shape="rounded" size="sm" className="backdrop-blur-md">
                        🔥 الأكثر طلباً
                      </Badge>
                    )}
                  </div>

                  {/* Price badge */}
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-card/90 backdrop-blur-md text-foreground font-bold text-xs px-2.5 py-1 rounded-lg border border-border shadow-sm flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-success" />
                      {course.price && course.price > 0 ? `${course.price}$` : "مجاني"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-foreground text-sm line-clamp-2 leading-snug mb-2">
                      {course.title}
                    </h3>

                    {course.instructor && (
                      <p className="text-xs text-muted-foreground mb-3 font-medium">
                        المدرب: <span className="text-foreground">{course.instructor.name}</span>
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-4">
                      <Badge variant="secondary" shape="rounded" size="sm">
                        {LEVEL_LABEL[course.level] ?? course.level}
                      </Badge>
                      {hours > 0 && (
                        <Badge variant="secondary" shape="rounded" size="sm">
                          <Clock className="w-3 h-3" />
                          {formatHoursCount(hours)}
                        </Badge>
                      )}
                      <Badge variant="primary" shape="rounded" size="sm">
                        <Users className="w-3 h-3" />
                        {formatStudentsCount(studentCount)}
                      </Badge>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-border">
                    <Button
                      variant="outline"
                      className="flex-1 text-xs"
                      onClick={() => setManagingCourse(course)}
                      aria-label={`إدارة محتوى كورس ${course.title}`}
                    >
                      <LayoutList className="w-3.5 h-3.5 ml-1" /> المحتوى
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 text-xs"
                      onClick={() => {
                        setEditingCourse(course);
                        setFormModalOpen(true);
                      }}
                      aria-label={`تعديل بيانات كورس ${course.title}`}
                    >
                      <Pencil className="w-3.5 h-3.5 ml-1" /> تعديل
                    </Button>
                    <Button
                      variant="outlineDestructive"
                      size="icon"
                      onClick={() => setDeletingCourse(course)}
                      aria-label={`حذف كورس ${course.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Course Form Modal (Create or Edit) */}
      {formModalOpen && (
        <CourseFormModal
          key={editingCourse?.id ?? "new-course"}
          course={editingCourse}
          isOpen={formModalOpen}
          onClose={() => {
            setFormModalOpen(false);
            setEditingCourse(null);
          }}
        />
      )}

      {/* Delete Course Dialog */}
      {deletingCourse && (
        <DeleteCourseDialog
          course={deletingCourse}
          isOpen={!!deletingCourse}
          isDeleting={deleteMutation.isPending}
          onClose={() => setDeletingCourse(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      {/* Manage Sections & Lessons Modal (Rendered ONCE outside the loop!) */}
      {managingCourse && (
        <CourseSectionsModal
          course={managingCourse}
          isOpen={!!managingCourse}
          onClose={() => setManagingCourse(null)}
        />
      )}
    </div>
  );
}
