"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, BookOpen, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import CourseFormModal from "./CourseFormModal";
import type { Course, Enrollment } from "@/types";
import CourseSectionsModal from "@/components/admin/CourseSectionsModal";
import { LayoutList } from "lucide-react";
import Image from "next/image";

export default function ManageCoursesTab({
  enrollments,
}: {
  enrollments: Enrollment[];
}) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [managingCourse, setManagingCourse] = useState<Course | null>(null);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/courses");
      const data = res.data.data ?? res.data;
      setCourses(data);
      if (editingCourse) {
        const updated = data.find((c: Course) => c.id === editingCourse.id);
        if (updated) setEditingCourse(updated);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 👇 أضف هذه الدالة
  const handleEdit = async (course: Course) => {
    try {
      const res = await api.get(`/admin/courses/${course.id}`);
      setEditingCourse(res.data);
      setShowModal(true);
    } catch {
      setEditingCourse(course);
      setShowModal(true);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/admin/courses/${id}`);
      setDeleteId(null);
      fetchCourses();
    } catch (err) {
      console.error(err);
    }
  };

  const getEnrollCount = (id: number) =>
    enrollments.filter((e) => e.course_id === id && e.status === "approved")
      .length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-foreground">إدارة الكورسات</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {courses.length} كورس مضاف
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 text-white rounded-xl h-9"
          onClick={() => {
            setEditingCourse(null);
            setShowModal(true);
          }}
        >
          <Plus className="w-4 h-4 ml-1" />
          إضافة كورس
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-7 h-7 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-2xl">
          <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">
            لا توجد كورسات بعد، أضف أول كورس
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {courses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-2xl overflow-hidden"
            >
              {course.cover_image ? (
                <img
                  src={course.cover_image ?? ""}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-36 bg-gradient-to-br from-primary/20 to-blue-mid/20 flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-primary/40" />
                </div>
              )}

              <div className="p-4">
                <h3 className="font-bold text-foreground text-sm leading-snug mb-1">
                  {course.title}
                </h3>

                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-3">
                  <span className="bg-muted px-2 py-0.5 rounded-lg">
                    {course.level}
                  </span>
                  <span className="bg-muted px-2 py-0.5 rounded-lg">
                    {course.total_duration
                      ? `${Math.round(course.total_duration / 60)} ساعة`
                      : ""}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                  <Users className="w-3.5 h-3.5" />
                  <span>{getEnrollCount(course.id)} طالب مسجّل</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-xl h-8 text-xs"
                    onClick={() => setManagingCourse(course)}
                  >
                    <LayoutList className="w-3.5 h-3.5 ml-1" /> المحتوى
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-xl h-8 text-xs"
                    onClick={() => handleEdit(course)} // 👈 تم التعديل
                  >
                    <Pencil className="w-3.5 h-3.5 ml-1" /> تعديل
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl h-8 text-xs border-red-200 text-red-500 hover:bg-red-50"
                    onClick={() => setDeleteId(course.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                  {managingCourse && (
                    <CourseSectionsModal
                      course={managingCourse}
                      onClose={() => setManagingCourse(null)}
                    />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showModal && (
        <CourseFormModal
          key={editingCourse?.id ?? 'new'}
          course={editingCourse}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchCourses();
          }}
        />
      )}

      {deleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          dir="rtl"
        >
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="font-bold text-foreground text-lg mb-2">
              حذف الكورس
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 rounded-xl"
                onClick={() => setDeleteId(null)}
              >
                إلغاء
              </Button>
              <Button
                className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl"
                onClick={() => handleDelete(deleteId)}
              >
                حذف
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}