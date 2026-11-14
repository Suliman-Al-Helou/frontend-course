"use client";

import { useQuery } from "@tanstack/react-query";
import { studentHomeQueries } from "./studentHome.queries";

// monthsSignature: "2026-09,2026-10" (max 3 months per visible range).
export function useZoomMeetings(monthsSignature: string) {
  return useQuery(studentHomeQueries.zoom(monthsSignature));
}
