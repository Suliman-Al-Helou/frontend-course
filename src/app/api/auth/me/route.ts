import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { NextResponse } from "next/server";
import { sessionOptions, SessionData } from "@/lib/session";
import { laravelFetch } from "@/lib/laravel-fetch";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

  if (!session.token || !session.user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  // استدعاء حي لنقطة /auth/me في Laravel للتحقق من صلاحية التوكن وحالة الحساب الحالية
  let laravelRes: { res: { ok: boolean; status: number }; data: any };
  try {
    laravelRes = await laravelFetch("/auth/me", { token: session.token });
  } catch {
    // في حال تعذر الاتصال بالسيرفر مؤقتاً، نعتمد على بيانات الجلسة المحلية كـ Fallback مرن
    return NextResponse.json({ user: session.user }, { status: 200 });
  }

  const { res, data } = laravelRes;

  // 1. التوكن غير صالح أو تم إلغاؤه (Single Session Policy)
  if (res.status === 401) {
    session.destroy();
    const response = NextResponse.json({ user: null }, { status: 200 });
    response.cookies.delete(sessionOptions.cookieName);
    return response;
  }

  // 2. أي خطأ سيرفر آخر غير 401: نعتمد الجلسة المخزنة مؤقتاً لتجنب إخراج المستخدم دون سبب
  if (!res.ok) {
    return NextResponse.json({ user: session.user }, { status: 200 });
  }

  // 3. التحقق الصارم من حالة الحساب (إذا تم تعطيله من لوحة الإدارة)
  if (data?.is_active === false) {
    session.destroy();
    const response = NextResponse.json(
      { user: null, message: "تم تعطيل هذا الحساب، يرجى التواصل مع الإدارة" },
      { status: 403 },
    );
    response.cookies.delete(sessionOptions.cookieName);
    return response;
  }

  // 4. تحديث وحفظ بيانات الجلسة الحية (الاسم، الإيميل، الرتبة)
  if (data) {
    session.user = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
    };
    await session.save();
  }

  return NextResponse.json({ user: session.user }, { status: 200 });
}
