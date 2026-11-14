import "server-only";
import { QueryClient, dehydrate, type DehydratedState } from "@tanstack/react-query";
import { studentHomeKeys } from "../queries/studentHome.queries";
import { fetchStudentHomeServer } from "./getStudentHome";

// If Laravel is slow (cold start), skip SSR data and let the client fetch + show skeleton.
const PREFETCH_BUDGET_MS = 1500;

// this is prefetch for data - if the data came in less than 1500 ms , it show the data
// if the data did not came .. show the page empty it,s ok
export async function getDehydratedStudentHome(): Promise<DehydratedState> {
  const queryClient = new QueryClient();

  const prefetch = queryClient.prefetchQuery({
    queryKey: studentHomeKeys.stats(),
    queryFn: async () => {
      const data = await fetchStudentHomeServer();
      if (!data) throw new Error("student-home prefetch failed");
      return data;
    },
  });
  const budget = new Promise<void>((resolve) => setTimeout(resolve, PREFETCH_BUDGET_MS));

  await Promise.race([prefetch, budget]);
  // Only successful queries are dehydrated by default, so failures fall back to the client.
  return dehydrate(queryClient);
}
