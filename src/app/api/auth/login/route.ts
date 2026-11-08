import { NextRequest, NextResponse } from 'next/server';
import { saveAuthSession } from '@/lib/session';
import { laravelFetch } from '@/lib/laravel-fetch';

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { res, data } = await laravelFetch('/auth/login', { method: 'POST', body });

  // فشل الدخول (401/422/...) — رجّع نفس رسالة Laravel للفرونت إند متل ما هي
  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  await saveAuthSession(data.token, data.user);


  // ⚠️ التوكن ما بيترجع للمتصفح إطلاقًا — بس الـ user object لعرض الواجهة
  return NextResponse.json({ message: data.message, user: data.user });
}
