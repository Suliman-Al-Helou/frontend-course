"use client";

import { useState, useRef } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "@/components/ui/modal";
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
    <Modal isOpen={isOpen} onClose={onClose} size="md" preventClose={isDeleting}>
      <ModalHeader
        title="حذف حساب الطالب نهائياً"
        description="إجراء حساس وتدميري"
        icon={
          <div className="w-9 h-9 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        }
      />

      <ModalBody className="py-4 space-y-3">
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
            className="text-center font-mono text-sm"
          />
        </div>
      </ModalBody>

      <ModalFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isDeleting}
          className="flex-1"
        >
          إلغاء
        </Button>
        <Button
          type="button"
          variant="destructive"
          onClick={() => void handleConfirm()}
          disabled={!isMatch || isDeleting}
          loading={isDeleting}
          className="flex-1"
        >
          <Trash2 className="w-4 h-4 ml-1.5" />
          أعي العواقب، احذف الحساب
        </Button>
      </ModalFooter>
    </Modal>
  );
}
