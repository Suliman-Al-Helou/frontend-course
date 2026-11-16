"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { AlertTriangle, Trash2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "warning" | "primary";
  icon?: "trash" | "warning" | "info";
  isLoading?: boolean;
}

/**
 * ConfirmModal: Reusable Confirmation Dialog Primitive
 * المكون الموحد لنوافذ الحوار والتأكيد التدميرية والتحذيرية عبر المنصة
 * يضمن التوافق مع WCAG 2.1 ومعايير الأمان وقفل التزامن ونظام التصميم DESIGN.md
 */
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "تأكيد الحذف",
  cancelText = "إلغاء",
  variant = "destructive",
  icon,
  isLoading = false,
}: ConfirmModalProps) {
  const isLockedRef = useRef(false);

  // إغلاق المودال عند الضغط على زر Escape في الكيبورد
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (isLockedRef.current || isLoading) return;
    isLockedRef.current = true;
    try {
      await onConfirm();
    } finally {
      isLockedRef.current = false;
    }
  };

  const renderIcon = (size: "sm" | "lg" = "lg") => {
    const iconClass = size === "sm" ? "w-4 h-4" : "w-6 h-6";
    const chosenIcon =
      icon || (variant === "destructive" ? "trash" : variant === "warning" ? "warning" : "info");
    switch (chosenIcon) {
      case "trash":
        return <Trash2 className={iconClass} aria-hidden="true" />;
      case "warning":
        return <AlertTriangle className={iconClass} aria-hidden="true" />;
      case "info":
      default:
        return <Info className={iconClass} aria-hidden="true" />;
    }
  };

  const getIconStyles = () => {
    switch (variant) {
      case "destructive":
        return "bg-destructive/10 text-destructive";
      case "warning":
        return "bg-warning/10 text-warning";
      case "primary":
      default:
        return "bg-primary/10 text-primary";
    }
  };

  const getConfirmButtonStyles = () => {
    switch (variant) {
      case "destructive":
        return "bg-destructive hover:bg-destructive/90 text-destructive-foreground";
      case "warning":
        return "bg-warning hover:bg-warning/90 text-white";
      case "primary":
      default:
        return "bg-primary hover:bg-primary-hover text-primary-foreground";
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      dir="rtl"
    >
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-default"
        onClick={isLoading ? undefined : onClose}
      />
      <div className="relative z-10 bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in-0 zoom-in-95 motion-reduce:animate-none">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto ${getIconStyles()}`}
        >
          {renderIcon("lg")}
        </div>

        <div className="text-center space-y-2">
          <h3 id="confirm-dialog-title" className="text-base font-bold text-foreground">
            {title}
          </h3>
          <div
            id="confirm-dialog-description"
            className="text-sm text-muted-foreground leading-relaxed"
          >
            {description}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-xl h-11 min-h-[44px]"
            disabled={isLoading}
            onClick={onClose}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            loading={isLoading}
            className={`flex-1 rounded-xl h-11 min-h-[44px] font-semibold flex items-center justify-center gap-2 ${getConfirmButtonStyles()}`}
            disabled={isLoading}
            onClick={() => void handleConfirm()}
          >
            {!isLoading && renderIcon("sm")}
            <span>{isLoading ? "جارٍ التنفيذ..." : confirmText}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
