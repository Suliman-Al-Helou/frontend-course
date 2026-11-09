"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getZoomMeetingsByMonth } from "@/lib/api/studentHome";
import { queryKeys } from "@/lib/queryKeys";
import type { ZoomMeeting } from "../types";

// Same meeting can come back from two adjacent months: dedupe by id.
function mergeById(meetings: ZoomMeeting[]): ZoomMeeting[] {
  return [...new Map(meetings.map((m) => [m.id, m])).values()];
}

// monthsSignature: "2026-09,2026-10" (max 3 months per visible range).
export function useZoomMeetings(monthsSignature: string) {
  return useQuery({
    queryKey: queryKeys.studentHome.zoom(monthsSignature),
    queryFn: async () => {
      const months = monthsSignature.split(",");
      const lists = await Promise.all(months.map((month) => getZoomMeetingsByMonth(month)));
      return mergeById(lists.flat());
    },
    placeholderData: keepPreviousData, // no flicker while navigating months
    refetchInterval: 60_000, // `can_join` is computed server-side: keep it fresh
  });
}
