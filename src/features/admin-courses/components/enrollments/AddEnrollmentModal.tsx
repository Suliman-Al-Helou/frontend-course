"use client";

import { useState, useRef } from "react";
import { X, UserPlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminCourseQueries } from "../../queries/adminCourses.queries";
import { useEnrollmentMutations } from "../../queries/adminCourses.mutations";
import type { AdminCourse } from "../../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddEnrollmentModal({ isOpen, onClose }: Props) {
  const isSubmittingRef = useRef(false);

  const { data: courses = [], isLoading: isLoadingCourses } = useQuery(adminCourseQueries.list());
  const { createEnrollment } = useEnrollmentMutations();

  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [courseId, setCourseId] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current || createEnrollment.isPending) return;

    setError("");
    if (!courseId) {
      setError("يرجى اختيار الكورس المراد التسجيل فيه.");
      return;
    }

    if (!studentEmail.trim()) {
      setError("يرجى إدخال البريد الإلكتروني للطالب.");
      return;
    }

    isSubmittingRef.current = true;
    try {
      await createEnrollment.mutateAsync({
        student_name: studentName.trim() || studentEmail.split("@")[0],
        student_email: studentEmail.trim(),
        course_id: Number(courseId),
        status: "approved",
        payment_confirmed: true,
      });

      onClose();
    } catch (err) {
      console.error("فشل إضافة التسجيل:", err);
      setError("حدث خطأ أثناء إضافة التسجيل. تحقق من البريد الإلكتروني وحاول مجدداً.");
    } finally {
      isSubmittingRef.current = false;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-enrollment-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      dir="rtl"
    >
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in-0 zoom-in-95 motion-reduce:animate-none">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <h3 id="add-enrollment-title" className="text-base font-bold text-foreground">
              تسجيل طالب في كورس
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded-lg transition-colors"
            aria-label="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="enr-student-name">اسم الطالب (اختياري)</Label>
            <Input
              id="enr-student-name"
              placeholder="مثال: أحمد محمود"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="h-10 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="enr-student-email">البريد الإلكتروني للارتباط بالحساب *</Label>
            <Input
              id="enr-student-email"
              type="email"
              placeholder="student@example.com"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              className="h-10 rounded-xl"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="enr-course-select">الكورس *</Label>
            <select
              id="enr-course-select"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              required
            >
              <option value="">
                {isLoadingCourses ? "جاري تحميل الكورسات..." : "اختر الكورس..."}
              </option>
              {courses.map((c: AdminCourse) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-destructive text-xs bg-destructive/10 border border-destructive/20 p-2.5 rounded-xl">
              {error}
            </p>
          )}

          <div className="flex gap-2.5 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={createEnrollment.isPending}
              className="flex-1 rounded-xl h-11 min-h-[44px] text-sm"
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={createEnrollment.isPending}
              className="flex-1 rounded-xl h-11 min-h-[44px] text-sm bg-primary text-primary-foreground font-medium"
            >
              {createEnrollment.isPending ? "جارٍ التسجيل..." : "تأكيد التسجيل"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
