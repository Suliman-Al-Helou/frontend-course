import "server-only";
import { getIronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import type { SessionData } from "../types";

export type { SessionData };

const fallbackSecret = "build-time-fallback-session-secret-min-32-chars-long";
const sessionSecret = process.env.SESSION_SECRET || fallbackSecret;

export const sessionOptions: SessionOptions = {
  password: sessionSecret,
  cookieName: "fh_session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
};

/** دومين الـ API الحقيقي (Laravel). سيرفر-فقط — بدون NEXT_PUBLIC_ عمدًا. */
export const LARAVEL_API_URL = process.env.LARAVEL_API_URL || "http://localhost:8000";

export async function saveAuthSession(token: string, user: SessionData["user"]) {
  if (!process.env.SESSION_SECRET && process.env.NODE_ENV === "production") {
    throw new Error(
      "SESSION_SECRET غير معرّف بمتغيرات البيئة. لازم يكون نص عشوائي 32 حرف أو أكتر — شوف .env.example",
    );
  }
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  session.token = token;
  session.user = user;
  await session.save();
  return session;
}

export async function getIronSessionData() {
  return await getIronSession<SessionData>(await cookies(), sessionOptions);
}

export async function destroyAuthSession() {
  const session = await getIronSessionData();
  session.destroy();
}
