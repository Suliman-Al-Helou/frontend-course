"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  ExternalLink,
  Users,
  Pencil,
  Trash2,
  Video,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { mediaPipelineQueries } from "../queries/mediaPipeline.queries";
import type { AdminZoomMeeting, AttendanceRecord } from "../types";

interface LiveMeetingsViewProps {
  meetings: AdminZoomMeeting[];
  isLoading: boolean;
  onEdit: (meeting: AdminZoomMeeting) => void;
  onDelete: (meeting: AdminZoomMeeting) => void;
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("ar", { dateStyle: "medium", timeStyle: "short" });

function formatStudentsCount(count: number): string {
  if (count === 0) return "لا يوجد طلاب";
  if (count === 1) return "طالب واحد";
  if (count === 2) return "طالبان";
  if (count >= 3 && count <= 10) return `${count} طلاب`;
  return `${count} طالباً`;
}

function MeetingAttendancesDrawer({ meetingId }: { meetingId: number }) {
  const { data: attendances = [], isLoading } = useQuery(
    mediaPipelineQueries.attendances(meetingId),
  );

  return (
    <div className="border-t border-border pt-4 mt-2 space-y-3 animate-in fade-in-50 motion-reduce:animate-none duration-200">
      <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
        <Users className="w-4 h-4 text-primary" />
        <span>سجل الحضور المسجل للقاء ({formatStudentsCount(attendances.length)})</span>
      </h4>

      {isLoading ? (
        <div className="flex items-center gap-2 p-4 text-xs text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span>جارٍ جلب الحضور...</span>
        </div>
      ) : attendances.length === 0 ? (
        <p className="text-xs text-muted-foreground p-3 rounded-xl bg-muted/20">
          لم يتم تسجيل دخول أي طالب لهذا اللقاء حتى الآن.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {attendances.map((att: AttendanceRecord) => (
            <div
              key={att.id}
              className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30 border border-border/50 text-xs"
            >
              <div className="truncate">
                <p className="font-semibold text-foreground truncate">{att.user?.name}</p>
                <p className="text-[11px] text-muted-foreground truncate font-mono" dir="ltr">
                  {att.user?.email}
                </p>
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0 font-mono">
                {new Date(att.attended_at).toLocaleTimeString("ar", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LiveMeetingsView({
  meetings,
  isLoading,
  onEdit,
  onDelete,
}: LiveMeetingsViewProps) {
  const [openMeetingId, setOpenMeetingId] = useState<number | null>(null);

  const toggleAttendees = (meetingId: number) => {
    setOpenMeetingId((prev) => (prev === meetingId ? null : meetingId));
  };

  if (isLoading) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 space-y-3">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">جارٍ تحميل قائمة اللقاءات المباشرة...</p>
      </Card>
    );
  }

  if (meetings.length === 0) {
    return (
      <Card className="p-12 text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
          <Video className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-foreground">لا توجد لقاءات Zoom مجدولة حالياً</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          يمكنك جدولة لقاء مباشر جديد وربطه بأحد الكورسات ليظهر في جدول الطلاب.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {meetings.map((m) => {
          const courseTitle = m.course?.title || m.course_name || "كورس غير محدد";
          const isDrawerOpen = openMeetingId === m.id;

          return (
            <Card
              key={m.id}
              className="p-5 space-y-4 transition-colors hover:border-primary/30"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="primary">
                      {courseTitle}
                    </Badge>
                    <h3 className="text-sm font-bold text-foreground">{m.title}</h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground/70" />
                      {fmt(m.starts_at)}
                    </span>
                    {Boolean(m.duration_minutes) && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground/70" />
                        {m.duration_minutes} دقيقة
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* زر رابط الزووم */}
                  <a
                    href={m.zoom_link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 text-xs font-semibold transition-colors"
                  >
                    <span>فتح اللقاء</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {/* زر سجل الحضور */}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAttendees(m.id)}
                    className="h-9 px-3 rounded-xl text-xs gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5 text-primary" />
                    <span>
                      الحضور ({m.attendances_count ? formatStudentsCount(m.attendances_count) : "0"}
                      )
                    </span>
                    {isDrawerOpen ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                  </Button>

                  {/* تعديل */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(m)}
                    className="w-9 h-9 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground"
                    aria-label="تعديل اللقاء"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>

                  {/* حذف */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(m)}
                    className="w-9 h-9 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                    aria-label="حذف اللقاء"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {m.description && (
                <p className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-xl leading-relaxed">
                  {m.description}
                </p>
              )}

              {/* Attendance Roster Drawer */}
              {isDrawerOpen && <MeetingAttendancesDrawer meetingId={m.id} />}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
