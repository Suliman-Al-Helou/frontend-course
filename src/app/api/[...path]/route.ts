import { cookies } from 'next/headers';
import { getIronSession } from 'iron-session';
import { NextRequest, NextResponse } from 'next/server';
import { sessionOptions, SessionData, LARAVEL_API_URL } from '@/lib/session';

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

  const targetUrl = `${LARAVEL_API_URL}/${path.join('/')}${request.nextUrl.search}`;

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (session.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  const hasBody = !['GET', 'HEAD'].includes(request.method);
  let body: string | undefined;
  if (hasBody) {
    const raw = await request.text();
    if (raw) {
      body = raw;
      headers['Content-Type'] = 'application/json';
    }
  }

  let laravelRes: Response;
  try {
    laravelRes = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      cache: 'no-store',
    });
  } catch {
    return NextResponse.json({ message: 'تعذّر الاتصال بالسيرفر، حاول لاحقًا' }, { status: 502 });
  }

  // التوكن انتهت صلاحيته أو أُلغي من جهة Laravel — نظّف الجلسة المحلية كمان
  if (laravelRes.status === 401) {
    session.destroy();
  }

  const responseBody = await laravelRes.text();

  return new NextResponse(responseBody, {
    status: laravelRes.status,
    headers: {
      'Content-Type': laravelRes.headers.get('Content-Type') ?? 'application/json',
    },
  });
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
