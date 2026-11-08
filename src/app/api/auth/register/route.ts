import { NextRequest, NextResponse } from 'next/server';
import { saveAuthSession } from '@/lib/session';
import { laravelFetch } from '@/lib/laravel-fetch';

export async function POST(request: NextRequest) {
  const body = await request.json();

  const { res, data } = await laravelFetch('/auth/register', { method: 'POST', body });

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

    await saveAuthSession(data.token, data.user);


  return NextResponse.json({ message: data.message, user: data.user }, { status: 201 });
}
