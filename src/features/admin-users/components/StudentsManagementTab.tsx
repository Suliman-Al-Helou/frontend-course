"use client";

import { useState, useMemo } from "react";
import {
  Trash2,
  Eye,
  BookOpen,
  AlertCircle,
  ShieldAlert,
  DollarSign,
  GraduationCap,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { Avatar } from "@/components/ui/avatar";
import { notify } from "@/components/ui/sonner";
import { adminUserQueries } from "../queries/adminUsers.queries";
import { useDeleteUserMutation } from "../queries/adminUsers.mutations";
import {
  adminEnrollmentQueries,
  adminCourseQueries,
} from "@/features/admin-courses/queries/adminCourses.queries";
import { authQueries } from "@/features/auth";
import DeleteStudentDialog from "./DeleteStudentDialog";
import StudentDetailsModal from "./StudentDetailsModal";
import type { AdminUser, UserFilterStatus } from "../types";

export default function StudentsManagementTab() {
  const { data: users = [], isLoading: isLoadingUsers } = useQuery(adminUserQueries.list());
  const { data: enrollments = [] } = useQuery(adminEnrollmentQueries.list());
  const { data: allCourses = [] } = useQuery(adminCourseQueries.list());
  const { data: currentUser } = useQuery(authQueries.user());

  const deleteMutation = useDeleteUserMutation();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<UserFilterStatus>("all");
  const [selectedStudent, setSelectedStudent] = useState<AdminUser | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<AdminUser | null>(null);

  // خريطة أسعار الكورسات لتحديد المجاني والمدفوع بدقة
  const coursePriceMap = useMemo(() => {
    const map = new Map<number, number>();
    for (const c of allCourses) {
      map.set(c.id, c.is_public ? 0 : Number(c.price || 0));
    }
    return map;
  }, [allCourses]);

  // تصفية الطلاب (استبعاد المدراء من جدول الطلاب بحسب متطلبات الـ MVP)
  const students = useMemo(() => {
    return users.filter((u) => u.role !== "admin");
  }, [users]);

  // حساب دقيق ومطابقة هجينة لبيانات تسجيل كل طالب (مدفوع / مجاني)
  const studentEnrollmentStatsMap = useMemo(() => {
    const map = new Map<
      number,
      {
        activeTotal: number;
        paidCount: number;
        freeCount: number;
        allCount: number;
      }
    >();

    for (const student of students) {
      const targetEmail = student.email?.trim().toLowerCase();
      const targetName = student.name?.trim().toLowerCase();
      const targetId = Number(student.id);

      const matchedEnrollments = enrollments.filter((e) => {
        const eUserId = Number(e.user_id || e.user?.id);
        if (targetId && eUserId && targetId === eUserId) return true;

        const eEmail = (e.student_email || e.user?.email || "").trim().toLowerCase();
        if (targetEmail && eEmail && targetEmail === eEmail) return true;

        const eName = (e.student_name || e.user?.name || "").trim().toLowerCase();
        if (targetName && eName && targetName === eName) return true;

        return false;
      });

      const approved = matchedEnrollments.filter((e) => e.status === "approved");
      let paidCount = 0;
      let freeCount = 0;

      for (const enr of approved) {
        const price = coursePriceMap.get(enr.course_id) ?? Number(enr.course?.price ?? 0);
        if (price > 0) {
          paidCount++;
        } else {
          freeCount++;
        }
      }

      map.set(student.id, {
        activeTotal: approved.length,
        paidCount,
        freeCount,
        allCount: matchedEnrollments.length,
      });
    }

    return map;
  }, [students, enrollments, coursePriceMap]);

  // تطبيق البحث والفلاتر
  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase();
    return students.filter((student) => {
      const matchSearch =
        !q || student.name?.toLowerCase().includes(q) || student.email?.toLowerCase().includes(q);

      if (!matchSearch) return false;

      const stats = studentEnrollmentStatsMap.get(student.id) || {
        activeTotal: 0,
        paidCount: 0,
        freeCount: 0,
        allCount: 0,
      };

      if (filter === "active") return stats.activeTotal > 0;
      if (filter === "paid") return stats.paidCount > 0;
      if (filter === "no-courses") return stats.activeTotal === 0;
      return true;
    });
  }, [students, search, filter, studentEnrollmentStatsMap]);

  const handleDeleteConfirm = async () => {
    if (!deletingStudent) return;
    try {
      await deleteMutation.mutateAsync(deletingStudent.id);
      notify.success(`تم حذف حساب الطالب "${deletingStudent.name || deletingStudent.email}" بنجاح`);
      setDeletingStudent(null);
    } catch (err: unknown) {
      console.error(err);
      notify.error("تعذر حذف حساب الطالب، يرجى المحاولة لاحقاً");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">إدارة الطلاب</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              عرض ملفات الطلاب، تصنيف الكورسات (مدفوع / مجاني)، وسحب أو تفعيل الاشتراكات
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-muted px-3 py-1.5 rounded-full text-foreground font-medium">
              إجمالي الطلاب: {students.length}
            </span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <SearchInput
            placeholder="ابحث باسم الطالب أو البريد الإلكتروني..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
            className=" text-sm border-input"
          />

          <div className="flex items-center gap-1.5 bg-muted/40 p-1 rounded-xl border border-border flex-wrap">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                filter === "all"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              الكل ({students.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("active")}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                filter === "active"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              لديه كورسات نشطة
            </button>
            <button
              type="button"
              onClick={() => setFilter("paid")}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                filter === "paid"
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              كورسات مدفوعة
            </button>
            <button
              type="button"
              onClick={() => setFilter("no-courses")}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                filter === "no-courses"
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              بدون كورسات
            </button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-card border border-border rounded-2xl shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/40 text-right border-b border-border">
                <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground">الطالب</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground">
                  البريد الإلكتروني
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground">
                  الكورسات المفعلة والتصنيف
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground">
                  تاريخ الانضمام
                </th>
                <th className="px-5 py-3.5 text-xs font-semibold text-muted-foreground text-left">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoadingUsers ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="w-7 h-7 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">جارٍ تحميل قائمة الطلاب...</p>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-muted-foreground text-sm">
                    <AlertCircle className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                    لا يوجد طلاب مطابقون لمعايير البحث الحالية
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const stats = studentEnrollmentStatsMap.get(student.id) || {
                    activeTotal: 0,
                    paidCount: 0,
                    freeCount: 0,
                    allCount: 0,
                  };
                  const isCurrentAdmin = currentUser && currentUser.id === student.id;

                  return (
                    <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={student.name || student.email} size="sm" />
                          <div>
                            <span className="font-semibold text-foreground text-sm block">
                              {student.name || "—"}
                            </span>
                            {isCurrentAdmin && (
                              <span className="text-[10px] text-primary font-medium bg-primary/10 px-1.5 py-0.5 rounded-sm">
                                (حسابك الحالي)
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-xs font-mono text-muted-foreground">
                        {student.email}
                      </td>

                      <td className="px-5 py-4">
                        {stats.activeTotal > 0 ? (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {/* Paid badge with Green & $ */}
                            {stats.paidCount > 0 && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                                <DollarSign className="w-3.5 h-3.5" />
                                {stats.paidCount} مدفوع
                              </span>
                            )}

                            {/* Free badge */}
                            {stats.freeCount > 0 && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                <BookOpen className="w-3 h-3" />
                                {stats.freeCount} مجاني
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                            بدون كورسات
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-xs text-muted-foreground">
                        {student.created_at
                          ? new Date(student.created_at).toLocaleDateString("ar-EG")
                          : "—"}
                      </td>

                      <td className="px-5 py-4 text-left">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedStudent(student)}
                            className="h-8 rounded-lg text-xs gap-1 hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            ملف الطالب
                          </Button>

                          {!isCurrentAdmin ? (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setDeletingStudent(student)}
                              className="h-8 rounded-lg text-xs gap-1 border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              حذف
                            </Button>
                          ) : (
                            <span className="text-[11px] text-muted-foreground font-medium px-2 py-1 bg-muted rounded-md flex items-center gap-1">
                              <ShieldAlert className="w-3.5 h-3.5" />
                              محمي
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Details Dossier Modal */}
      {selectedStudent && (
        <StudentDetailsModal
          student={selectedStudent}
          isOpen={Boolean(selectedStudent)}
          onClose={() => setSelectedStudent(null)}
        />
      )}

      {/* GitHub-Style Delete Confirmation Challenge */}
      {deletingStudent && (
        <DeleteStudentDialog
          student={deletingStudent}
          isOpen={Boolean(deletingStudent)}
          isDeleting={deleteMutation.isPending}
          onClose={() => setDeletingStudent(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
