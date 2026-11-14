import { NextRequest, NextResponse } from "next/server";
import { saveAuthSession } from "@/lib/session";
import { laravelFetch } from "@/lib/laravel-fetch";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body?.credential) {
      return NextResponse.json({ message: "رمز التحقق من Google مفقود" }, { status: 422 });
    }

    // إرسال الرمز للباك إند (Laravel) للتحقق منه
    const { res, data } = await laravelFetch("/auth/google", {
      method: "POST",
      body: { credential: body.credential },
    });

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    // تشفير التوكن وحفظ الجلسة في الكوكي الآمنة (iron-session)
    await saveAuthSession(data.token, data.user);

    // إعادة بيانات المستخدم فقط للفرونت إند (بدون التوكن لحمايته)
    return NextResponse.json({
      message: data.message,
      user: data.user,
    });
  } catch (error) {
    console.error("Google Auth Route Error:", error);
    return NextResponse.json(
      { message: "حدث خطأ غير متوقع أثناء معالجة تسجيل الدخول" },
      { status: 500 },
    );
  }
}
