import { Home, Search, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen relative  flex items-center justify-center px-4" dir="rtl">
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-primary/50 to-transparent pointer-events-none"/>
      <div className="max-w-md w-full text-center">
        {/* 404 Number */}
        <div className="relative mb-6">
          <p className="text-[200px] font-black   leading-none select-none">
            4<span className='text-warning'>0</span>4
          </p>
  
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