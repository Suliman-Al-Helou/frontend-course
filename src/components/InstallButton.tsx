"use client";

import { useEffect, useState } from "react";
import { Download, Share, X, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const DISMISS_COOLDOWN_MS = 5 * 60 * 1000; // 5 دقائق

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    // 1. إذا كان التطبيق مثبتاً ويعمل كـ PWA بالفعل، لا داعي للزر
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      setIsInstallable(false);
      return;
    }

    // 2. التحقق مما إذا كان المستخدم قد أغلق الإشعار ومضى أقل من 5 دقائق
    try {
      const dismissedUntil = localStorage.getItem("pwa_prompt_dismissed_until");
      if (dismissedUntil && Date.now() < Number(dismissedUntil)) {
        setIsInstallable(false);
        // جدولة إعادة ظهور الزر بعد انقضاء المدة المتبقية من الـ 5 دقائق
        const remainingTime = Number(dismissedUntil) - Date.now();
        const timer = setTimeout(() => {
          setIsInstallable(true);
        }, remainingTime);
        return () => clearTimeout(timer);
      }
    } catch {}

    // 3. التحقق من أجهزة iOS
    const isIosDevice =
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as unknown as { MSStream?: unknown }).MSStream;
    if (isIosDevice) {
      setIsIos(true);
    }

    // إظهار الزر على شاشات الموبايل والمتصفحات المختلفة
    setIsInstallable(true);

    // 4. الاستماع لحدث قبل التثبيت في المتصفحات التي تدعمه (مثل Chrome / Edge / Samsung)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    // إذا كان المتصفح يوفر نافذة التثبيت التلقائية (Chrome / Edge / Android)
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstallable(false);
      }
      setDeferredPrompt(null);
      return;
    }

    // في متصفح Safari أو Firefox أو المتصفحات التي لا تطلق حدث التثبيت التلقائي
    setShowGuide(true);
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsInstallable(false);
    setShowGuide(false);
    try {
      const reappearAt = Date.now() + DISMISS_COOLDOWN_MS;
      localStorage.setItem("pwa_prompt_dismissed_until", String(reappearAt));
      // إعادة إظهار الزر بعد 5 دقائق تلقائياً إذا بقي المستخدم في الصفحة
      setTimeout(() => {
        setIsInstallable(true);
      }, DISMISS_COOLDOWN_MS);
    } catch {}
  };

  if (!isInstallable) return null;

  return (
    <>
      {/* زر التثبيت العائم أسفل الشاشة */}
      <div className="fixed bottom-5 end-5 z-50 flex items-center gap-1.5 rounded-2xl border border-border bg-card p-1.5 shadow-2xl transition-all animate-in fade-in-0 slide-in-from-bottom-3 duration-200">
        <Button onClick={handleInstallClick} aria-label="تثبيت تطبيق Future House على جهازك">
          <Download className="size-4 shrink-0" aria-hidden="true" />
          <span>تثبيت التطبيق</span>
        </Button>

        <Button
          variant="ghost"
          size="iconSm"
          onClick={handleDismiss}
          aria-label="إغلاق إشعار تثبيت التطبيق"
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" aria-hidden="true" />
        </Button>
      </div>

      {/* نافذة التوجيهات للمتصفحات التي تتطلب تثبيتاً يدوياً (iOS / Firefox / Desktop) */}
      {showGuide && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="guide-title"
          className="fixed inset-0 z-50 flex items-end justify-center bg-background/60 p-4 backdrop-blur-xs sm:items-center animate-in fade-in-0 duration-150"
          onClick={() => setShowGuide(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-2xl animate-in slide-in-from-bottom-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 id="guide-title" className="text-base font-bold text-foreground">
                {isIos ? "تثبيت التطبيق على آيفون" : "تثبيت التطبيق على جهازك"}
              </h3>
              <Button
                variant="ghost"
                size="iconSm"
                onClick={() => setShowGuide(false)}
                aria-label="إغلاق النافذة"
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </Button>
            </div>

            {isIos ? (
              <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2.5">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    1
                  </span>
                  <span>
                    اضغط على زر المشاركة{" "}
                    <Share className="mx-1 inline size-4 text-primary align-text-bottom" /> أسفل
                    شاشة Safari.
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    2
                  </span>
                  <span>
                    اختر <strong>إضافة إلى الشاشة الرئيسية</strong> (Add to Home Screen).
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    3
                  </span>
                  <span>
                    اضغط على <strong>إضافة</strong> في الزاوية العلوية.
                  </span>
                </li>
              </ol>
            ) : (
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2.5">
                  <HelpCircle className="mt-0.5 size-5 shrink-0 text-primary" />
                  <p>
                    لتثبيت التطبيق من متصفحك الحالي، اضغط على{" "}
                    <strong>قائمة الخيارات (⋮ أو ⋯)</strong> في شريط المتصفح، ثم اختر{" "}
                    <strong>&ldquo;تثبيت التطبيق&rdquo;</strong> (Install App) أو{" "}
                    <strong>&ldquo;إضافة إلى الشاشة الرئيسية&rdquo;</strong>.
                  </p>
                </div>
              </div>
            )}

            <Button onClick={() => setShowGuide(false)} className="mt-5 w-full">
              فهمت ذلك
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
