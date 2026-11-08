import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { NextRequest, NextResponse } from "next/server";
import { sessionOptions, SessionData, LARAVEL_API_URL } from "@/lib/session";
import { extractUpdatedProfile } from "@/lib/auth-helpers";
// مسارات عامة فقط: courses, courses/5, instructors, instructors/5, faqs
const CACHEABLE = /^(courses|instructors)(\/\d+)?$|^faqs$/;
/**
 * بروكسي عام: أي طلب لـ /api/<path> (غير /api/auth/login|register|logout|me
 * المعرّفين بمسارات خاصة فوقه) بينعبّى مباشرة لـ Laravel، بعد ما نضيف
 * Authorization: Bearer من الجلسة المشفّرة (لو موجودة).
 *
 * هيك أي hook/component موجود بالمشروع (زي `api.get('/courses')`) بيظل
 * شغال بدون أي تعديل — بس التوكن هلق بيترحق من السيرفر، مش من المتصفح.
 */
async function forward(request: NextRequest, path: string[]) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

  const targetUrl = `${LARAVEL_API_URL}/${path.join("/")}${request.nextUrl.search}`;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (session.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  const hasBody = !["GET", "HEAD"].includes(request.method);
  let body: string | undefined;
  if (hasBody) {
    const raw = await request.text();
    if (raw) {
      body = raw;
      headers["Content-Type"] = "application/json";
    }
  }

  // 👇 1. تحديد إعدادات الكاش الافتراضية
  const joinedPath = path.join("/"); // يحول المصفوفة لنص مثل "courses" أو "faqs"
  const fetchOptions: RequestInit & { next?: { revalidate: number; tags: string[] } } = {
    method: request.method,
    headers,
    body,
    cache: "no-store", // الافتراضي: ما في تخزين
  };
  // 👇 2. فحص ذكي: إذا كان الطلب من نوع GET للمسارات العامة، نقوم بكاشيرتها
  if (request.method === "GET" && CACHEABLE.test(joinedPath)) {
    delete fetchOptions.cache;
    fetchOptions.next = { revalidate: 3600, tags: [joinedPath, path[0]] };
  }

  let laravelRes: Response;
  try {
    laravelRes = await fetch(targetUrl, fetchOptions);
  } catch {
    return NextResponse.json({ message: "تعذّر الاتصال بالسيرفر، حاول لاحقًا" }, { status: 502 });
  }

  const responseBody = await laravelRes.text();

  const response = new NextResponse(responseBody, {
    status: laravelRes.status,
    headers: {
      "Content-Type": laravelRes.headers.get("Content-Type") ?? "application/json",
    },
  });

  // التوكن انتهت صلاحيته أو أُلغي من جهة Laravel (Single Session Policy) — نظّف الجلسة فوراً وأرسل ترويسة مسح الكوكي للمتصفح
  if (laravelRes.status === 401) {
    session.destroy();
    response.cookies.delete(sessionOptions.cookieName);
  }

  // مزامنة بيانات الجلسة المشفّرة عند تحديث الملف الشخصي (Profile Mutation Resealing)
  if (
    laravelRes.ok &&
    ["PUT", "PATCH"].includes(request.method) &&
    path[0] === "users" &&
    session.user
  ) {
    const updated = extractUpdatedProfile(responseBody);
    if (updated) {
      session.user = {
        id: updated.id ?? session.user.id,
        name: updated.name ?? session.user.name,
        email: updated.email ?? session.user.email,
        role: updated.role ?? session.user.role,
      };
      await session.save();
    }
  }

  return response;
}

type RouteParams = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  return forward(request, (await params).path);
}
export async function POST(request: NextRequest, { params }: RouteParams) {
  return forward(request, (await params).path);
}
export async function PUT(request: NextRequest, { params }: RouteParams) {
  return forward(request, (await params).path);
}
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  return forward(request, (await params).path);
}
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  return forward(request, (await params).path);
}
