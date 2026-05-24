import { Home, Search, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4" dir="rtl">
      <div className="max-w-md w-full text-center">
        {/* 404 Number */}
        <div className="relative mb-6">
          <p className="text-[120px] font-black text-primary/10 leading-none select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Search className="w-10 h-10 text-primary" />
            </div>
          </div>
        </div>

        {/* Text */}
        <h1 className="text-2xl font-bold text-foreground mb-2">
          الصفحة غير موجودة
        </h1>
        <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
          يبدو أن الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <Home className="w-4 h-4" />
            الصفحة الرئيسية
          </Link>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            تصفح الكورسات
          </Link>
        </div>
      </div>
    </div>
  );
}