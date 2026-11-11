"use client";

import ConfirmModal from "@/components/shared/ConfirmModal";
import type { AdminCourse } from "../../types";

interface Props {
  course: AdminCourse;
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

export default function DeleteCourseDialog({
  course,
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}: Props) {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="حذف الكورس"
      description={
        <div className="space-y-1">
          <p>
            هل أنت متأكد من حذف كورس <strong className="text-foreground">{course.title}</strong>؟
          </p>
          <p className="text-destructive text-xs font-medium">
            لا يمكن التراجع عن هذا الإجراء وسيتم حذف جميع الأقسام والدروس المرتبطة به.
          </p>
        </div>
      }
      confirmText="حذف الكورس"
      cancelText="إلغاء"
      variant="destructive"
      isLoading={isDeleting}
    />
  );
}
