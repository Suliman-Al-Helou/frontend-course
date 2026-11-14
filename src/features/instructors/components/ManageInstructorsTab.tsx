"use client";

import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Plus,
  Pencil,
  Trash2,
  Users,
  Award,
  Twitter,
  Linkedin,
  Youtube,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { notify } from "@/components/ui/sonner";
import ConfirmModal from "@/components/shared/ConfirmModal";
import InstructorFormModal from "./InstructorFormModal";
import { instructorQueries } from "../queries/instructor.queries";
import { useInstructorMutations } from "../queries/instructor.mutations";
import type { Instructor, InstructorFormData } from "../types";

export default function ManageInstructorsTab() {
  const { data: instructors = [], isLoading } = useQuery(instructorQueries.adminList());
  const { createInstructor, updateInstructor, deleteInstructor } = useInstructorMutations();

  const [showModal, setShowModal] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);

  const [deletingInstructor, setDeletingInstructor] = useState<Instructor | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const isDeletingRef = useRef(false);

  const handleSave = async (data: InstructorFormData) => {
    try {
      if (editingInstructor) {
        await updateInstructor.mutateAsync({ id: editingInstructor.id, data });
        notify.success("تم تحديث بيانات المدرب بنجاح");
      } else {
        await createInstructor.mutateAsync(data);
        notify.success("تمت إضافة المدرب الجديد بنجاح");
      }
    } catch {
      notify.error("حدث خطأ أثناء حفظ بيانات المدرب.");
    }
  };

  const confirmDelete = async () => {
    if (!deletingInstructor || isDeletingRef.current) return;
    isDeletingRef.current = true;
    setIsDeleting(true);
    try {
      await deleteInstructor.mutateAsync(deletingInstructor.id);
      notify.success(`تم حذف المدرب "${deletingInstructor.name}" بنجاح`);
      setDeletingInstructor(null);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      notify.error(e.response?.data?.message || "تعذر حذف المدرب، يرجى المحاولة لاحقاً");
    } finally {
      setIsDeleting(false);
      isDeletingRef.current = false;
    }
  };

  return (
    <div className="space-y-6">
      {/* ─── Top Header ─────────────────────────────────────────── */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <span>إدارة أعضاء الهيئة التعليمية والمدربين</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {instructors.length} مدرب مسجّل في المنصة
          </p>
        </div>

        <Button
          type="button"
          onClick={() => {
            setEditingInstructor(null);
            setShowModal(true);
          }}
          className="rounded-xl h-10 px-4 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>+ إضافة مدرب جديد</span>
        </Button>
      </div>

      {/* ─── Body List ──────────────────────────────────────────── */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 space-y-3 bg-card border border-border rounded-2xl">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground">جارٍ تحميل قائمة المدربين...</p>
        </div>
      ) : instructors.length === 0 ? (
        <div className="p-12 text-center bg-card border border-border rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-foreground">لا يوجد مدربون مسجلون بعد</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            ابدأ بإضافة أول مدرب بالمنصة لإسناد الكورسات وشهادات الإنجاز إليه.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {instructors.map((ins) => {
            const specs = ins.specializations
              ? ins.specializations
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .slice(0, 3)
              : [];

            return (
              <div
                key={ins.id}
                className="bg-card border border-border rounded-2xl p-5 shadow-xs flex flex-col justify-between transition-all hover:border-primary/40 space-y-4"
              >
                <div>
                  <div className="flex items-start gap-3">
                    <Avatar
                      src={ins.avatar_url}
                      name={ins.name}
                      size="lg"
                      shape="square"
                      className="rounded-xl shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-foreground truncate">{ins.name}</h4>
                      {ins.title && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{ins.title}</p>
                      )}
                      {ins.years_experience ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-primary font-medium mt-1">
                          <Award className="w-3 h-3" />
                          <span>{ins.years_experience} سنوات خبرة</span>
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {ins.bio && (
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-3 leading-relaxed">
                      {ins.bio}
                    </p>
                  )}

                  {specs.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {specs.map((s) => (
                        <span
                          key={s}
                          className="bg-muted px-2 py-0.5 rounded-md text-[11px] text-muted-foreground"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                  {/* Social links */}
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    {ins.linkedin && (
                      <a
                        href={ins.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-foreground p-1 rounded transition-colors"
                        title="LinkedIn"
                      >
                        <Linkedin className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {ins.twitter && (
                      <a
                        href={ins.twitter}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-foreground p-1 rounded transition-colors"
                        title="Twitter"
                      >
                        <Twitter className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {ins.youtube && (
                      <a
                        href={ins.youtube}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-foreground p-1 rounded transition-colors"
                        title="YouTube"
                      >
                        <Youtube className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingInstructor(ins);
                        setShowModal(true);
                      }}
                      className="w-8 h-8 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
                      aria-label="تعديل المدرب"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingInstructor(ins)}
                      className="w-8 h-8 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                      aria-label="حذف المدرب"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Modals ─────────────────────────────────────────────── */}
      {showModal && (
        <InstructorFormModal
          instructor={editingInstructor}
          onClose={() => {
            setShowModal(false);
            setEditingInstructor(null);
          }}
          onSave={handleSave}
        />
      )}

      <ConfirmModal
        isOpen={Boolean(deletingInstructor)}
        title="تأكيد حذف المدرب"
        description={`هل أنت متأكد من رغبتك في حذف المدرب "${deletingInstructor?.name}" نهائياً من المنصة؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmText="نعم، احذف المدرب"
        cancelText="إلغاء"
        variant="destructive"
        isLoading={isDeleting}
        onClose={() => setDeletingInstructor(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
