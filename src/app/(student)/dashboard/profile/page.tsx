"use client";

import { useCurrentUser } from "@/features/auth";
import { User, Mail, GraduationCap } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

export default function ProfilePage() {
  const { user } = useCurrentUser();

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-foreground mb-8">ملفي الشخصي</h1>

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          {/* Cover */}
          <div className="h-32 bg-gradient-to-br from-primary to-primary/60" />

          {/* Avatar + Info */}
          <div className="flex flex-col items-center -mt-12 pb-6 px-6">
            {/* الصورة الرمزية للمستخدم في المنتصف */}
            <Avatar
              name={user?.name || user?.email}
              size="2xl"
              className="w-24 h-24 text-2xl border-4 border-card shadow-lg"
            />

            {/* الاسم والإيميل تحت الصورة */}
            <h2 className="text-lg font-bold text-foreground mt-3">{user?.name}</h2>
            <p className="text-sm text-muted-foreground mb-6">{user?.email}</p>

            {/* Info */}
            <div className="w-full space-y-3">
              <div className="flex items-center gap-3 p-3.5 bg-muted/50 rounded-xl">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">الاسم</p>
                  <p className="font-medium text-foreground text-sm">{user?.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 bg-muted/50 rounded-xl">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">البريد الإلكتروني</p>
                  <p className="font-medium text-foreground text-sm">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 bg-muted/50 rounded-xl">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">الدور</p>
                  <p className="font-medium text-foreground text-sm">
                    {(user as any)?.role === "admin" ? "مدير" : "طالب"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
