import api from "@/lib/api";
import type { NotificationsResponse } from "../types";

export async function getNotifications(perPage = 15): Promise<NotificationsResponse> {
  const { data } = await api.get<NotificationsResponse>("/notifications", {
    params: { per_page: perPage },
  });
  return data;
}

export async function markNotificationAsRead(id: string): Promise<void> {
  await api.post(`/notifications/${id}/read`);
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await api.post("/notifications/read-all");
}
