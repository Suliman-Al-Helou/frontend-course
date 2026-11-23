import { getIronSessionData } from "@/lib/session";
import { redirect } from "next/navigation";
import { laravelFetch } from "@/lib/laravel-fetch";
import { evaluateInstructorAccess } from "@/lib/auth-helpers";
import type { User } from "@/types";
import InstructorLayoutClient from "./InstructorLayoutClient";

export default async function InstructorLayout({ children }: { children: React.ReactNode }) {
  const session = await getIronSessionData();

  if (!session.token || !session.user) {
    redirect("/login?redirect=/instructor");
  }

  let liveRole: User["role"] | null = null;
  const user = { ...session.user };

  // في حال كانت الجلسة مسجلة كطالب، نتحقق خادومياً من /auth/me للتحقق من أي ترقية حديثة لمدرب أو مسؤول
  if (user.role === "student") {
    try {
      const { res, data } = await laravelFetch("/auth/me", { token: session.token });
      if (res.ok && (data?.role === "instructor" || data?.role === "admin")) {
        liveRole = data.role;
        user.role = data.role;
      }
    } catch {
      // الاعتماد على الرتبة المحفوظة في حال تعذر الاتصال
    }
  }

  const decision = evaluateInstructorAccess(user, liveRole);

  if (decision.status === "redirect") {
    redirect(decision.target);
  }

  return <InstructorLayoutClient user={user}>{children}</InstructorLayoutClient>;
}
