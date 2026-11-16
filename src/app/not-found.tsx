import { Home, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 bg-background font-arabic" dir="rtl">
      {/* Ambient background glow conforming to DESIGN.md */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-md w-full text-center py-12">
        {/* 404 Number - Responsive and scalable */}
        <div className="relative mb-6 select-none" aria-hidden="true">
          <p className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tight leading-none text-foreground">
            4<span className="text-warning">0</span>4
          </p>
        </div>

        {/* Text */}
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3 tracking-tight">الصفحة غير موجودة</h1>
        <p className="text-muted-foreground text-sm sm:text-base mb-8 leading-relaxed max-w-sm mx-auto">
          يبدو أن الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>

        {/* Action Buttons using standard Button primitives */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
          <Button
            href="/"
            variant="default"
            size="default"
            className="gap-2 shadow-xs"
          >
            <Home className="w-4 h-4" />
            <span>الصفحة الرئيسية</span>
          </Button>

          <Button
            href="/courses"
            variant="outline"
            size="default"
            className="gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>تصفح الكورسات</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
