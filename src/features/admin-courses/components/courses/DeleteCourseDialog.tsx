"use client";

import { useRef } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const isLockedRef = useRef(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (isLockedRef.current || isDeleting) return;
    isLockedRef.current = true;
    try {
      await onConfirm();
    } finally {
      isLockedRef.current = false;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-course-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      dir="rtl"
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-in fade-in-0 zoom-in-95">
        <div className="w-14 h-14 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-7 h-7 text-destructive" />
        </div>
        <h3 id="delete-course-title" className="font-bold text-foreground text-lg mb-2">
          حذف الكورس
        </h3>
        <p className="text-muted-foreground text-sm mb-1">
          هل أنت متأكد من حذف كورس <strong className="text-foreground">{course.title}</strong>؟
        </p>
        <p className="text-destructive text-xs mb-6 font-medium">
          لا يمكن التراجع عن هذا الإجراء وسيتم حذف جميع الأقسام والدروس المرتبطة به.
        </p>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-xl"
            onClick={onClose}
            disabled={isDeleting}
          >
            إلغاء
          </Button>
          <Button
            type="button"
            className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl"
            onClick={() => void handleConfirm()}
            disabled={isDeleting}
          >
            {isDeleting ? "جارٍ الحذف..." : "حذف"}
          </Button>
        </div>
      </div>
    </div>
  );
}

