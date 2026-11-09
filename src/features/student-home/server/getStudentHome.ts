import "server-only";
import { getIronSessionData } from "@/lib/session";
import { laravelFetch } from "@/lib/laravel-fetch";
import type { StudentHomeResponse } from "../types";

// Reads the httpOnly session token on the server; the token never reaches the browser.
export async function fetchStudentHomeServer(): Promise<StudentHomeResponse | null> {
  const session = await getIronSessionData();
  if (!session.token) return null;

  const { res, data } = await laravelFetch("/dashboard/stats", { token: session.token });
  return res.ok ? (data as StudentHomeResponse) : null;
}
