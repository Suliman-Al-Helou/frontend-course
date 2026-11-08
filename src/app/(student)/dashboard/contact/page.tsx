"use client";

import ContactPanel from "@/components/contact/ContactPanel";
import { useAuthStore } from "@/store/authStore";

export default function StudentContactPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">تواصل معنا</h2> {/* TODO: translate */}
        <p className="text-sm text-muted-foreground">
          واجهت مشكلة في كورس أو فيديو؟ راسلنا وسنساعدك. {/* TODO: translate */}
        </p>
      </div>
      <ContactPanel
        key={user?.email}
        initial={{ name: user?.name, email: user?.email }}
      />
    </div>
  );
}