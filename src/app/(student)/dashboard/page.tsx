import { HydrationBoundary } from "@tanstack/react-query";
import { StudentHome } from "@/features/student-home";
// Imported from /server directly: the barrel must stay client-safe.
import { getDehydratedStudentHome } from "@/features/student-home/server";

export default async function DashboardPage() {
  const state = await getDehydratedStudentHome();

  return (
    <HydrationBoundary state={state}>
      <StudentHome />
    </HydrationBoundary>
  );
}
