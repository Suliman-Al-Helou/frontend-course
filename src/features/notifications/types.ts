export type NotificationType = "enrollment" | "zoom_meeting" | "lesson" | "system";

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  action_url: string | null;
  read_at: string | null;
  created_at: string | null;
}

export interface NotificationsResponse {
  data: NotificationItem[];
  meta: {
    unread_count: number;
    current_page: number;
    last_page: number;
  };
}
