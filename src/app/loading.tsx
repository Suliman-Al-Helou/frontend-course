export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="جارٍ تحميل الصفحة"
      className="min-h-screen bg-background flex items-center justify-center font-arabic"
      dir="rtl"
    >
      <div className="flex flex-col items-center gap-6">
        {/* Logo / Brand Spinner */}
        <div className="relative" aria-hidden="true">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin motion-reduce:animate-none" />
          </div>
        </div>

        {/* Skeleton bars */}
        <div className="flex flex-col items-center gap-3 w-48" aria-hidden="true">
          <div className="h-2.5 w-full bg-muted rounded-full animate-pulse motion-reduce:animate-none" />
          <div className="h-2.5 w-4/5 bg-muted rounded-full animate-pulse motion-reduce:animate-none" />
          <div className="h-2.5 w-3/5 bg-muted rounded-full animate-pulse motion-reduce:animate-none" />
        </div>

        <p className="text-sm text-muted-foreground animate-pulse motion-reduce:animate-none">
          جارٍ التحميل...
        </p>
      </div>
    </div>
  );
}
