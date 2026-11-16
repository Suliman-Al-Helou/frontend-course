"use client";

import { useEffect, useTransition } from "react";
import { ErrorState } from "@/components/shared/states/ErrorState";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    console.error(error);
  }, [error]);

  const handleRetry = () => {
    startTransition(() => {
      reset();
    });
  };

  return (
    <div dir="rtl" className="font-arabic">
      <ErrorState
        fullPage
        onRetry={handleRetry}
        retrying={isPending}
        message="عذراً، واجهنا مشكلة غير متوقعة. يمكنك المحاولة مجدداً أو العودة للصفحة الرئيسية."
      />
    </div>
  );
}

