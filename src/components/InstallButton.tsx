"use client";

import { useEffect, useState } from "react";

// تعريف نوع الحدث الخاص بالتثبيت
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // منع المتصفح من إظهار البوب أب التلقائي المزعج
      e.preventDefault();
      // حفظ الحدث لاستخدامه عند الضغط على الزر المخصص
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // إظهار الزر الخاص بك في الموقع
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // التحقق مما إذا كان التطبيق مثبتاً بالفعل
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // إظهار نافذة التثبيت الخاصة بالمتصفح
    await deferredPrompt.prompt();

    // معرفة خيار المستخدم (هل وافق أم رفض؟)
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("المستخدم وافق على تثبيت تطبيق Future House");
    } else {
      console.log("المستخدم رفض التثبيت");
    }

    // إخفاء الزر المخصص بعد التفاعل
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  // إذا كان التطبيق غير قابل للتثبيت حالياً، لا تعرض الزر
  if (!isInstallable) return null;

  return (
    <button
      onClick={handleInstallClick}
      className="bg-primary hover:bg-primary-hover text-primary-foreground font-arabic px-4 py-2 rounded-md shadow-md transition-all duration-200 fixed bottom-5 right-5 z-50 flex items-center gap-2"
    >
      📱 تثبيت تطبيق Future House
    </button>
  );
}
