"use client";

import { useState, useRef } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AdminUser } from "../types";

interface Props {
  student: AdminUser;
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

export default function DeleteStudentDialog({
  student,
  isOpen,
  isDeleting,
  onClose,
  onConfirm,
}: Props) {
  const [typedConfirmation, setTypedConfirmation] = useState("");
  const isLockedRef = useRef(false);

  if (!isOpen) return null;

  const targetIdentifier = student.email || student.name;
  const isMatch = typedConfirmation.trim().toLowerCase() === targetIdentifier.trim().toLowerCase();

  const handleConfirm = async () => {
    if (!isMatch || isLockedRef.current || isDeleting) return;
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
      aria-labelledby="delete-student-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      dir="rtl"
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6 overflow-hidden animate-in fade-in-0 zoom-in-95 motion-reduce:animate-none">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2.5 text-destructive">
            <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h3 id="delete-student-title" className="font-bold text-foreground text-base">
                حذف حساب الطالب نهائياً
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">إجراء حساس وتدميري</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="إغلاق"
            disabled={isDeleting}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warning Body */}
        <div className="py-4 space-y-3">
          <p className="text-sm text-foreground leading-relaxed">
            أنت على وشك حذف حساب الطالب{" "}
            <strong className="text-destructive font-semibold">
              {student.name || student.email}
            </strong>{" "}
            بشكل كامل.
          </p>
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 text-xs text-destructive space-y-1">
            <p className="font-medium">
              • سيتم تدمير كافة سجلات الطالب وإجاباته في المهام والاختبارات.
            </p>
            <p className="font-medium">• سيتم سحب وصوله من جميع الكورسات التي تم تفعيلها له.</p>
            <p className="font-semibold">• لا يمكن التراجع عن هذا الإجراء تحت أي ظرف.</p>
          </div>

          {/* GitHub-Style Confirmation Challenge */}
          <div className="pt-2 space-y-2">
            <label
              htmlFor="confirm-delete-input"
              className="block text-xs font-semibold text-foreground"
            >
              لتأكيد الحذف، يرجى كتابة{" "}
              <span className="font-mono text-destructive underline select-all">
                {targetIdentifier}
              </span>{" "}
              في الحقل أدناه:
            </label>
            <Input
              id="confirm-delete-input"
              dir="ltr"
              placeholder={targetIdentifier}
              value={typedConfirmation}
              onChange={(e) => setTypedConfirmation(e.target.value)}
              disabled={isDeleting}
              className="h-11 rounded-xl text-center font-mono text-sm border-input"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2.5 pt-3 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 rounded-xl h-11 min-h-[44px] text-sm"
          >
            إلغاء
          </Button>
          <Button
            type="button"
            onClick={() => void handleConfirm()}
            disabled={!isMatch || isDeleting}
            className="flex-1 rounded-xl h-11 min-h-[44px] text-sm bg-destructive hover:bg-destructive/90 text-destructive-foreground font-medium transition-all"
          >
            <Trash2 className="w-4 h-4 ml-1.5" />
            {isDeleting ? "جارٍ الحذف..." : "أعي العواقب، احذف الحساب"}
          </Button>
        </div>
      </div>
    </div>
  );
}
