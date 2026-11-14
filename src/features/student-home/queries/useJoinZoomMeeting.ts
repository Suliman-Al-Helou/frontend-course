"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { joinZoomMeeting } from "../api";
import { studentHomeKeys } from "./studentHome.queries";
import { mapApiError } from "@/lib/errors/mapApiError";
import { notify } from "@/lib/toast";
import type { ZoomMeeting } from "../types";

interface JoinVariables {
  meeting: ZoomMeeting;
  popup: Window | null;
}

export function useJoinZoomMeeting() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ meeting }: JoinVariables) => joinZoomMeeting(meeting.id),
    onSuccess: ({ zoom_link }, { meeting, popup }) => {
      // "joined" only. "attended" is set by the server after code/manual confirmation.
      queryClient.setQueriesData<ZoomMeeting[]>({ queryKey: studentHomeKeys.zoomAll() }, (old) =>
        old?.map((m) => (m.id === meeting.id ? { ...m, joined: true } : m)),
      );

      if (popup) {
        popup.opener = null;
        popup.location.href = zoom_link;
      } else {
        window.location.href = zoom_link; // popup was blocked
      }
    },
    onError: (error, { popup }) => {
      popup?.close();
      notify.error(mapApiError(error));
    },
  });

  const join = (meeting: ZoomMeeting) => {
    if (!meeting.can_join) return;
    // Must open synchronously inside the click handler, or browsers block it.
    const popup = window.open("", "_blank");
    mutation.mutate({ meeting, popup });
  };

  const joiningId = mutation.isPending ? (mutation.variables?.meeting.id ?? null) : null;

  return { join, joiningId };
}
