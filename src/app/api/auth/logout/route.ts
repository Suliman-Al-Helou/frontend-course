import { NextResponse } from 'next/server';
import { destroyAuthSession, getIronSessionData, LARAVEL_API_URL } from '@/lib/session';
import { laravelFetch } from '@/lib/laravel-fetch';

export async function POST() {
  const session = await getIronSessionData(); 

  if (session?.token) {
    // نبلّغ Laravel يلغي التوكن (currentAccessToken()->delete())
    // حتى لو فشل الاتصال، لازم الجلسة المحلية تنمسح برضه
    await laravelFetch('/auth/logout', { 
      method: 'POST', 
      token: session.token 
    }).catch(() => {});
  }

  await destroyAuthSession();

  return NextResponse.json({ message: 'تم تسجيل الخروج بنجاح' });
}
