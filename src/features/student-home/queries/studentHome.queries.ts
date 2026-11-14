/**
 * Student Home TanStack Query v5 Factory
 */

import { queryOptions, keepPreviousData } from "@tanstack/react-query";
import { getStudentHomeStats, getZoomMeetingsByMonth } from "../api";
import type { ZoomMeeting } from "../types";

export const studentHomeKeys = {
  all: ["student-home"] as const,
  stats: () => [...studentHomeKeys.all, "stats"] as const,
  zoomAll: () => [...studentHomeKeys.all, "zoom"] as const,
  zoom: (monthsSignature: string) => [...studentHomeKeys.all, "zoom", monthsSignature] as const,
};

function mergeById(meetings: ZoomMeeting[]): ZoomMeeting[] {
  return [...new Map(meetings.map((m) => [m.id, m])).values()];
}

export const studentHomeQueries = {
  all: () => studentHomeKeys.all,

  stats: () =>
    queryOptions({
      queryKey: studentHomeKeys.stats(),
      queryFn: getStudentHomeStats,
      staleTime: 60 * 1000,
    }),

  zoom: (monthsSignature: string) =>
    queryOptions({
      queryKey: studentHomeKeys.zoom(monthsSignature),
      queryFn: async () => {
        const months = monthsSignature.split(",");
        const lists = await Promise.all(months.map((month) => getZoomMeetingsByMonth(month)));
        return mergeById(lists.flat());
      },
      placeholderData: keepPreviousData,
      refetchInterval: 60_000,
    }),
};
