import { getIronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';
import type { User } from '@/types';
/**
 * شكل البيانات المخزّنة جوا الـ session المشفّرة (iron-session).
 * هاد المكان الوحيد يلي فيه الـ Bearer token الحقيقي — وهو موجود
 * بس بجانب السيرفر (Route Handlers + Middleware)، وما بيوصل لأي
 * كود جافاسكريبت شغال بالمتصفح إطلاقًا.
 */
export interface SessionData {
  token?: string;
  user?:User;
}

if (!process.env.SESSION_SECRET) {
  // فشل واضح وقت التشغيل أفضل من جلسة صامتة غير آمنة بـ production
  throw new Error(
    'SESSION_SECRET غير معرّف بمتغيرات البيئة. لازم يكون نص عشوائي 32 حرف أو أكتر — شوف .env.example',
  );
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: 'fh_session',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    // 30 يوم — نفس مدة صلاحية الكوكيز القديمة
    maxAge: 60 * 60 * 24 * 30,
  },
};

/** دومين الـ API الحقيقي (Laravel). سيرفر-فقط — بدون NEXT_PUBLIC_ عمدًا. */
export const LARAVEL_API_URL = process.env.LARAVEL_API_URL as string;

if (!LARAVEL_API_URL) {
  throw new Error('LARAVEL_API_URL غير معرّف بمتغيرات البيئة — شوف .env.example');
}

export async function saveAuthSession(token: string, user: SessionData['user']) {
  // 1. فتح الجلسة أو إنشاؤها
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  
  // 2. تعبئة البيانات
  session.token = token;
  session.user = user;
  
  // 3. التشفير والحفظ التلقائي في الكوكي
  await session.save();
  
  return session;
}

// دالة مساعدة لقراءة بيانات الجلسة الحالية من أي مكان في السيرفر
export async function getIronSessionData() {
  return await getIronSession<SessionData>(await cookies(), sessionOptions);
}


// دالة موحدة لتدمير الجلسة وحذف الكوكي تماماً من متصفح المستخدم
export async function destroyAuthSession() {
  const session = await getIronSessionData();
   session.destroy();
}