import { getIronSessionData } from "@/lib/session";
import { redirect } from "next/navigation";
import StudentLayoutClient from "./StudentLayoutClient";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await getIronSessionData();

  if (!session.token || !session.user) {
    redirect("/login?redirect=/dashboard");
  }

 
  return (
    <StudentLayoutClient user={session.user}>
      {children}
    </StudentLayoutClient>
  );
}
