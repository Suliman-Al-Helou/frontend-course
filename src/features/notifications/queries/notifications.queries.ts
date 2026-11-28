import { queryOptions } from "@tanstack/react-query";
import { getNotifications } from "../api/notificationsApi";

export const notificationKeys = {
  all: ["notifications"] as const,
  list: (perPage = 15) => [...notificationKeys.all, "list", perPage] as const,
};

export const notificationQueries = {
  list: (perPage = 15) =>
    queryOptions({
      queryKey: notificationKeys.list(perPage),
      queryFn: () => getNotifications(perPage),
      staleTime: 30_000,
      refetchInterval: 60_000,
      refetchOnWindowFocus: true,
    }),
};
