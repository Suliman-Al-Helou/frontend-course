export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
      <div className="flex flex-col items-center gap-6">
        {/* Logo / Brand */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
          </div>
        </div>

        {/* Skeleton bars */}
        <div className="flex flex-col items-center gap-3 w-48">
          <div className="h-2.5 w-full bg-muted rounded-full animate-pulse" />
          <div className="h-2.5 w-4/5 bg-muted rounded-full animate-pulse" />
          <div className="h-2.5 w-3/5 bg-muted rounded-full animate-pulse" />
        </div>

        <p className="text-sm text-muted-foreground animate-pulse">جارٍ التحميل...</p>
      </div>
    </div>
  );
}