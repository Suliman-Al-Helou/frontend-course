import React from "react";
import { Sparkles } from "lucide-react";
import { getIronSessionData } from "@/lib/session";
import { InstructorDashboardOverview } from "@/features/instructor-portal";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "لوحة تحكم المدرب | Future House Academy",
  description: "بوابة الهيئة التدريسية لإدارة المقررات والمناهج والطلاب",
};

export default async function InstructorDashboardPage() {
  const session = await getIronSessionData();
  const userName = session.user?.name ?? "المدرب";

  return (
    <div className="space-y-8 animate-in fade-in duration-300 motion-reduce:animate-none">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-primary/15 via-primary/5 to-transparent border border-primary/20 p-6 sm:p-8">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>بوابة الهيئة التدريسية المعتمدة</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
            مرحباً بك، {userName} 👋
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            من هنا يمكنك إدارة وتطوير المحتوى التعليمي للمقررات الموكلة إليك، ومتابعة تفاعل الطلاب،
            وبناء المهام التفاعلية.
          </p>
        </div>
      </div>

      {/* Main Dynamic Overview (Stats KPIs + Recent Courses Grid / Contextual Empty State) */}
      <InstructorDashboardOverview />
    </div>
  );
}
