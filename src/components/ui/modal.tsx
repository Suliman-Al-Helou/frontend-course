"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalContextValue {
  onClose: () => void;
  preventClose?: boolean;
  titleId: string;
  descriptionId: string;
}

const ModalContext = React.createContext<ModalContextValue | null>(null);

function useModalContext() {
  const context = React.useContext(ModalContext);
  if (!context) {
    throw new Error("Modal compound components must be rendered within a Modal component");
  }
  return context;
}

export type ModalSize = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  full: "max-w-5xl",
};

export interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  size?: ModalSize;
  preventClose?: boolean;
  children: React.ReactNode;
}

function ModalRoot({
  isOpen,
  onClose,
  size = "md",
  preventClose = false,
  className,
  children,
  ...props
}: ModalProps) {
  const titleId = React.useId();
  const descriptionId = React.useId();

  // إغلاق النافذة بزر Escape في لوحة المفاتيح
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !preventClose) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, preventClose, onClose]);

  if (!isOpen) return null;

  return (
    <ModalContext.Provider value={{ onClose, preventClose, titleId, descriptionId }}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        dir="rtl"
      >
        <button
          type="button"
          tabIndex={-1}
          aria-label="إغلاق النافذة"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-default"
          onClick={preventClose ? undefined : onClose}
        />
        <div
          className={cn(
            "relative z-10 bg-card border border-border rounded-2xl shadow-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in-0 zoom-in-95 motion-reduce:animate-none",
            sizeClasses[size],
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  );
}

export interface ModalHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  showCloseButton?: boolean;
}

function ModalHeader({
  title,
  description,
  icon,
  showCloseButton = true,
  className,
  children,
  ...props
}: ModalHeaderProps) {
  const { onClose, preventClose, titleId, descriptionId } = useModalContext();

  return (
    <div
      className={cn(
        "flex items-center justify-between p-5 border-b border-border shrink-0 bg-muted/10",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-3 min-w-0">
        {icon && <div className="shrink-0">{icon}</div>}
        <div className="min-w-0">
          {title && (
            <h2 id={titleId} className="font-bold text-foreground text-base truncate">
              {title}
            </h2>
          )}
          {description && (
            <p id={descriptionId} className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {description}
            </p>
          )}
          {children}
        </div>
      </div>

      {showCloseButton && (
        <button
          type="button"
          onClick={onClose}
          disabled={preventClose}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          aria-label="إغلاق النافذة"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

export interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

function ModalBody({ className, children, ...props }: ModalBodyProps) {
  return (
    <div className={cn("p-5 sm:p-6 overflow-y-auto flex-1 space-y-4", className)} {...props}>
      {children}
    </div>
  );
}

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

function ModalFooter({ className, children, ...props }: ModalFooterProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3 p-4 sm:p-5 border-t border-border bg-card shrink-0",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export const Modal = Object.assign(ModalRoot, {
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
});

export default Modal;
