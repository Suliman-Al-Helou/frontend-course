"use client";

import { useState, useRef, useMemo } from "react";
import { X, Calendar, DollarSign, Gift, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { notify } from "@/components/ui/sonner";
import {
  adminEnrollmentQueries,
  adminCourseQueries,
} from "@/features/admin-courses/queries/adminCourses.queries";
import { useEnrollmentMutations } from "@/features/admin-courses/queries/adminCourses.mutations";
import type { AdminCourse } from "@/features/admin-courses/types";
import type { AdminUser } from "../types";

interface Props {
  student: AdminUser;
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentDetailsModal({ student, isOpen, onClose }: Props) {
  const { data: allEnrollments = [] } = useQuery(adminEnrollmentQueries.list());
  const { data: allCourses = [] } = useQuery(adminCourseQueries.list());
  const { updateStatus } = useEnrollmentMutations();

  const [revokingId, setRevokingId] = useState<number | null>(null);
  const isRevokingRef = useRef(false);

  // خريطة الكورسات بالذاكرة لمعرفة تفاصيل الأسعار
  const courseMap = useMemo(() => {
    const map = new Map<number, AdminCourse>();
    for (const c of allCourses) {
      map.set(c.id, c);
    }
    return map;
  }, [allCourses]);

  // مطابقة هجينة ودقيقة لجميع تسجيلات هذا الطالب
  const studentEnrollments = useMemo(() => {
    const targetEmail = student.email?.trim().toLowerCase();
    const targetName = student.name?.trim().toLowerCase();
    const targetId = Number(student.id);

    return allEnrollments.filter((e) => {
      const eUserId = Number(e.user_id || e.user?.id);
      if (targetId && eUserId && targetId === eUserId) return true;

      const eEmail = (e.student_email || e.user?.email || "").trim().toLowerCase();
      if (targetEmail && eEmail && targetEmail === eEmail) return true;

      const eName = (e.student_name || e.user?.name || "").trim().toLowerCase();
      if (targetName && eName && targetName === eName) return true;

      return false;
    });
  }, [allEnrollments, student]);

  // إثراء الكورسات بنوع الكورس (مدفوع / مجاني)
  const enrichedEnrollments = useMemo(() => {
    return studentEnrollments.map((enr) => {
      const course = courseMap.get(enr.course_id) || enr.course;
      const price = Number(course?.price ?? 0);
      const isPublic = course && "is_public" in course ? Boolean(course.is_public) : false;
      const isFree = !price || price === 0 || isPublic;
      const courseTitle = course?.title || enr.course_title || `كورس #${enr.course_id}`;

      return {
        ...enr,
        courseTitle,
        price,
        isFree,
      };
    });
  }, [studentEnrollments, courseMap]);

  // حساب أعداد الكورسات المفعلة
  const activeEnrollments = useMemo(
    () => enrichedEnrollments.filter((e) => e.status === "approved"),
    [enrichedEnrollments],
  );

  const paidActiveCount = useMemo(
    () => activeEnrollments.filter((e) => !e.isFree).length,
    [activeEnrollments],
  );

  const freeActiveCount = useMemo(
    () => activeEnrollments.filter((e) => e.isFree).length,
    [activeEnrollments],
  );

  if (!isOpen) return null;

  const handleRevoke = async (enrollmentId: number, courseTitle: string) => {
    if (isRevokingRef.current) return;
    isRevokingRef.current = true;
    setRevokingId(enrollmentId);
    try {
      await updateStatus.mutateAsync({
        id: enrollmentId,
        status: "rejected",
        paymentConfirmed: false,
      });
      notify.success(`تم سحب كورس "${courseTitle}" من الطالب بنجاح`);
    } catch (err: unknown) {
      console.error("فشل سحب الكورس:", err);
      notify.error("تعذر سحب الكورس، يرجى المحاولة لاحقاً");
    } finally {
      isRevokingRef.current = false;
      setRevokingId(null);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-details-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      dir="rtl"
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 motion-reduce:animate-none">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border shrink-0 bg-muted/20">
          <div className="flex items-center gap-3">
            <Avatar
              name={student.name || student.email}
              size="lg"
            />
            <div>
              <h3 id="student-details-title" className="font-bold text-foreground text-base">
                {student.name || "طالب بدون اسم"}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">{student.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
            aria-label="إغلاق النافذة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Metadata Cards: التاريخ - كورسات مدفوعة (مع أيقونة $) - كورسات مجانية (بدون أيقونة) */}
          <div className="grid grid-cols-3 gap-2.5">
            {/* 1. التاريخ */}
            <div className="bg-muted/40 border border-border/80 rounded-xl p-3 flex flex-col justify-between">
              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                الانضمام
              </span>
              <p className="text-xs font-semibold text-foreground mt-1 truncate">
                {student.created_at
                  ? new Date(student.created_at).toLocaleDateString("ar-EG")
                  : "—"}
              </p>
            </div>

            {/* 2. كورسات مدفوعة (مع إظهار أيقونة $ فقط) */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 flex flex-col justify-between">
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" />
                كورسات مدفوعة
              </span>
              <p className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                {paidActiveCount} كورس
              </p>
            </div>

            {/* 3. كورسات مجانية (بدون أيقونة) */}
            <div className="bg-muted/40 border border-border/80 rounded-xl p-3 flex flex-col justify-between">
              <span className="text-[11px] text-muted-foreground font-medium">كورسات مجانية</span>
              <p className="text-xs font-bold text-foreground mt-1">{freeActiveCount} كورس</p>
            </div>
          </div>

          {/* Enrolled Courses Dossier */}
          <div>
            <h4 className="text-xs font-bold text-foreground mb-3">
              سجل الكورسات الخاصة بالطالب ({enrichedEnrollments.length})
            </h4>

            {enrichedEnrollments.length === 0 ? (
              <div className="text-center py-8 bg-muted/20 border border-dashed border-border rounded-xl p-4">
                <AlertCircle className="w-6 h-6 text-muted-foreground/40 mx-auto mb-1.5" />
                <p className="text-xs text-muted-foreground">الطالب غير مسجل في أي كورس بعد.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {enrichedEnrollments.map((enr) => {
                  const isApproved = enr.status === "approved";
                  const isRevoking = revokingId === enr.id;

                  return (
                    <div
                      key={enr.id}
                      className="bg-card border border-border rounded-xl p-3.5 shadow-2xs hover:border-primary/30 transition-all flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm text-foreground truncate">
                            {enr.courseTitle}
                          </p>

                          {/* تمييز الكورس المدفوع بشارة $، أو أيقونة فقط للكورس المجاني بدون كلمة */}
                          {!enr.isFree ? (
                            <span className="inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                              <DollarSign className="w-3 h-3" />
                              {enr.price}$
                            </span>
                          ) : (
                            <span
                              title="كورس مجاني"
                              className="inline-flex items-center justify-center p-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                            >
                              <Gift className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                      </div>

                      {/* زر سحب الكورس بدون أي أيقونة */}
                      {isApproved ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isRevoking || revokingId !== null}
                          onClick={() => void handleRevoke(enr.id, enr.courseTitle)}
                          className="h-9 min-h-[38px] px-3.5 rounded-xl text-xs border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive shrink-0 font-medium"
                        >
                          {isRevoking ? "جارٍ السحب..." : "سحب الكورس"}
                        </Button>
                      ) : (
                        <span className="text-[11px] text-muted-foreground font-medium bg-muted px-2 py-1 rounded-md shrink-0">
                          تم سحب الكورس
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border shrink-0 bg-muted/10">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full rounded-xl h-11 min-h-[44px] text-sm"
          >
            إغلاق
          </Button>
        </div>
      </div>
    </div>
  );
}
