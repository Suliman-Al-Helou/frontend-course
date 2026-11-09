"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Script from "next/script";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { resolvePostLoginRedirect } from "@/lib/auth-helpers";
import { notify } from "@/lib/toast";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: (momentListener?: (notification: unknown) => void) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              type?: "standard" | "icon";
              text?: "signin_with" | "signup_with" | "continue_with";
              shape?: "rectangular" | "pill" | "circle" | "square";
              logo_alignment?: "left" | "center";
              width?: string | number;
              locale?: string;
            }
          ) => void;
          cancel: () => void;
        };
      };
    };
  }
}

interface GoogleAuthButtonProps {
  mode?: "signin" | "signup";
}

/**
 * الأيقونة الرسمية لـ Google بألوانها الأربعة الدقيقة
 */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

export function GoogleAuthButton({ mode = "signin" }: GoogleAuthButtonProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [isLoading, setIsLoading] = useState(false);
  const isSubmittingRef = useRef(false);
  const hiddenIframeRef = useRef<HTMLDivElement>(null);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const handleCredentialResponse = useCallback(
    async (response: { credential: string }) => {
      // Concurrency lock (منع الإرسال المزدوج)
      if (isSubmittingRef.current) return;
      isSubmittingRef.current = true;
      setIsLoading(true);

      try {
        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credential: response.credential }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "فشل تسجيل الدخول عبر Google");
        }

        // تحديث الحالة المركزية في Zustand
        setAuth(data.user);
        notify.success(data.message || "تم تسجيل الدخول بنجاح عبر Google");

        // التوجيه الذكي الآمن
        const redirectParam = searchParams?.get("redirect");
        const destination = resolvePostLoginRedirect(redirectParam, data.user);

        router.push(destination);
        router.refresh();
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "حدث خطأ أثناء الاتصال بحساب Google";
        notify.error(errorMessage);
        isSubmittingRef.current = false;
        setIsLoading(false);
      }
    },
    [router, searchParams, setAuth]
  );

  const initGoogleIdentity = useCallback(() => {
    if (!window.google || !clientId) return;

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // رسم زر Google الشفاف كـ overlay لالتقاط النقر الموثق بأمان
      if (hiddenIframeRef.current) {
        hiddenIframeRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(hiddenIframeRef.current, {
          theme: "outline",
          size: "large",
          type: "standard",
          shape: "rectangular",
          width: 320,
          locale: "ar",
        });
      }

      // تفعيل Google One Tap التلقائي للمستخدمين
      window.google.accounts.id.prompt();
    } catch (error) {
      console.error("Failed to initialize Google Identity Services:", error);
    }
  }, [clientId, handleCredentialResponse]);

  useEffect(() => {
    if (window.google) {
      initGoogleIdentity();
    }
  }, [initGoogleIdentity]);

  const buttonText =
    mode === "signup" ? "إنشاء حساب بواسطة Google" : "تسجيل الدخول بواسطة Google";

  if (!clientId) {
    return null;
  }

  return (
    <div className="w-full space-y-4">
      {/* الفاصل البصري المتناسق مع DESIGN.md */}
      <div className="relative flex items-center justify-center my-5" aria-hidden="true">
        <div className="border-t border-border w-full" />
        <span className="bg-card px-3 text-xs text-muted-foreground whitespace-nowrap font-arabic">
          أو المتابعة باستخدام
        </span>
        <div className="border-t border-border w-full" />
      </div>

      {/* نص برمجي خارجي لتحميل Google Identity Services */}
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={initGoogleIdentity}
      />

      {/* زر مخصص مطابق 100% لنظام التصميم DESIGN.md مع Overlay آمن */}
      <div className="relative w-full h-[44px] rounded-lg overflow-hidden group">
        {/* الزر المرئي المتطابق مع توكنز DESIGN.md */}
        <button
          type="button"
          disabled={isLoading}
          aria-label={buttonText}
          className="w-full h-[44px] flex items-center justify-center gap-3 px-4 rounded-lg border border-border bg-card hover:bg-muted/60 text-foreground text-sm font-medium font-arabic transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 group-hover:border-muted-foreground/30 shadow-xs active:scale-[0.99]"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          ) : (
            <GoogleIcon className="w-5 h-5 shrink-0" />
          )}
          <span className="truncate">{isLoading ? "جارٍ التحقق وتأكيد الدخول..." : buttonText}</span>
        </button>

        {/* حاوية غير مرئية تلتقط نقرة المستخدم لفتح نافذة Google الرسمية دون تأخير */}
        <div
          ref={hiddenIframeRef}
          className="absolute inset-0 opacity-[0.0001] cursor-pointer overflow-hidden flex items-center justify-center scale-125 z-10"
          aria-hidden="true"
          title={buttonText}
        />
      </div>
    </div>
  );
}
