import api from "@/lib/api";
import type {
  JoinZoomResponse,
  StudentHomeResponse,
  ZoomMeeting,
} from "@/features/student-home/types";

export async function getStudentHomeStats(): Promise<StudentHomeResponse> {
  const { data } = await api.get<StudentHomeResponse>("/dashboard/stats");
  return data;
}

// month format: "2026-10"
export async function getZoomMeetingsByMonth(month: string): Promise<ZoomMeeting[]> {
  const { data } = await api.get<ZoomMeeting[]>("/zoom-meetings", { params: { month } });
  return data;
}

export async function joinZoomMeeting(meetingId: number): Promise<JoinZoomResponse> {
  const { data } = await api.post<JoinZoomResponse>(`/zoom-meetings/${meetingId}/attend`);
  return data;
}
