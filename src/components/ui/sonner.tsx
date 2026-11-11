"use client";

import { useThemeStore } from "@/store/themeStore";
import { Toaster as Sonner, toast } from "sonner";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  Loader2,
} from "lucide-react";
import { ERROR_MESSAGES_AR, SUCCESS_MESSAGES_AR } from "@/lib/errors/messages";
import type { ErrorCode, SuccessCode } from "@/lib/errors/codes";
import { ApiError } from "@/lib/errors/ApiError";

type ToasterProps = React.ComponentProps<typeof Sonner>;

/**
 * Toaster الموحد لمنصة Future House Academy
 * مضبوط طبقاً لمعايير DESIGN.md وثيم المنصة ومكتبة sonner العالمية
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useThemeStore();

  return (
    <Sonner
      theme={theme as "light" | "dark"}
      className="toaster group font-arabic"
      dir="rtl"
      position="top-center"
      richColors={false}
      closeButton
      icons={{
        success: <CheckCircle2 className="w-5 h-5 text-success shrink-0" />,
        info: <Info className="w-5 h-5 text-primary shrink-0" />,
        warning: <AlertTriangle className="w-5 h-5 text-warning shrink-0" />,
        error: <AlertCircle className="w-5 h-5 text-destructive shrink-0" />,
        loading: <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />,
      }}
      toastOptions={{
        closeButtonAriaLabel: "إغلاق التنبيه",
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-2xl group-[.toaster]:rounded-2xl group-[.toaster]:p-4 group-[.toaster]:gap-3 group-[.toaster]:font-arabic border",
          title: "group-[.toast]:font-semibold group-[.toast]:text-sm group-[.toast]:text-foreground",
          description: "group-[.toast]:text-xs group-[.toast]:text-muted-foreground group-[.toast]:leading-relaxed",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:hover:bg-primary-hover group-[.toast]:font-semibold group-[.toast]:rounded-xl group-[.toast]:h-9 group-[.toast]:px-3.5 group-[.toast]:text-xs transition-colors",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:hover:bg-muted/80 group-[.toast]:font-medium group-[.toast]:rounded-xl group-[.toast]:h-9 group-[.toast]:px-3.5 group-[.toast]:text-xs transition-colors",
          closeButton:
            "group-[.toast]:bg-card group-[.toast]:border-border group-[.toast]:text-muted-foreground hover:group-[.toast]:text-foreground group-[.toast]:rounded-xl group-[.toast]:w-7 group-[.toast]:h-7 group-[.toast]:border transition-colors",
          success:
            "group-[.toaster]:border-success/30 group-[.toaster]:bg-card group-[.toaster]:text-foreground",
          error:
            "group-[.toaster]:border-destructive/30 group-[.toaster]:bg-card group-[.toaster]:text-foreground",
          warning:
            "group-[.toaster]:border-warning/30 group-[.toaster]:bg-card group-[.toaster]:text-foreground",
          info:
            "group-[.toaster]:border-primary/30 group-[.toaster]:bg-card group-[.toaster]:text-foreground",
        },
      }}
      {...props}
    />
  );
};

/**
 * وحدة الإشعارات الموحدة المتوافقة مع أكواد أخطاء المنصة ورسائلها المعربة
 */
export const notify = {
  success: (input: SuccessCode | string) => {
    const message =
      typeof input === "string" && input in SUCCESS_MESSAGES_AR
        ? SUCCESS_MESSAGES_AR[input as SuccessCode]
        : input;
    toast.success(message);
  },

  error: (input: ApiError | ErrorCode | string) => {
    if (typeof input === "string") {
      const message = input in ERROR_MESSAGES_AR ? ERROR_MESSAGES_AR[input as ErrorCode] : input;
      toast.error(message);
      return;
    }
    const message = input instanceof ApiError ? input.message : ERROR_MESSAGES_AR[input];
    toast.error(message);
  },

  info: (message: string) => {
    toast.info(message);
  },

  warning: (message: string) => {
    toast.warning(message);
  },
};

export { Toaster, toast };
