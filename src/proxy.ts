import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions, SessionData } from '@/lib/session';

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. فتح الجلسة المشفّرة وقراءة البيانات بأمان داخل الـ Edge Runtime
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  
  const token = session.token;
  const role = session.user?.role;

  // 2. حماية مسارات الـ Admin (/admin)
  if (path.startsWith('/admin')) {
    if (!token || role !== 'admin') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 3. حماية مسارات لوحة التحكم العامة للطلاب (/dashboard)
  if (path.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url)); // وجهه لصفحة تسجيل الدخول إذا لم يمتلك توكن
    }
    // إذا كان أدمن وحاول دخول لوحة تحكم الطلاب، وجهه للوحة الأدمن
    if (role === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

// تحديد المسارات التي سيتم تطبيق الحماية عليها أوتوماتيكياً
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
