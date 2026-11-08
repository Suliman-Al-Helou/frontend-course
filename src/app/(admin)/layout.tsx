import { getIronSessionData } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getIronSessionData();

  if (!session.token || !session.user) {
    redirect("/login?redirect=/admin");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
